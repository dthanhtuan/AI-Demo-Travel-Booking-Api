import { query } from "../db";
import { Booking, CreateBookingInput } from "../types";

export async function findAll(): Promise<Booking[]> {
  return query<Booking>("SELECT * FROM bookings ORDER BY id");
}

export async function findById(id: number): Promise<Booking | null> {
  const rows = await query<Booking>("SELECT * FROM bookings WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function create(input: CreateBookingInput): Promise<Booking> {
  const rows = await query<Booking>(
    `INSERT INTO bookings (customer_id, venue_id, check_in, check_out)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.customer_id, input.venue_id, input.check_in, input.check_out]
  );
  return rows[0];
}

// Count active (confirmed) bookings that overlap the given date range for a venue.
export async function countOverlapping(
  venueId: number,
  checkIn: string,
  checkOut: string
): Promise<number> {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
       FROM bookings
      WHERE venue_id = $1
        AND status = 'confirmed'
        AND check_in < $3
        AND check_out > $2`,
    [venueId, checkIn, checkOut]
  );
  return Number(rows[0].count);
}
