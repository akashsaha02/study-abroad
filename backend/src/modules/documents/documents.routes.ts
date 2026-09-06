import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as documentsController from "@/modules/documents/documents.controller";

export function createDocumentsRouter() {
  const router = Router();

  router.post(
    "/api/student/documents",
    asyncHandler(documentsController.createStudentDocument)
  );
  router.patch(
    "/api/admin/documents/:id",
    asyncHandler(documentsController.reviewDocument)
  );
  router.get(
    "/api/admin/documents/:id/preview",
    asyncHandler(documentsController.previewDocument)
  );

  return router;
}
