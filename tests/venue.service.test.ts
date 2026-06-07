import * as venueService from "../src/venue/venue.service";
import { pool } from "../src/db";

async function seedVenue(city: string, price: number): Promise<number> {
  const r = await pool.query(
    `INSERT INTO venues (name, city, capacity, price_per_night)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [`${city} Venue ${Date.now()}`, city, 10, price]
  );
  return r.rows[0].id;
}

describe("venue.service.listVenues", () => {
  let hanoiCheapId: number;
  let hanoiExpensiveId: number;
  let saigonId: number;

  beforeAll(async () => {
    hanoiCheapId = await seedVenue("Hanoi", 80);
    hanoiExpensiveId = await seedVenue("Hanoi", 150);
    saigonId = await seedVenue("Saigon", 90);
  });

  it("returns all venues when no filter is given", async () => {
    const venues = await venueService.listVenues();
    const ids = venues.map((v) => v.id);
    expect(ids).toContain(hanoiCheapId);
    expect(ids).toContain(hanoiExpensiveId);
    expect(ids).toContain(saigonId);
  });

  it("filters by city (case-insensitive)", async () => {
    const venues = await venueService.listVenues({ city: "hanoi" });
    const ids = venues.map((v) => v.id);
    expect(ids).toContain(hanoiCheapId);
    expect(ids).toContain(hanoiExpensiveId);
    expect(ids).not.toContain(saigonId);
    venues.forEach((v) => expect(v.city.toLowerCase()).toBe("hanoi"));
  });

  it("filters by maxPrice", async () => {
    const venues = await venueService.listVenues({ maxPrice: 100 });
    const ids = venues.map((v) => v.id);
    expect(ids).toContain(hanoiCheapId);
    expect(ids).toContain(saigonId);
    expect(ids).not.toContain(hanoiExpensiveId);
    venues.forEach((v) => expect(Number(v.price_per_night)).toBeLessThanOrEqual(100));
  });

  it("combines city and maxPrice filters", async () => {
    const venues = await venueService.listVenues({ city: "Hanoi", maxPrice: 100 });
    const ids = venues.map((v) => v.id);
    expect(ids).toContain(hanoiCheapId);
    expect(ids).not.toContain(hanoiExpensiveId);
    expect(ids).not.toContain(saigonId);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM venues WHERE id = ANY($1)", [
      [hanoiCheapId, hanoiExpensiveId, saigonId],
    ]);
  });
});
