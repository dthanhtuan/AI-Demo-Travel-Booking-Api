import { Router, Request, Response } from "express";
import * as service from "./venue.service";

export const venueRouter = Router();

// GET /venues  — list all venues
venueRouter.get("/", async (_req: Request, res: Response) => {
  const venues = await service.listVenues();
  res.json(venues);
});

// GET /venues/:id — get one venue
//
// NOTE: This handler has a deliberate bug used in the "bug fix" scenario
// (see .ai/tickets/SCRUM-102.md). A missing venue currently returns 200
// with a null body instead of a proper 404.
venueRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const venue = await service.getVenue(id);
  res.json(venue);
});
