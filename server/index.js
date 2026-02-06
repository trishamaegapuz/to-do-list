import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); 
app.use(express.json());

app.use(cors({
  origin: 'https://to-do-list-rho-sable-68.vercel.app',
  credentials: true
}));

app.use(
  session({
    name: 'todo_sid',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, 
      httpOnly: true,
      sameSite: 'none',
    }
  })
);

// --- AUTH ROUTES ---
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    await pool.query('INSERT INTO user_accounts (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.json({ success: true, message: "Account created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Username already exists." });
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
    
    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true });
  } catch (err) { 
    res.status(500).json({ success: false }); 
  }
});

// --- LIST & ITEMS API ---
app.get('/api/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/list', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO list (title) VALUES ($1) RETURNING *', [title]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM list WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM items WHERE list_id = $1 ORDER BY id ASC', [id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/items', async (req, res) => {
  try {
    const { list_id, description, status } = req.body;
    await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [list_id, description, status]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});