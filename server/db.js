// server/db.js
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

// Idagdag ang ?sslmode=require sa dulo
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;

export const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Panatilihin ito para sa self-signed certificates ng cloud providers
  },
});