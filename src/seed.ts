import fs from "fs";
import path from "path";
import { pool, closePool } from "./db";

async function seed(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _seeds (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const dir = path.join(__dirname, "..", "seeds");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const { rows } = await pool.query(
      "SELECT 1 FROM _seeds WHERE filename = $1",
      [file]
    );
    if (rows.length > 0) {
      console.log(`Skipping seed (already applied): ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    console.log(`Running seed: ${file}`);
    await pool.query(sql);
    await pool.query("INSERT INTO _seeds (filename) VALUES ($1)", [file]);
  }

  console.log("Seeding complete.");
}

seed()
  .then(() => closePool())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
