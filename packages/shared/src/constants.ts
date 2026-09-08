export const SERVICES = [
  {
    slug: "admission-processing",
    title: "Admission Processing",
    description: "End-to-end university application support from shortlisting to offer letter.",
  },
  {
    slug: "student-visa-support",
    title: "Student Visa Support",
    description: "Expert visa documentation and submission guidance for your destination country.",
  },
  {
    slug: "sop-lor-guidance",
    title: "SOP & LOR Guidance",
    description: "Professional help crafting compelling statements and recommendation letters.",
  },
  {
    slug: "scholarship-guidance",
    title: "Scholarship Guidance",
    description: "Identify and apply for scholarships that match your profile and goals.",
  },
  {
    slug: "pre-departure-support",
    title: "Pre-departure Support",
    description: "Accommodation, travel, and orientation support before you fly.",
  },
] as const;

export const STORAGE_BUCKETS = {
  studentDocuments: "student-documents",
  profileAvatars: "profile-avatars",
  universityLogos: "university-logos",
  blogImages: "blog-images",
  testimonialImages: "testimonial-images",
  ieltsMedia: "ielts-media",
  ieltsSpeaking: "ielts-speaking",
} as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "not_qualified",
  "converted_to_student",
  "lost",
] as const;

export const LEAD_SOURCES = [
  "website",
  "contact_form",
  "eligibility_checker",
  "cost_calculator",
  "whatsapp",
  "manual_admin_entry",
  "service_order",
  "consultation_request",
] as const;

export const DOCUMENT_STATUSES = [
  "pending_review",
  "approved",
  "rejected",
  "needs_update",
] as const;

export const APPLICATION_STATUSES = [
  "profile_review",
  "documents_pending",
  "university_shortlisting",
  "application_submitted",
  "offer_received",
  "tuition_payment",
  "visa_documents",
  "visa_submitted",
  "visa_approved",
  "pre_departure",
  "completed",
  "rejected",
] as const;

export const APPLICATION_STATUS_LABELS: Record<
  (typeof APPLICATION_STATUSES)[number],
  string
> = {
  profile_review: "Profile Review",
  documents_pending: "Documents Pending",
  university_shortlisting: "University Shortlisting",
  application_submitted: "Application Submitted",
  offer_received: "Offer Received",
  tuition_payment: "Tuition Payment",
  visa_documents: "Visa Documents",
  visa_submitted: "Visa Submitted",
  visa_approved: "Visa Approved",
  pre_departure: "Pre-departure",
  completed: "Completed",
  rejected: "Rejected",
};
