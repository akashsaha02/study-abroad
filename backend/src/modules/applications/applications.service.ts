import { z } from "zod";
import { APPLICATION_WITH_STUDENT_EMAIL } from "@abroadly/shared/embeds";
import { APPLICATION_STATUSES } from "@abroadly/shared/constants";
import { validateApplicationTargets } from "@/modules/applications/validate-targets";
import { createClient } from "@/infrastructure/supabase/client";
import { sendApplicationStatusEmail } from "@/modules/applications/applications.email";
import { AppError, NotFoundError, ValidationError } from "@/shared/http/errors";
import {
  applicationStepSchema,
  applicationStepUpdateSchema,
} from "@abroadly/shared/validations/admin";

const patchSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  country_id: z.string().uuid().nullable().optional(),
  university_id: z.string().uuid().nullable().optional(),
  course_id: z.string().uuid().nullable().optional(),
});

function pickTarget<T>(next: T | undefined, current: T): T {
  return next !== undefined ? next : current;
}

export async function updateApplication(id: string, body: unknown) {
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const supabase = createClient();
  const { data: app } = await supabase
    .from("applications")
    .select(APPLICATION_WITH_STUDENT_EMAIL)
    .eq("id", id)
    .single();

  if (!app) {
    throw new NotFoundError("Application not found");
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.status !== undefined) {
    updatePayload.status = parsed.data.status;
  }

  const hasTargetUpdate =
    parsed.data.country_id !== undefined ||
    parsed.data.university_id !== undefined ||
    parsed.data.course_id !== undefined;

  if (hasTargetUpdate) {
    const validation = await validateApplicationTargets(supabase, {
      country_id: pickTarget(parsed.data.country_id, app.country_id),
      university_id: pickTarget(parsed.data.university_id, app.university_id),
      course_id: pickTarget(parsed.data.course_id, app.course_id),
    });

    if (!validation.ok) {
      throw new ValidationError(validation.error);
    }

    Object.assign(updatePayload, validation.data);
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updatePayload)
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to update application", 500);
  if (!data) throw new NotFoundError("Application not found");

  if (parsed.data.status) {
    const email = (app.students as { profiles?: { email?: string } })?.profiles?.email;
    if (email) {
      await sendApplicationStatusEmail(email, parsed.data.status);
    }
  }
}

export async function createApplicationStep(body: unknown) {
  const parsed = applicationStepSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("application_steps")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to create application step", 500);
  return data;
}

export async function updateApplicationStep(id: string, body: unknown) {
  const parsed = applicationStepUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const updateData = { ...parsed.data };
  if (parsed.data.status === "completed" && !parsed.data.completed_at) {
    updateData.completed_at = new Date().toISOString();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("application_steps")
    .update(updateData)
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to update application step", 500);
  if (!data) throw new NotFoundError("Step not found");
  return data;
}
