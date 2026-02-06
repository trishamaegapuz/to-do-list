import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let newPool;

// Sinunod natin ang logic ng professor mo para sa Dev at Production
if (process.env.NODE_ENV === "development") {
  newPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432, 
  });
} else {
  // Para sa Render/Neon deployment (Production)
  newPool = new Pool({
    ssl: {
      rejectUnauthorized: false,
    },
    // Siguraduhing may ENDPOINT_ID ka sa environment variables kung ito ang format na gusto ng prof mo
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?options=project=${process.env.ENDPOINT_ID}`,
  });
}

// Exporting 'pool' para magamit sa index.js
export const pool = newPool;