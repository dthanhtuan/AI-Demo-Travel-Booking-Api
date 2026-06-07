import * as repo from "./venue.repository";
import { Venue } from "../types";

export async function listVenues(): Promise<Venue[]> {
  return repo.findAll();
}

export async function getVenue(id: number): Promise<Venue | null> {
  return repo.findById(id);
}
