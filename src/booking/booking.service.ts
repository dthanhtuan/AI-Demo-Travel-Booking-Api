import * as repo from "./booking.repository";
import * as venueRepo from "../venue/venue.repository";
import * as customerRepo from "../customer/customer.repository";
import { Booking, CreateBookingInput } from "../types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function listBookings(): Promise<Booking[]> {
  return repo.findAll();
}

export async function getBooking(id: number): Promise<Booking | null> {
  return repo.findById(id);
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // Validate dates.
  const checkIn = new Date(input.check_in);
  const checkOut = new Date(input.check_out);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new ValidationError("check_in and check_out must be valid dates");
  }
  if (checkOut <= checkIn) {
    throw new ValidationError("check_out must be after check_in");
  }

  // Validate referenced entities exist.
  const customer = await customerRepo.findById(input.customer_id);
  if (!customer) {
    throw new ValidationError(`Customer ${input.customer_id} does not exist`);
  }

  const venue = await venueRepo.findById(input.venue_id);
  if (!venue) {
    throw new ValidationError(`Venue ${input.venue_id} does not exist`);
  }

  // Capacity rule: confirmed overlapping bookings must not exceed venue capacity.
  const overlapping = await repo.countOverlapping(
    input.venue_id,
    input.check_in,
    input.check_out
  );
  if (overlapping >= venue.capacity) {
    throw new ValidationError("Venue is fully booked for the selected dates");
  }

  return repo.create(input);
}
