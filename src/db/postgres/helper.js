import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve .env from project root, regardless of where `node` is launched.
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const requiredEnvVars = [
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_PORT",
  "POSTGRES_HOST",
  "POSTGRES_DB",
];

for (const key of requiredEnvVars) {
  const value = process.env[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const { Pool } = pg;
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
});

export const PostgresHelper = {
  query: async (query, params) => {
    const client = await pool.connect();
    const results = await client.query(query, params);
    await client.release();

    return results.rows;
  },
};
