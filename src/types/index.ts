export type UserRole = "student" | "counselor" | "admin" | "super_admin";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "not_qualified"
  | "converted_to_student"
  | "lost";

export type ApplicationStatus =
  | "profile_review"
  | "documents_pending"
  | "university_shortlisting"
  | "application_submitted"
  | "offer_received"
  | "tuition_payment"
  | "visa_documents"
  | "visa_submitted"
  | "visa_approved"
  | "pre_departure"
  | "completed"
  | "rejected";

export type DocumentStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_update";

export type ConsultationStatus =
  | "requested"
  | "scheduled"
  | "completed"
  | "cancelled";

export type LeadSource =
  | "website"
  | "contact_form"
  | "eligibility_checker"
  | "cost_calculator"
  | "whatsapp"
  | "manual_admin_entry";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  preferred_country: string | null;
  education_level: string | null;
  subject_interest: string | null;
  last_result: string | null;
  ielts_score: number | null;
  budget: number | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  assigned_counselor_id: string | null;
  converted_student_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  lead_id: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  current_address: string | null;
  highest_education: string | null;
  institution_name: string | null;
  graduation_year: number | null;
  cgpa: string | null;
  english_test_type: string | null;
  english_test_score: string | null;
  preferred_country: string | null;
  preferred_subject: string | null;
  budget: number | null;
  assigned_counselor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  tuition_min: number | null;
  tuition_max: number | null;
  living_cost_min: number | null;
  living_cost_max: number | null;
  visa_summary: string | null;
  admission_requirements: string | null;
  scholarship_summary: string | null;
  intakes: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  website_url: string | null;
  ranking: string | null;
  description: string | null;
  tuition_min: number | null;
  tuition_max: number | null;
  application_fee: number | null;
  requirements: string | null;
  intakes: string[] | null;
  scholarship_available: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  university_id: string;
  title: string;
  slug: string;
  degree_level: string | null;
  subject_area: string | null;
  duration: string | null;
  tuition_fee: number | null;
  application_fee: number | null;
  language_requirement: string | null;
  academic_requirement: string | null;
  intakes: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scholarship {
  id: string;
  university_id: string | null;
  country_id: string | null;
  title: string;
  slug: string;
  degree_level: string | null;
  amount: string | null;
  eligibility: string | null;
  deadline: string | null;
  description: string | null;
  application_link: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  counselor_id: string | null;
  country_id: string | null;
  university_id: string | null;
  course_id: string | null;
  intake: string | null;
  status: ApplicationStatus;
  priority: string;
  admin_note: string | null;
  student_note: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStep {
  id: string;
  application_id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  student_id: string;
  application_id: string | null;
  document_type: string;
  file_path: string;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: DocumentStatus;
  review_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  uploaded_at: string;
}

export interface Consultation {
  id: string;
  lead_id: string | null;
  student_id: string | null;
  counselor_id: string | null;
  requested_date: string | null;
  scheduled_at: string | null;
  meeting_link: string | null;
  status: ConsultationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  author_id: string;
  lead_id: string | null;
  student_id: string | null;
  application_id: string | null;
  content: string;
  visibility: "internal" | "student_visible" | "admin_only";
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  country_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  destination_country: string | null;
  university_name: string | null;
  quote: string;
  image_url: string | null;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export interface CostSetting {
  id: string;
  country: string;
  degree_level: string;
  tuition_min: number | null;
  tuition_max: number | null;
  living_cost_min: number | null;
  living_cost_max: number | null;
  visa_fee: number | null;
  insurance_fee: number | null;
  application_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  profile: Profile | null;
}
