import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as applicationsController from "@/modules/applications/applications.controller";

export function createApplicationsRouter() {
  const router = Router();

  router.patch(
    "/api/admin/applications/:id",
    asyncHandler(applicationsController.updateApplication)
  );
  router.post(
    "/api/admin/application-steps",
    asyncHandler(applicationsController.createApplicationStep)
  );
  router.patch(
    "/api/admin/application-steps/:id",
    asyncHandler(applicationsController.updateApplicationStep)
  );

  return router;
}
