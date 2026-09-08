import type { UserRole } from "@/types";

export {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  LEAD_STATUSES,
  LEAD_SOURCES,
} from "@abroadly/shared/constants";

export const APP_NAME = "Abroadly";

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
  ieltsMockTests: "/ielts/mock-tests",
  ieltsPractice: "/ielts/practice",
  ieltsResources: "/ielts/resources",
  dashboardIelts: "/dashboard/ielts",
  scholarships: "/scholarships",
  blog: "/blog",
  services: "/services",
  studyIn: (country: string) => `/study-in/${country}`,
  dashboard: "/dashboard",
  accountProfile: "/account/profile",
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

export { SERVICES, STORAGE_BUCKETS } from "@abroadly/shared/constants";
