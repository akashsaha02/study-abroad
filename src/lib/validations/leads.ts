import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone required"),
  preferred_country: z.string().optional(),
  message: z.string().optional(),
});

export const eligibilitySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  education_level: z.string().min(1),
  last_result: z.string().optional(),
  english_test_type: z.string().optional(),
  english_test_score: z.string().optional(),
  preferred_country: z.string().optional(),
  preferred_subject: z.string().optional(),
  budget: z.coerce.number().optional(),
  study_level: z.string().optional(),
  gap_years: z.coerce.number().optional(),
});

export const leadSchema = contactSchema;

export type ContactInput = z.infer<typeof contactSchema>;
export type EligibilityInput = z.infer<typeof eligibilitySchema>;
