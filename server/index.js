import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); 
app.use(express.json());

// CORS CONFIG
app.use(cors({
  origin: 'https://to-do-list-rho-sable-68.vercel.app',
  credentials: true
}));

// SESSION CONFIG
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

// --- MGA ROUTES (API ONLY) ---

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ success: false });
    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ success: false });
    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

// ... (Idagdag dito ang iba pang /api routes mo pero BAWAL ang JSX/HTML code)

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});