import { POPULAR_COUNTRIES, SERVICES } from "@/constants";
import type { Country, Faq, Testimonial, University } from "@/types";

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    student_name: "Rahim Ahmed",
    destination_country: "Canada",
    university_name: "University of Toronto",
    country_id: null,
    university_id: null,
    quote:
      "Abroadly guided me from university shortlisting to visa approval. I couldn't have done it without them.",
    image_url: null,
    rating: 5,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_name: "Fatima Khan",
    destination_country: "UK",
    university_name: "University of Manchester",
    country_id: null,
    university_id: null,
    quote:
      "The counselors were incredibly supportive throughout my application process. Highly recommended!",
    image_url: null,
    rating: 5,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    student_name: "Karim Hassan",
    destination_country: "Australia",
    university_name: "Monash University",
    country_id: null,
    university_id: null,
    quote:
      "Got my scholarship with their help. The eligibility checker was spot on with recommendations.",
    image_url: null,
    rating: 5,
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_FAQS: Faq[] = [
  {
    id: "1",
    question: "How long does the application process take?",
    answer:
      "Typically 3-6 months depending on the country and intake. We recommend starting at least 6 months before your desired intake.",
    category: "general",
    country_id: null,
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Do I need IELTS for all countries?",
    answer:
      "Most English-speaking countries require IELTS, PTE, or TOEFL. Some universities accept MOI letters. Requirements vary by country and program.",
    category: "general",
    country_id: null,
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    question: "Is the consultation really free?",
    answer:
      "Yes! Your first consultation with our counselors is completely free with no obligation.",
    category: "general",
    country_id: null,
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    question: "Can you help with visa applications?",
    answer:
      "Absolutely. We provide end-to-end visa support including document preparation, application submission, and interview preparation.",
    category: "general",
    country_id: null,
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_COUNTRIES: Partial<Country>[] = POPULAR_COUNTRIES.map(
  (c, i) => ({
    id: String(i + 1),
    name: c.name,
    slug: c.slug,
    description: `Study in ${c.name} with world-class universities and excellent career prospects.`,
    hero_title: `Study in ${c.name}`,
    hero_subtitle: "Quality education, global opportunities",
    tuition_min: 8000,
    tuition_max: 25000,
    living_cost_min: 600,
    living_cost_max: 1500,
    is_published: true,
  })
);

export const FALLBACK_UNIVERSITIES: Partial<University>[] = [
  {
    id: "1",
    name: "University of Toronto",
    slug: "university-of-toronto",
    city: "Toronto",
    country_id: "2",
    ranking: "#21 Global",
    tuition_min: 35000,
    tuition_max: 55000,
    scholarship_available: true,
    is_featured: true,
    is_published: true,
  },
  {
    id: "2",
    name: "University of Manchester",
    slug: "university-of-manchester",
    city: "Manchester",
    country_id: "1",
    ranking: "#32 Global",
    tuition_min: 22000,
    tuition_max: 28000,
    scholarship_available: true,
    is_featured: true,
    is_published: true,
  },
  {
    id: "3",
    name: "Monash University",
    slug: "monash-university",
    city: "Melbourne",
    country_id: "3",
    ranking: "#42 Global",
    tuition_min: 28000,
    tuition_max: 40000,
    scholarship_available: true,
    is_featured: true,
    is_published: true,
  },
];

export { SERVICES };
