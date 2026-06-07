import { query } from "../db";
import { Customer } from "../types";

export async function findAll(): Promise<Customer[]> {
  return query<Customer>("SELECT * FROM customers ORDER BY id");
}

export async function findById(id: number): Promise<Customer | null> {
  const rows = await query<Customer>("SELECT * FROM customers WHERE id = $1", [id]);
  return rows[0] ?? null;
}
