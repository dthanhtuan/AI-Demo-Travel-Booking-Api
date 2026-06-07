// Shared domain types — the integration point between layers and developers.
//
// IMPORTANT (team rule): changes to this file are a shared contract.
// Lock any new interface in .ai/DECISIONS.md BEFORE editing here, so that
// two developers (or two AI models) working in parallel never collide.

export interface Venue {
  id: number;
  name: string;
  city: string;
  capacity: number;
  price_per_night: number;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: number;
  customer_id: number;
  venue_id: number;
  check_in: string; // ISO date (YYYY-MM-DD)
  check_out: string; // ISO date (YYYY-MM-DD)
  status: BookingStatus;
  created_at: string;
}

export interface VenueFilter {
  city?: string;
  maxPrice?: number;
}

export interface CreateBookingInput {
  customer_id: number;
  venue_id: number;
  check_in: string;
  check_out: string;
}
