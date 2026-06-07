import * as bookingService from "../src/booking/booking.service";
import { ValidationError } from "../src/booking/booking.service";
import { pool } from "../src/db";

// These tests run against the Postgres instance from docker compose.
// Run with:  npm test   (DB must be up:  docker compose up -d db)

async function seedCustomer(): Promise<number> {
  const r = await pool.query(
    `INSERT INTO customers (name, email) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ["Test User", `test-${Date.now()}@example.com`]
  );
  return r.rows[0].id;
}

async function seedVenue(capacity = 5): Promise<number> {
  const r = await pool.query(
    `INSERT INTO venues (name, city, capacity, price_per_night)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    ["Test Venue", "Testville", capacity, 50]
  );
  return r.rows[0].id;
}

describe("booking.service.createBooking", () => {
  it("creates a valid booking", async () => {
    const customerId = await seedCustomer();
    const venueId = await seedVenue();

    const booking = await bookingService.createBooking({
      customer_id: customerId,
      venue_id: venueId,
      check_in: "2026-07-01",
      check_out: "2026-07-05",
    });

    expect(booking.id).toBeGreaterThan(0);
    expect(booking.status).toBe("confirmed");
    expect(booking.venue_id).toBe(venueId);
  });

  it("rejects check_out on or before check_in", async () => {
    const customerId = await seedCustomer();
    const venueId = await seedVenue();

    await expect(
      bookingService.createBooking({
        customer_id: customerId,
        venue_id: venueId,
        check_in: "2026-07-05",
        check_out: "2026-07-01",
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects a booking for a non-existent venue", async () => {
    const customerId = await seedCustomer();

    await expect(
      bookingService.createBooking({
        customer_id: customerId,
        venue_id: 999999,
        check_in: "2026-07-01",
        check_out: "2026-07-05",
      })
    ).rejects.toThrow(/Venue .* does not exist/);
  });

  it("rejects a booking for a non-existent customer", async () => {
    const venueId = await seedVenue();

    await expect(
      bookingService.createBooking({
        customer_id: 999999,
        venue_id: venueId,
        check_in: "2026-07-01",
        check_out: "2026-07-05",
      })
    ).rejects.toThrow(/Customer .* does not exist/);
  });

  it("rejects when the venue is fully booked for the dates", async () => {
    const venueId = await seedVenue(1); // capacity 1
    const c1 = await seedCustomer();
    const c2 = await seedCustomer();

    await bookingService.createBooking({
      customer_id: c1,
      venue_id: venueId,
      check_in: "2026-08-01",
      check_out: "2026-08-10",
    });

    await expect(
      bookingService.createBooking({
        customer_id: c2,
        venue_id: venueId,
        check_in: "2026-08-05",
        check_out: "2026-08-15",
      })
    ).rejects.toThrow(/fully booked/);
  });
});
