import * as repo from "./customer.repository";
import { Customer } from "../types";

export async function listCustomers(): Promise<Customer[]> {
  return repo.findAll();
}

export async function getCustomer(id: number): Promise<Customer | null> {
  return repo.findById(id);
}
