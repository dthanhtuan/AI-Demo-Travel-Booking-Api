import { Router } from "express";
import { venueRouter } from "./venue/venue.controller";
import { customerRouter } from "./customer/customer.controller";
import { bookingRouter } from "./booking/booking.controller";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRouter.use("/venues", venueRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/bookings", bookingRouter);
