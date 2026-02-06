import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let newPool;

if (process.env.NODE_ENV === "development") {
  newPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432, 
  });
} else {
  // UPDATE: Mas malinis na connection string para sa Production
  newPool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export const pool = newPool;