import { Router, Request, Response } from "express";
import * as service from "./customer.service";

export const customerRouter = Router();

// GET /customers — list all customers
customerRouter.get("/", async (_req: Request, res: Response) => {
  const customers = await service.listCustomers();
  res.json(customers);
});

// GET /customers/:id — get one customer
customerRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const customer = await service.getCustomer(id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json(customer);
});
