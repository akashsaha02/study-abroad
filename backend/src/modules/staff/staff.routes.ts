import { Router } from "express";
import {
  counselorSchema,
  noteSchema,
  notificationSchema,
  userUpdateSchema,
} from "@abroadly/shared/validations/admin";
import { STAFF_ROLES, SUPER_ADMIN_ROLES } from "@/modules/identity/api-auth";
import { registerCrud } from "@/modules/cms/cms.crud";

export function createStaffRouter() {
  const router = Router();

  registerCrud(router, "counselors", {
    table: "counselors",
    schema: counselorSchema,
    notFoundMessage: "Counselor not found",
    timestamps: "both",
  });

  registerCrud(router, "notes", {
    table: "notes",
    schema: noteSchema,
    notFoundMessage: "Note not found",
    roles: STAFF_ROLES,
    update: false,
    remove: false,
    mapCreate: (data, ctx) => ({ ...data, author_id: ctx.user.id }),
  });

  registerCrud(router, "notifications", {
    table: "notifications",
    schema: notificationSchema,
    notFoundMessage: "Notification not found",
    update: false,
    remove: false,
    returning: false,
  });

  registerCrud(router, "users", {
    table: "profiles",
    schema: userUpdateSchema,
    notFoundMessage: "User not found",
    roles: SUPER_ADMIN_ROLES,
    create: false,
    remove: false,
    updateMode: "full",
    timestamps: "update",
  });

  return router;
}
