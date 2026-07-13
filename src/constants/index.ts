import type {
  ApplicationStatus,
  LeadSource,
  LeadStatus,
  UserRole,
} from "@/types";

export const APP_NAME = "Abroadly";
export const APP_DESCRIPTION =
  "Find the right country, university, scholarship, and application path with expert guidance from start to visa.";

export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  bookConsultation: "/book-consultation",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  eligibilityChecker: "/eligibility-checker",
  costCalculator: "/cost-calculator",
  universities: "/universities",
  courses: "/courses",
  compare: "/compare",
  studyAbroad: "/study-abroad",
  ielts: "/ielts",
  ieltsMockTest: "/ielts/mock-test",
  scholarships: "/scholarships",
  blog: "/blog",
  services: "/services",
  studyIn: (country: string) => `/study-in/${country}`,
  dashboard: "/dashboard",
  accountProfile: "/account/profile",
  /** @deprecated Use accountProfile */
  dashboardProfile: "/account/profile",
  dashboardApplications: "/dashboard/applications",
  dashboardDocuments: "/dashboard/documents",
  dashboardConsultations: "/dashboard/consultations",
  dashboardNotifications: "/dashboard/notifications",
  counselor: "/counselor",
  admin: "/admin",
} as const;

export const USER_ROLES: UserRole[] = [
  "student",
  "counselor",
  "admin",
  "super_admin",
];

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "not_qualified",
  "converted_to_student",
  "lost",
];

export const LEAD_SOURCES: LeadSource[] = [
  "website",
  "contact_form",
  "eligibility_checker",
  "cost_calculator",
  "whatsapp",
  "manual_admin_entry",
  "service_order",
  "consultation_request",
];

export const ENGLISH_TEST_TYPES = [
  "IELTS",
  "PTE",
  "TOEFL",
  "Duolingo",
  "None",
] as const;

export const CONSULTATION_STATUSES = [
  "requested",
  "scheduled",
  "completed",
  "cancelled",
] as const;

export const APPLICATION_STATUSES: ApplicationStatus[] = [
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
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
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

export const DOCUMENT_TYPES = [
  "Passport",
  "Photo",
  "SSC certificate",
  "HSC certificate",
  "Bachelor transcript",
  "IELTS/PTE certificate",
  "SOP",
  "LOR",
  "Bank statement",
  "CV",
  "Visa form",
  "Other",
] as const;

export const POPULAR_COUNTRIES = [
  { name: "United Kingdom", slug: "uk", flag: "🇬🇧" },
  { name: "Canada", slug: "canada", flag: "🇨🇦" },
  { name: "Australia", slug: "australia", flag: "🇦🇺" },
  { name: "United States", slug: "usa", flag: "🇺🇸" },
  { name: "Malaysia", slug: "malaysia", flag: "🇲🇾" },
  { name: "Germany", slug: "germany", flag: "🇩🇪" },
] as const;

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
} as const;
