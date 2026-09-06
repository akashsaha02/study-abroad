import { Router } from "express";
import { consultationSchema } from "@abroadly/shared/validations/admin";
import { asyncHandler } from "@/shared/http/async-handler";
import { registerCrud } from "@/modules/cms/cms.crud";
import * as consultationsController from "@/modules/consultations/consultations.controller";

export function createConsultationsRouter() {
  const router = Router();

  router.post(
    "/api/consultations/request",
    asyncHandler(consultationsController.requestConsultation)
  );

  registerCrud(router, "consultations", {
    table: "consultations",
    schema: consultationSchema,
    notFoundMessage: "Consultation not found",
    timestamps: "both",
    remove: false,
  });

  return router;
}
