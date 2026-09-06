import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as studentsController from "@/modules/students/students.controller";

export function createStudentsRouter() {
  const router = Router();

  router.patch("/api/student/profile", asyncHandler(studentsController.updateProfile));
  router.patch(
    "/api/student/profile/avatar",
    asyncHandler(studentsController.updateProfileAvatar)
  );

  return router;
}
