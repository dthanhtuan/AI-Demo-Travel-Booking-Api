import { Router, Request, Response } from "express";
import * as service from "./booking.service";
import { ValidationError } from "./booking.service";

export const bookingRouter = Router();

// GET /bookings — list all bookings
bookingRouter.get("/", async (_req: Request, res: Response) => {
  const bookings = await service.listBookings();
  res.json(bookings);
});

// GET /bookings/:id — get one booking
bookingRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const booking = await service.getBooking(id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
});

// POST /bookings — create a booking
bookingRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { customer_id, venue_id, check_in, check_out } = req.body ?? {};
    if (
      customer_id == null ||
      venue_id == null ||
      check_in == null ||
      check_out == null
    ) {
      return res.status(400).json({
        error: "customer_id, venue_id, check_in and check_out are required",
      });
    }
    const booking = await service.createBooking({
      customer_id,
      venue_id,
      check_in,
      check_out,
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
});
