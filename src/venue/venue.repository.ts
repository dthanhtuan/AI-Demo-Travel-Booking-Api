import { query } from "../db";
import { Venue, VenueFilter } from "../types";

export async function findAll(filter: VenueFilter = {}): Promise<Venue[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.city !== undefined) {
    params.push(filter.city.toLowerCase());
    conditions.push(`LOWER(city) = $${params.length}`);
  }

  if (filter.maxPrice !== undefined) {
    params.push(filter.maxPrice);
    conditions.push(`price_per_night <= $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return query<Venue>(`SELECT * FROM venues ${where} ORDER BY id`, params);
}

export async function findById(id: number): Promise<Venue | null> {
  const rows = await query<Venue>("SELECT * FROM venues WHERE id = $1", [id]);
  return rows[0] ?? null;
}
