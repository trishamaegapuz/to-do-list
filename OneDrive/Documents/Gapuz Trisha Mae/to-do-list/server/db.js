// db.js - Gawin nating mas simple at matibay
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export { pool };