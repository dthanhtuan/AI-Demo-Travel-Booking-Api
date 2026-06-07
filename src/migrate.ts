import fs from "fs";
import path from "path";
import { pool, closePool } from "./db";

async function migrate(): Promise<void> {
  const dir = path.join(__dirname, "..", "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }
  console.log("Migrations complete.");
}

migrate()
  .then(() => closePool())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
