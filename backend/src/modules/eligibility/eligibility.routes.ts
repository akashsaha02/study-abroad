import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as eligibilityController from "@/modules/eligibility/eligibility.controller";

export function createEligibilityRouter() {
  const router = Router();
  router.post("/api/eligibility", asyncHandler(eligibilityController.check));
  return router;
}
