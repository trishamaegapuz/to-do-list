import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(
  session({
    name: 'connect.sid',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);
g
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ success: false });

    const user = result.rows[0];
    const match = await comparePassword(password, user.password);

    if (!match)
      return res.status(401).json({ success: false });

    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await hashPassword(password);

    await pool.query(
      'INSERT INTO user_accounts (username, password) VALUES ($1,$2)',
      [username, hashed]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('https://to-do-list-8a22.onrender.com/api/list', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM list ORDER BY id ASC'
  );
  res.json(result.rows);
});

app.post('https://to-do-list-8a22.onrender.com/api/list', async (req, res) => {
  const { title } = req.body;
  await pool.query(
    'INSERT INTO list (title) VALUES ($1)',
    [title]
  );
  res.json({ success: true });
});

app.put('https://to-do-list-8a22.onrender.com/api/list/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  await pool.query(
    'UPDATE list SET title = $1 WHERE id = $2',
    [title, id]
  );
  res.json({ success: true });
});

app.delete('https://to-do-list-8a22.onrender.com/api/list/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE list_id = $1', [id]);
  await pool.query('DELETE FROM list WHERE id = $1', [id]);
  res.json({ success: true });
});

app.get('https://to-do-list-8a22.onrender.com/api/items/:listId', async (req, res) => {
  const { listId } = req.params;
  const result = await pool.query(
    'SELECT * FROM items WHERE list_id = $1 ORDER BY id ASC',
    [listId]
  );
  res.json(result.rows);
});

app.post('https://to-do-list-8a22.onrender.com/api/items', async (req, res) => {
  const { list_id, description, status } = req.body;
  await pool.query(
    'INSERT INTO items (list_id, description, status) VALUES ($1,$2,$3)',
    [list_id, description, status]
  );
  res.json({ success: true });
});

app.put('https://to-do-list-8a22.onrender.com/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await pool.query(
    'UPDATE items SET status = $1 WHERE id = $2',
    [status, id]
  );
  res.json({ success: true });
});

app.patch('https://to-do-list-8a22.onrender.com/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  await pool.query(
    'UPDATE items SET description = $1 WHERE id = $2',
    [description, id]
  );
  res.json({ success: true });
});

app.delete('https://to-do-list-8a22.onrender.com/api/items/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(
    'DELETE FROM items WHERE id = $1',
    [id]
  );
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING http://localhost:${PORT}`);
});
