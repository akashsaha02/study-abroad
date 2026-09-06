import { Router } from "express";
import { createApplicationsRouter } from "@/modules/applications";
import { createCmsRouter } from "@/modules/cms";
import { createConsultationsRouter } from "@/modules/consultations";
import { createDocumentsRouter } from "@/modules/documents";
import { createEligibilityRouter } from "@/modules/eligibility";
import { createIdentityRouter } from "@/modules/identity";
import { createLeadsRouter } from "@/modules/leads";
import { createNewsletterRouter } from "@/modules/newsletter";
import { createOrdersRouter } from "@/modules/orders";
import { createStaffRouter } from "@/modules/staff";
import { createStudentsRouter } from "@/modules/students";

export function registerModuleRoutes() {
  const router = Router();

  router.use(createIdentityRouter());
  router.use(createLeadsRouter());
  router.use(createStudentsRouter());
  router.use(createDocumentsRouter());
  router.use(createApplicationsRouter());
  router.use(createEligibilityRouter());
  router.use(createConsultationsRouter());
  router.use(createNewsletterRouter());
  router.use(createOrdersRouter());
  router.use(createCmsRouter());
  router.use(createStaffRouter());

  return router;
}
