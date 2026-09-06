import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as ordersController from "@/modules/orders/orders.controller";

export function createOrdersRouter() {
  const router = Router();
  router.post("/api/service-orders", asyncHandler(ordersController.createOrder));
  return router;
}
