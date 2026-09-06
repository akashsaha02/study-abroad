import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as leadsController from "@/modules/leads/leads.controller";

export function createLeadsRouter() {
  const router = Router();

  router.post("/api/leads", asyncHandler(leadsController.createLead));
  router.get("/api/leads/context", asyncHandler(leadsController.getLeadContext));
  router.patch(
    "/api/admin/leads/:id/assign",
    asyncHandler(leadsController.assignLead)
  );
  router.post(
    "/api/admin/leads/:id/convert",
    asyncHandler(leadsController.convertLead)
  );
  router.patch("/api/admin/leads/:id", asyncHandler(leadsController.updateLead));

  return router;
}
