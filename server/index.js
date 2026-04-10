import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // CRITICAL para sa Render + HTTPS

app.use(express.json());

app.use(cors({
  origin: 'https://to-do-list-rho-sable-68.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  session({
    name: 'todo_sid',
    secret: 'secure-session-key-2026',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true, // true dahil HTTPS ang Render at Vercel
      httpOnly: true,
      sameSite: 'none', // Kailangan 'none' para gumana ang cookies across different domains
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// --- AUTH ROUTES ---

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
    const hashedPassword = await hashPassword(password);
    await pool.query('INSERT INTO user_accounts (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
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

    // I-set ang session
    req.session.user = { id: user.id, username: user.username };

    // IMPORTANTE: Siguraduhing na-save ang session bago mag-respond
    req.session.save((err) => {
      if (err) return res.status(500).json({ success: false });
      return res.status(200).json({ success: true, user: { username: user.username } });
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('todo_sid', {
      secure: true,
      sameSite: 'none',
      httpOnly: true
    });
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

// (Keep your other API routes: PUT, DELETE, etc. same as before)

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));