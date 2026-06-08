import { Router, Request, Response } from "express";
import * as service from "./venue.service";

export const venueRouter = Router();

// GET /venues  — list all venues
venueRouter.get("/", async (_req: Request, res: Response) => {
  const venues = await service.listVenues();
  res.json(venues);
});

// GET /venues/:id — get one venue
venueRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const venue = await service.getVenue(id);
  if (!venue) {
    return res.status(404).json({ error: "Venue not found" });
  }
  res.json(venue);
});
