import { query } from "../db";
import { Venue } from "../types";

export async function findAll(): Promise<Venue[]> {
  return query<Venue>("SELECT * FROM venues ORDER BY id");
}

export async function findById(id: number): Promise<Venue | null> {
  const rows = await query<Venue>("SELECT * FROM venues WHERE id = $1", [id]);
  return rows[0] ?? null;
}
