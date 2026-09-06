import type { Request, Response } from "express";
import { consultationRequestSchema } from "@abroadly/shared/validations/consultation-request";
import { ValidationError } from "@/shared/http/errors";
import { createConsultationRequest } from "@/modules/consultations/consultations.service";

export async function requestConsultation(req: Request, res: Response) {
  const parsed = consultationRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const lead = await createConsultationRequest(parsed.data);
  res.status(200).json({ success: true, id: lead.id });
}
