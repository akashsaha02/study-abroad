import type { LeadSource } from "@abroadly/shared/types";

export interface CreateLeadInput {
  name: string;
  email?: string;
  phone: string;
  preferred_country?: string;
  preferred_country_id?: string;
  education_level?: string;
  subject_interest?: string;
  last_result?: string;
  ielts_score?: number;
  budget?: number;
  message?: string;
  source?: LeadSource;
  university_id?: string;
  course_id?: string;
  service_slug?: string;
}

export interface ConvertLeadInput {
  leadId: string;
  profileId: string;
  convertedBy?: string;
}

export interface LeadContextDefaults {
  name?: string;
  email?: string;
  phone?: string;
  countryId?: string;
  countrySlug?: string;
  message?: string;
  universityId?: string;
  universitySlug?: string;
  universityName?: string;
  courseId?: string;
  courseSlug?: string;
  courseTitle?: string;
  serviceSlug?: string;
  serviceTitle?: string;
}
