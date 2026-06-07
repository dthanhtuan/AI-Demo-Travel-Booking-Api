import * as repo from "./venue.repository";
import { Venue, VenueFilter } from "../types";

export async function listVenues(filter: VenueFilter = {}): Promise<Venue[]> {
  return repo.findAll(filter);
}

export async function getVenue(id: number): Promise<Venue | null> {
  return repo.findById(id);
}
