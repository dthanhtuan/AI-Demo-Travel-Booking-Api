import express from "express";
import { apiRouter } from "./routes";

export const app = express();
app.use(express.json());
app.use("/", apiRouter);

const PORT = Number(process.env.PORT) || 3000;

// Only start listening when run directly (not when imported by tests).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Travel Booking API listening on port ${PORT}`);
  });
}
