import { z } from "zod";

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

const optionalUrl = z.string().url().optional().nullable().or(z.literal(""));

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug,
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  cover_image_url: optionalUrl,
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional().nullable(),
  country_id: z.string().uuid().optional().nullable(),
  sort_order: z.coerce.number().optional(),
  is_published: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  student_name: z.string().min(1),
  destination_country: z.string().optional().nullable(),
  university_name: z.string().optional().nullable(),
  quote: z.string().min(1),
  image_url: optionalUrl,
  rating: z.coerce.number().min(1).max(5).optional(),
  is_published: z.boolean().optional(),
});

export const countrySchema = z.object({
  name: z.string().min(1),
  slug,
  description: z.string().optional().nullable(),
  hero_title: z.string().optional().nullable(),
  hero_subtitle: z.string().optional().nullable(),
  tuition_min: z.coerce.number().optional().nullable(),
  tuition_max: z.coerce.number().optional().nullable(),
  living_cost_min: z.coerce.number().optional().nullable(),
  living_cost_max: z.coerce.number().optional().nullable(),
  visa_summary: z.string().optional().nullable(),
  admission_requirements: z.string().optional().nullable(),
  scholarship_summary: z.string().optional().nullable(),
  intakes: z.array(z.string()).optional().nullable(),
  is_published: z.boolean().optional(),
});

export const universitySchema = z.object({
  country_id: z.string().uuid(),
  name: z.string().min(1),
  slug,
  city: z.string().optional().nullable(),
  logo_url: optionalUrl,
  website_url: optionalUrl,
  ranking: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tuition_min: z.coerce.number().optional().nullable(),
  tuition_max: z.coerce.number().optional().nullable(),
  application_fee: z.coerce.number().optional().nullable(),
  requirements: z.string().optional().nullable(),
  intakes: z.array(z.string()).optional().nullable(),
  scholarship_available: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

export const courseSchema = z.object({
  university_id: z.string().uuid(),
  title: z.string().min(1),
  slug,
  degree_level: z.string().optional().nullable(),
  subject_area: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  tuition_fee: z.coerce.number().optional().nullable(),
  application_fee: z.coerce.number().optional().nullable(),
  language_requirement: z.string().optional().nullable(),
  academic_requirement: z.string().optional().nullable(),
  intakes: z.array(z.string()).optional().nullable(),
  is_published: z.boolean().optional(),
});

export const scholarshipSchema = z.object({
  university_id: z.string().uuid().optional().nullable(),
  country_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1),
  slug,
  degree_level: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  eligibility: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  application_link: optionalUrl,
  is_published: z.boolean().optional(),
});

export const counselorSchema = z.object({
  profile_id: z.string().uuid(),
  specialization: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const costSettingSchema = z.object({
  country: z.string().min(1),
  degree_level: z.string().min(1),
  tuition_min: z.coerce.number().optional().nullable(),
  tuition_max: z.coerce.number().optional().nullable(),
  living_cost_min: z.coerce.number().optional().nullable(),
  living_cost_max: z.coerce.number().optional().nullable(),
  visa_fee: z.coerce.number().optional().nullable(),
  insurance_fee: z.coerce.number().optional().nullable(),
  application_fee: z.coerce.number().optional().nullable(),
});

export const eligibilityRuleSchema = z.object({
  country: z.string().min(1),
  education_level: z.string().min(1),
  min_cgpa: z.coerce.number().optional().nullable(),
  min_ielts: z.coerce.number().optional().nullable(),
  min_budget: z.coerce.number().optional().nullable(),
  recommendation: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const consultationSchema = z.object({
  lead_id: z.string().uuid().optional().nullable(),
  student_id: z.string().uuid().optional().nullable(),
  counselor_id: z.string().uuid().optional().nullable(),
  requested_date: z.string().optional().nullable(),
  scheduled_at: z.string().optional().nullable(),
  meeting_link: optionalUrl,
  status: z
    .enum(["requested", "scheduled", "completed", "cancelled"])
    .optional(),
  notes: z.string().optional().nullable(),
});

export const noteSchema = z.object({
  lead_id: z.string().uuid().optional().nullable(),
  student_id: z.string().uuid().optional().nullable(),
  application_id: z.string().uuid().optional().nullable(),
  content: z.string().min(1),
  visibility: z
    .enum(["internal", "student_visible", "admin_only"])
    .optional(),
});

export const notificationSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.string().optional().nullable(),
});

export const userUpdateSchema = z.object({
  full_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum(["student", "counselor", "admin", "super_admin"]).optional(),
  is_active: z.boolean().optional(),
  avatar_url: optionalUrl,
});

export const leadAssignSchema = z.object({
  assigned_counselor_id: z.string().uuid(),
});

export const leadConvertSchema = z.object({
  profile_id: z.string().uuid(),
});

export const applicationStepSchema = z.object({
  application_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  sort_order: z.coerce.number().optional(),
});

export const applicationStepUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  sort_order: z.coerce.number().optional(),
  completed_at: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type CountryInput = z.infer<typeof countrySchema>;
export type UniversityInput = z.infer<typeof universitySchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ScholarshipInput = z.infer<typeof scholarshipSchema>;
export type CounselorInput = z.infer<typeof counselorSchema>;
export type CostSettingInput = z.infer<typeof costSettingSchema>;
export type EligibilityRuleInput = z.infer<typeof eligibilityRuleSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ApplicationStepInput = z.infer<typeof applicationStepSchema>;
export type ApplicationStepUpdateInput = z.infer<typeof applicationStepUpdateSchema>;
