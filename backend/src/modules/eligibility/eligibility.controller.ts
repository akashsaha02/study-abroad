import type { Request, Response } from "express";
import { eligibilitySchema } from "@abroadly/shared/validations/leads";
import { ValidationError } from "@/shared/http/errors";
import { checkEligibility } from "@/modules/eligibility/eligibility.service";

export async function check(req: Request, res: Response) {
  const parsed = eligibilitySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message);
  }

  const result = await checkEligibility(parsed.data);
  res.status(200).json(result);
}
