import { Router, Request, Response } from "express";
import * as service from "./venue.service";
import { VenueFilter } from "../types";

export const venueRouter = Router();

// GET /venues  — list all venues, with optional ?city= and ?maxPrice= filters
venueRouter.get("/", async (req: Request, res: Response) => {
  const filter: VenueFilter = {};

  if (req.query.city !== undefined) {
    filter.city = String(req.query.city);
  }

  if (req.query.maxPrice !== undefined) {
    const maxPrice = Number(req.query.maxPrice);
    if (isNaN(maxPrice)) {
      res.status(400).json({ error: "maxPrice must be a number" });
      return;
    }
    filter.maxPrice = maxPrice;
  }

  const venues = await service.listVenues(filter);
  res.json(venues);
});

// GET /venues/:id — get one venue
//
// NOTE: This handler has a deliberate bug used in the "bug fix" scenario
// (see .ai/tickets/SCRUM-6.md). A missing venue currently returns 200
// with a null body instead of a proper 404.
venueRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const venue = await service.getVenue(id);
  res.json(venue);
});
