import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Importante para sa Render (HTTPS/Proxy)
app.set('trust proxy', 1); 
app.use(express.json());

app.use(cors({
  origin: 'https://to-do-list-rho-sable-68.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Pinayagan na ang edit at delete
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  session({
    name: 'todo_sid',
    secret: 'secure-session-key-2026', 
    resave: true, 
    saveUninitialized: false,
    proxy: true, // Kailangan para gumana ang secure cookie sa Render
    cookie: {
      secure: true, 
      httpOnly: true,
      sameSite: 'none', // Kailangan para sa Cross-site (Vercel to Render)
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: "Unauthorized" });
};

// --- AUTH ---
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ success: false });
    
    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ success: false });
    
    req.session.user = { id: user.id, username: user.username };
    req.session.save((err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('todo_sid', { secure: true, sameSite: 'none' });
    res.json({ success: true });
  });
});

// --- LIST API ---
app.get('/api/list', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/list', isAuthenticated, async (req, res) => {
  const { title } = req.body;
  const result = await pool.query('INSERT INTO list (title, status) VALUES ($1, $2) RETURNING *', [title, 'pending']);
  res.json(result.rows[0]);
});

app.put('/api/list/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  await pool.query('UPDATE list SET title = $1 WHERE id = $2', [title, id]);
  res.json({ success: true });
});

app.delete('/api/list/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE list_id = $1', [id]);
  await pool.query('DELETE FROM list WHERE id = $1', [id]);
  res.json({ success: true });
});

// --- ITEMS API ---
app.get('/api/items/:id', isAuthenticated, async (req, res) => {
  const result = await pool.query('SELECT * FROM items WHERE list_id = $1 ORDER BY id ASC', [req.params.id]);
  res.json(result.rows);
});

app.post('/api/items', isAuthenticated, async (req, res) => {
  const { list_id, description } = req.body;
  await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [list_id, description, 'pending']);
  res.json({ success: true });
});

app.put('/api/items/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { status, description } = req.body;
  if (status !== undefined) await pool.query('UPDATE items SET status = $1 WHERE id = $2', [status, id]);
  if (description !== undefined) await pool.query('UPDATE items SET description = $1 WHERE id = $2', [description, id]);
  res.json({ success: true });
});

app.delete('/api/items/:id', isAuthenticated, async (req, res) => {
  await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));