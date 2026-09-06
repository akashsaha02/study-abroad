import type { Request, Response } from "express";
import { assertApiRole, ADMIN_ROLES } from "@/modules/identity";
import { AppError, ValidationError } from "@/shared/http/errors";
import { queryString, routeParam } from "@/shared/http/request";
import { contactSchema } from "@abroadly/shared/validations/leads";
import {
  leadAssignSchema,
  leadConvertSchema,
} from "@abroadly/shared/validations/admin";
import { LEAD_SOURCES } from "@abroadly/shared/constants";
import * as leadsService from "@/modules/leads/leads.service";
import type { LeadSource } from "@abroadly/shared/types";

const LEAD_SOURCE_SET = new Set<string>(LEAD_SOURCES);

export async function createLead(req: Request, res: Response) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const rawSource = typeof body.source === "string" ? body.source : "contact_form";
  if (!LEAD_SOURCE_SET.has(rawSource)) {
    throw new ValidationError("Invalid lead source");
  }

  const lead = await leadsService.createLeadAndNotify({
    ...parsed.data,
    email: parsed.data.email || undefined,
    source: rawSource as LeadSource,
  });

  if (!lead) {
    throw new AppError("Failed to save lead", 500);
  }

  res.status(200).json({ success: true, id: lead.id });
}

export async function getLeadContext(req: Request, res: Response) {
  const context = await leadsService.resolveLeadContextFromSlugs({
    university: queryString(req.query.university),
    course: queryString(req.query.course),
    service: queryString(req.query.service),
    country: queryString(req.query.country),
    message: queryString(req.query.message),
  });
  res.status(200).json(context);
}

export async function updateLead(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  await leadsService.updateLeadStatus(routeParam(req.params.id), req.body?.status);
  res.status(200).json({ success: true });
}

export async function assignLead(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  const parsed = leadAssignSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const data = await leadsService.assignLead(
    routeParam(req.params.id),
    parsed.data.assigned_counselor_id
  );
  res.status(200).json({ data });
}

export async function convertLead(req: Request, res: Response) {
  const user = await assertApiRole([...ADMIN_ROLES]);
  const parsed = leadConvertSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const data = await leadsService.convertLead({
    leadId: routeParam(req.params.id),
    profileId: parsed.data.profile_id,
    convertedBy: user.id,
  });
  res.status(200).json({ data });
}
