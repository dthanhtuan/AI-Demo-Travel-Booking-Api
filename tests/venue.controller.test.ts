import request from "supertest";
import express from "express";
import { venueRouter } from "../src/venue/venue.controller";
import * as service from "../src/venue/venue.service";

jest.mock("../src/venue/venue.service");

const app = express();
app.use(express.json());
app.use("/venues", venueRouter);

describe("GET /venues/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the venue when found", async () => {
    const mockVenue = { id: 1, name: "Test Venue", capacity: 100 };
    (service.getVenue as jest.Mock).mockResolvedValue(mockVenue);

    const response = await request(app).get("/venues/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockVenue);
  });

  it("should return 404 when venue not found", async () => {
    (service.getVenue as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/venues/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Venue not found" });
  });
});
