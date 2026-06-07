import { pool } from "../src/db";
import fs from "fs";
import path from "path";

beforeAll(async () => {
  // Ensure schema exists for the test database.
  const dir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    await pool.query(sql);
  }
});

afterAll(async () => {
  await pool.end();
});
