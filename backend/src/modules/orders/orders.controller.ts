import type { Request, Response } from "express";
import { createServiceOrder } from "@/modules/orders/orders.service";

export async function createOrder(req: Request, res: Response) {
  const result = await createServiceOrder(req.body);
  res.status(200).json(result);
}
