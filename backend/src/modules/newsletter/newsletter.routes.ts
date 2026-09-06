import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as newsletterController from "@/modules/newsletter/newsletter.controller";

export function createNewsletterRouter() {
  const router = Router();
  router.post("/api/newsletter", asyncHandler(newsletterController.subscribeNewsletter));
  return router;
}
