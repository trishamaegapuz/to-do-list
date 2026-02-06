<<<<<<< HEAD
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
=======
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let newPool;

if (process.env.NODE_ENV === "development") {
  newPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT), // ensure number
  });
} else {
  newPool = new Pool({
    ssl: {
      rejectUnauthorized: false,
    },
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?options=project=${process.env.ENDPOINT_ID}`,
  });
}

export const pool = newPool;
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
