import { z } from "zod";

export const consultationRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone required"),
  preferred_country_id: z.string().uuid().optional(),
  preferred_country: z.string().optional(),
  requested_date: z.string().optional(),
  notes: z.string().optional(),
  university_id: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
  service_slug: z.string().optional(),
});

export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;
