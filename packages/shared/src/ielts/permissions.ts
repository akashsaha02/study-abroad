import type { UserRole } from "../types";
import type { IeltsStaffRole } from "./types";
import { IELTS_PERMISSIONS } from "./constants";

export type IeltsPermission = (typeof IELTS_PERMISSIONS)[number];

const EDITOR: IeltsPermission[] = [
  "ielts.view",
  "ielts.questions.create",
  "ielts.questions.edit",
  "ielts.tests.create",
  "ielts.tests.edit",
];

const REVIEWER: IeltsPermission[] = [
  "ielts.view",
  "ielts.questions.review",
  "ielts.evaluate",
];

const MANAGER: IeltsPermission[] = [
  ...EDITOR,
  "ielts.questions.review",
  "ielts.questions.publish",
  "ielts.questions.delete",
  "ielts.tests.publish",
  "ielts.analytics.view",
  "ielts.evaluate",
];

const ADMIN: IeltsPermission[] = [...MANAGER, "ielts.staff.manage"];

const BY_STAFF: Record<IeltsStaffRole, IeltsPermission[]> = {
  editor: EDITOR,
  reviewer: REVIEWER,
  manager: MANAGER,
};

export function isPlatformAdmin(role?: UserRole | null) {
  return role === "admin" || role === "super_admin";
}

export function isIeltsStaffRole(
  role?: UserRole | null,
  staffRole?: IeltsStaffRole | null
) {
  return isPlatformAdmin(role) || Boolean(staffRole);
}

export function ieltsPermissionsFor(
  role?: UserRole | null,
  staffRole?: IeltsStaffRole | null
): IeltsPermission[] {
  if (isPlatformAdmin(role)) return [...ADMIN];
  if (staffRole && staffRole in BY_STAFF) return [...BY_STAFF[staffRole]];
  return [];
}

export function hasIeltsPermission(
  permission: IeltsPermission,
  role?: UserRole | null,
  staffRole?: IeltsStaffRole | null
) {
  return ieltsPermissionsFor(role, staffRole).includes(permission);
}

export function canEditQuestion(
  role: UserRole | null | undefined,
  staffRole: IeltsStaffRole | null | undefined,
  createdBy: string | null,
  userId: string,
  status: string
) {
  if (hasIeltsPermission("ielts.questions.publish", role, staffRole)) {
    return true;
  }
  if (!hasIeltsPermission("ielts.questions.edit", role, staffRole)) {
    return false;
  }
  return createdBy === userId && (status === "draft" || status === "review");
}
