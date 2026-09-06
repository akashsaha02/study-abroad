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
