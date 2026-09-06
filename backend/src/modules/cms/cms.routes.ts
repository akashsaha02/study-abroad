import { Router } from "express";
import {
  blogPostSchema,
  costSettingSchema,
  countrySchema,
  courseSchema,
  eligibilityRuleSchema,
  faqSchema,
  scholarshipSchema,
  serviceSchema,
  testimonialSchema,
  universitySchema,
} from "@abroadly/shared/validations/admin";
import { ADMIN_ROLES, SUPER_ADMIN_ROLES } from "@/modules/identity/api-auth";
import { registerCrud } from "@/modules/cms/cms.crud";
import * as cmsService from "@/modules/cms/cms.service";

export function createCmsRouter() {
  const router = Router();

  registerCrud(router, "faqs", {
    table: "faqs",
    schema: faqSchema,
    notFoundMessage: "FAQ not found",
  });

  registerCrud(router, "countries", {
    table: "countries",
    schema: countrySchema,
    notFoundMessage: "Country not found",
    timestamps: "both",
  });

  registerCrud(router, "universities", {
    table: "universities",
    schema: universitySchema,
    notFoundMessage: "University not found",
    timestamps: "both",
  });

  registerCrud(router, "courses", {
    table: "courses",
    schema: courseSchema,
    notFoundMessage: "Course not found",
    timestamps: "both",
  });

  registerCrud(router, "scholarships", {
    table: "scholarships",
    schema: scholarshipSchema,
    notFoundMessage: "Scholarship not found",
    timestamps: "both",
  });

  registerCrud(router, "services", {
    table: "services",
    schema: serviceSchema,
    notFoundMessage: "Service not found",
    timestamps: "update",
  });

  registerCrud(router, "blog", {
    table: "blog_posts",
    schema: blogPostSchema,
    notFoundMessage: "Blog post not found",
    mapCreate: cmsService.mapBlogCreate,
    mapUpdate: cmsService.mapBlogUpdate,
  });

  registerCrud(router, "testimonials", {
    table: "testimonials",
    schema: testimonialSchema,
    notFoundMessage: "Testimonial not found",
    mapCreate: cmsService.mapTestimonialPayload,
    mapUpdate: cmsService.mapTestimonialPayload,
  });

  registerCrud(router, "cost-settings", {
    table: "cost_settings",
    schema: costSettingSchema,
    notFoundMessage: "Cost setting not found",
    roles: ADMIN_ROLES,
    createRoles: SUPER_ADMIN_ROLES,
    timestamps: "both",
    mapCreate: cmsService.mapCountryNamedCreate,
    mapUpdate: cmsService.mapCountryNamedUpdate,
  });

  registerCrud(router, "eligibility-rules", {
    table: "eligibility_rules",
    schema: eligibilityRuleSchema,
    notFoundMessage: "Eligibility rule not found",
    timestamps: "both",
    mapCreate: cmsService.mapCountryNamedCreate,
    mapUpdate: cmsService.mapCountryNamedUpdate,
  });

  return router;
}
