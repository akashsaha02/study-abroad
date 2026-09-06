import { z } from "zod";

export const studentProfileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  date_of_birth: z.string().optional(),
  highest_education: z.string().optional(),
  institution_name: z.string().optional(),
  cgpa: z.string().optional(),
  english_test_type: z.string().optional(),
  english_test_score: z.string().optional(),
  preferred_country: z.string().optional(),
  preferred_country_id: z.string().uuid().optional(),
  preferred_country_ids: z.array(z.string().uuid()).optional(),
  preferred_subject: z.string().optional(),
  current_address: z.string().optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
