import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

// NAPAKAHALAGA: Kailangan ito para gumana ang Secure Cookies sa Render/Vercel proxy
app.set('trust proxy', 1); 

app.use(express.json());

// Fixed CORS: Siguraduhin na walang trailing slash (/) ang origin URL
app.use(cors({
  origin: 'https://to-do-list-rho-sable-68.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  session({
    name: 'todo_sid',
    secret: 'taskflow-secret-key-2026', 
    resave: false, // Iniba sa false para sa better performance
    saveUninitialized: false,
    proxy: true, 
    cookie: {
      secure: true, // Dahil naka-HTTPS ang Vercel at Render
      httpOnly: true,
      sameSite: 'none', // Importante para sa Cross-site cookies
      maxAge: 24 * 60 * 60 * 1000,
      partitioned: true // Dagdag security/compatibility sa mga bagong browser
    }
  })
);

// MIDDLEWARE: Proteksyon para sa iyong mga API
const isAuthenticated = (req, res, next) => {
  // Debug log para makita kung may session (Optional: Tanggalin sa production)
  console.log("Checking session for user:", req.session.user);
  
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized - Session Expired" });
};

// --- AUTH ROUTES ---

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    await pool.query('INSERT INTO user_accounts (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.json({ success: true });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: "User not found" });
    
    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    
    if (!match) return res.status(401).json({ success: false, message: "Wrong password" });
    
    // I-save ang user info sa session
    req.session.user = { id: user.id, username: user.username };
    
    // FORCE SAVE: Siguraduhing naka-save ang session bago mag-reply
    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message }); 
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false });
    res.clearCookie('todo_sid', {
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    res.json({ success: true });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// --- LIST API (Example of protected route) ---

app.get('/api/list', isAuthenticated, async (req, res) => {
  try {
    // Kinukuha lang ang tasks ng user (Dapat may user_id ang table mo)
    const result = await pool.query('SELECT * FROM list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { 
    res.status(500).json({ error: "Database error" }); 
  }
});

app.post('/api/list', isAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO list (title, status) VALUES ($1, $2) RETURNING *', [title, 'pending']);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/list/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await pool.query('UPDATE list SET title = $1 WHERE id = $2', [title, id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/list/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE list_id = $1', [id]);
    await pool.query('DELETE FROM list WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- ITEMS API ---

app.get('/api/items/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM items WHERE list_id = $1 ORDER BY id ASC', [id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/items', isAuthenticated, async (req, res) => {
  try {
    const { list_id, description, status } = req.body;
    await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [list_id, description, status || 'pending']);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/items/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;
    if (status !== undefined) await pool.query('UPDATE items SET status = $1 WHERE id = $2', [status, id]);
    if (description !== undefined) await pool.query('UPDATE items SET description = $1 WHERE id = $2', [description, id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/items/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));