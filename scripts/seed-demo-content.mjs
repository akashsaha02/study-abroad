/**
 * Seeds published CMS content for public pages and admin CMS demos.
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 *
 * Insert order (respects FK hierarchy):
 *   countries → universities → courses → scholarships → blog → faqs → testimonials → cost_settings → eligibility_rules
 *
 * Usage: npm run seed:content
 */

import { createClient } from "@supabase/supabase-js";
import { applyFkPayload, detectFkColumns, warnIfMigrationMissing } from "./seed-fk-support.mjs";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.local`);
    process.exit(1);
  }
  return value;
}

async function upsertBySlug(admin, table, slug, payload) {
  const { data: existing } = await admin.from(table).select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    const { error } = await admin.from(table).update(payload).eq("id", existing.id);
    if (error) throw new Error(`${table} update ${slug}: ${error.message}`);
    return existing.id;
  }
  const { data, error } = await admin.from(table).insert({ slug, ...payload }).select("id").single();
  if (error) throw new Error(`${table} insert ${slug}: ${error.message}`);
  return data.id;
}

async function upsertCourse(admin, universityId, slug, payload) {
  const { data: existing } = await admin
    .from("courses")
    .select("id")
    .eq("university_id", universityId)
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    const { error } = await admin.from("courses").update(payload).eq("id", existing.id);
    if (error) throw new Error(`courses update ${slug}: ${error.message}`);
    return existing.id;
  }

  const { data, error } = await admin
    .from("courses")
    .insert({ university_id: universityId, slug, ...payload })
    .select("id")
    .single();
  if (error) throw new Error(`courses insert ${slug}: ${error.message}`);
  return data.id;
}

async function upsertCostSetting(admin, fks, countryId, countryName, degreeLevel, payload) {
  const { data: existing } = await admin
    .from("cost_settings")
    .select("id")
    .eq("country", countryName)
    .eq("degree_level", degreeLevel)
    .maybeSingle();

  const row = applyFkPayload(
    fks,
    {
      country: countryName,
      country_id: countryId,
      degree_level: degreeLevel,
      ...payload,
    },
    [["cost_settings", "country_id"]]
  );

  if (existing) {
    const { error } = await admin.from("cost_settings").update(row).eq("id", existing.id);
    if (error) throw new Error(`cost_settings update: ${error.message}`);
    return;
  }

  const { error } = await admin.from("cost_settings").insert(row);
  if (error) throw new Error(`cost_settings insert: ${error.message}`);
}

async function upsertEligibilityRule(admin, fks, countryId, countryName, educationLevel, payload) {
  const { data: existing } = await admin
    .from("eligibility_rules")
    .select("id")
    .eq("country", countryName)
    .eq("education_level", educationLevel)
    .maybeSingle();

  const row = applyFkPayload(
    fks,
    {
      country: countryName,
      country_id: countryId,
      education_level: educationLevel,
      ...payload,
    },
    [["eligibility_rules", "country_id"]]
  );

  if (existing) {
    const { error } = await admin.from("eligibility_rules").update(row).eq("id", existing.id);
    if (error) throw new Error(`eligibility_rules update: ${error.message}`);
    return;
  }

  const { error } = await admin.from("eligibility_rules").insert(row);
  if (error) throw new Error(`eligibility_rules insert: ${error.message}`);
}

async function upsertFaq(admin, question, payload) {
  const { data: existing } = await admin.from("faqs").select("id").eq("question", question).maybeSingle();
  if (existing) {
    const { error } = await admin.from("faqs").update(payload).eq("id", existing.id);
    if (error) throw new Error(`faqs update: ${error.message}`);
    return;
  }
  const { error } = await admin.from("faqs").insert({ question, ...payload });
  if (error) throw new Error(`faqs insert: ${error.message}`);
}

async function upsertTestimonial(admin, fks, studentName, payload) {
  const { data: existing } = await admin
    .from("testimonials")
    .select("id")
    .eq("student_name", studentName)
    .maybeSingle();

  const row = applyFkPayload(fks, payload, [
    ["testimonials", "country_id"],
    ["testimonials", "university_id"],
  ]);

  if (existing) {
    const { error } = await admin.from("testimonials").update(row).eq("id", existing.id);
    if (error) throw new Error(`testimonials update: ${error.message}`);
    return;
  }

  const { error } = await admin.from("testimonials").insert({ student_name: studentName, ...row });
  if (error) throw new Error(`testimonials insert: ${error.message}`);
}

const COUNTRIES = [
  {
    slug: "uk",
    name: "United Kingdom",
    description:
      "Home to historic universities and globally recognised degrees. The UK offers shorter program lengths and strong post-study work options.",
    hero_title: "Study in the United Kingdom",
    hero_subtitle: "World-class education in 1–2 year master's programs",
    tuition_min: 12000,
    tuition_max: 28000,
    living_cost_min: 900,
    living_cost_max: 1400,
    visa_summary:
      "Most students apply for a Student visa with a CAS from their university. Processing typically takes 3–8 weeks.",
    admission_requirements:
      "HSC/A-Level or equivalent for undergraduate study. Bachelor's degree for postgraduate programs. IELTS 6.0–6.5 is common.",
    scholarship_summary: "Merit and need-based scholarships available at many universities.",
    intakes: ["September", "January"],
    is_published: true,
  },
  {
    slug: "canada",
    name: "Canada",
    description:
      "Canada combines affordable tuition with excellent quality of life and clear pathways to post-graduation work permits.",
    hero_title: "Study in Canada",
    hero_subtitle: "Affordable degrees and strong immigration pathways",
    tuition_min: 15000,
    tuition_max: 35000,
    living_cost_min: 800,
    living_cost_max: 1200,
    visa_summary:
      "Apply for a study permit with your letter of acceptance. Biometrics and proof of funds are required.",
    admission_requirements:
      "Strong academic record and English proficiency (IELTS 6.0+). Some programs require GRE or work experience.",
    scholarship_summary: "Provincial and university scholarships for international students.",
    intakes: ["September", "January", "May"],
    is_published: true,
  },
  {
    slug: "australia",
    name: "Australia",
    description:
      "Australia offers a vibrant student life, research-led universities, and post-study work rights in major cities.",
    hero_title: "Study in Australia",
    hero_subtitle: "High-quality education in a multicultural environment",
    tuition_min: 18000,
    tuition_max: 40000,
    living_cost_min: 1000,
    living_cost_max: 1500,
    visa_summary:
      "Student visa (subclass 500) requires enrolment confirmation, OSHC insurance, and financial evidence.",
    admission_requirements:
      "Academic transcripts, English test scores, and statement of purpose. Requirements vary by university tier.",
    scholarship_summary: "Australia Awards and university merit scholarships for eligible students.",
    intakes: ["February", "July"],
    is_published: true,
  },
  {
    slug: "usa",
    name: "United States",
    description:
      "The US hosts thousands of institutions with flexible majors, strong research funding, and OPT work opportunities.",
    hero_title: "Study in the United States",
    hero_subtitle: "Flexible programs and global career opportunities",
    tuition_min: 20000,
    tuition_max: 55000,
    living_cost_min: 1000,
    living_cost_max: 1800,
    visa_summary:
      "F-1 student visa after receiving Form I-20. SEVIS fee and embassy interview required.",
    admission_requirements:
      "SAT/ACT for undergrad; GRE/GMAT for many graduate programs. Strong English proficiency required.",
    scholarship_summary: "Merit aid and assistantships available, especially at graduate level.",
    intakes: ["August", "January"],
    is_published: true,
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    description:
      "Malaysia offers affordable English-medium education with branch campuses of international universities.",
    hero_title: "Study in Malaysia",
    hero_subtitle: "Affordable international degrees close to home",
    tuition_min: 4000,
    tuition_max: 12000,
    living_cost_min: 400,
    living_cost_max: 700,
    visa_summary:
      "Student pass sponsored by the institution. Straightforward process for accepted applicants.",
    admission_requirements:
      "HSC or equivalent. Many programs accept MOI or pathway English courses.",
    scholarship_summary: "Government and institutional scholarships for ASEAN and South Asian students.",
    intakes: ["February", "September"],
    is_published: true,
  },
  {
    slug: "germany",
    name: "Germany",
    description:
      "Many public universities charge low or no tuition fees. Germany is ideal for engineering, sciences, and research.",
    hero_title: "Study in Germany",
    hero_subtitle: "Low-tuition education in Europe's innovation hub",
    tuition_min: 0,
    tuition_max: 8000,
    living_cost_min: 700,
    living_cost_max: 1100,
    visa_summary:
      "National visa for study purposes. Blocked account (€11,904+) typically required for living costs.",
    admission_requirements:
      "Abitur-equivalent for bachelor programs. APS certificate may be required for some countries.",
    scholarship_summary: "DAAD scholarships and university waivers for outstanding applicants.",
    intakes: ["October", "April"],
    is_published: true,
  },
];

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const fks = await detectFkColumns(admin);
  warnIfMigrationMissing(fks);

  console.log("Seeding countries...");
  const countryIds = {};
  for (const country of COUNTRIES) {
    const { slug, ...payload } = country;
    countryIds[slug] = await upsertBySlug(admin, "countries", slug, payload);
  }

  console.log("Seeding universities...");
  const universitySeeds = [
    {
      slug: "university-of-toronto",
      country_id: countryIds.canada,
      name: "University of Toronto",
      city: "Toronto",
      ranking: "#21 Global",
      description: "Canada's top research university with programs across sciences, business, and engineering.",
      tuition_min: 35000,
      tuition_max: 55000,
      application_fee: 180,
      requirements: "IELTS 6.5 overall, strong GPA, statement of purpose.",
      intakes: ["September", "January"],
      scholarship_available: true,
      is_featured: true,
      is_published: true,
    },
    {
      slug: "university-of-manchester",
      country_id: countryIds.uk,
      name: "University of Manchester",
      city: "Manchester",
      ranking: "#32 Global",
      description: "Russell Group university known for research and employability.",
      tuition_min: 22000,
      tuition_max: 28000,
      application_fee: 60,
      requirements: "IELTS 6.5, relevant bachelor's for postgraduate entry.",
      intakes: ["September"],
      scholarship_available: true,
      is_featured: true,
      is_published: true,
    },
    {
      slug: "monash-university",
      country_id: countryIds.australia,
      name: "Monash University",
      city: "Melbourne",
      ranking: "#42 Global",
      description: "Leading Australian university with strong industry links and global campuses.",
      tuition_min: 28000,
      tuition_max: 40000,
      application_fee: 100,
      requirements: "IELTS 6.5, academic transcripts, passport copy.",
      intakes: ["February", "July"],
      scholarship_available: true,
      is_featured: true,
      is_published: true,
    },
    {
      slug: "university-of-british-columbia",
      country_id: countryIds.canada,
      name: "University of British Columbia",
      city: "Vancouver",
      ranking: "#34 Global",
      description: "Top-ranked Canadian university on the Pacific coast.",
      tuition_min: 32000,
      tuition_max: 48000,
      application_fee: 168,
      requirements: "IELTS 6.5, competitive GPA.",
      intakes: ["September"],
      scholarship_available: true,
      is_featured: false,
      is_published: true,
    },
    {
      slug: "arizona-state-university",
      country_id: countryIds.usa,
      name: "Arizona State University",
      city: "Tempe",
      ranking: "#Top 150 US",
      description: "Innovation-focused US university with diverse program options.",
      tuition_min: 28000,
      tuition_max: 38000,
      application_fee: 90,
      requirements: "IELTS 6.5 or TOEFL equivalent, SAT optional for many programs.",
      intakes: ["August", "January"],
      scholarship_available: true,
      is_featured: false,
      is_published: true,
    },
  ];

  const universityIds = {};
  for (const uni of universitySeeds) {
    const { slug, ...payload } = uni;
    universityIds[slug] = await upsertBySlug(admin, "universities", slug, payload);
  }

  console.log("Seeding courses...");
  const courseSeeds = [
    {
      university: "university-of-toronto",
      slug: "bsc-computer-science",
      title: "BSc Computer Science",
      degree_level: "Bachelor",
      subject_area: "Computer Science",
      duration: "4 years",
      tuition_fee: 42000,
      application_fee: 180,
      language_requirement: "IELTS 6.5",
      academic_requirement: "HSC with strong Math and Science",
      intakes: ["September"],
      is_published: true,
    },
    {
      university: "university-of-toronto",
      slug: "msc-data-science",
      title: "MSc Data Science",
      degree_level: "Master",
      subject_area: "Data Science",
      duration: "2 years",
      tuition_fee: 38000,
      application_fee: 180,
      language_requirement: "IELTS 7.0",
      academic_requirement: "Bachelor in CS, Math, or related field",
      intakes: ["September"],
      is_published: true,
    },
    {
      university: "university-of-manchester",
      slug: "msc-business-analytics",
      title: "MSc Business Analytics",
      degree_level: "Master",
      subject_area: "Business",
      duration: "1 year",
      tuition_fee: 26000,
      application_fee: 60,
      language_requirement: "IELTS 6.5",
      academic_requirement: "Bachelor's degree with quantitative background",
      intakes: ["September"],
      is_published: true,
    },
    {
      university: "monash-university",
      slug: "bachelor-information-technology",
      title: "Bachelor of Information Technology",
      degree_level: "Bachelor",
      subject_area: "Information Technology",
      duration: "3 years",
      tuition_fee: 32000,
      application_fee: 100,
      language_requirement: "IELTS 6.5",
      academic_requirement: "HSC or equivalent",
      intakes: ["February", "July"],
      is_published: true,
    },
    {
      university: "university-of-british-columbia",
      slug: "bachelor-engineering",
      title: "Bachelor of Applied Science (Engineering)",
      degree_level: "Bachelor",
      subject_area: "Engineering",
      duration: "4 years",
      tuition_fee: 45000,
      application_fee: 168,
      language_requirement: "IELTS 6.5",
      academic_requirement: "Strong Math and Physics background",
      intakes: ["September"],
      is_published: true,
    },
  ];

  const courseIds = {};
  for (const course of courseSeeds) {
    const { university, slug, ...payload } = course;
    courseIds[slug] = await upsertCourse(admin, universityIds[university], slug, payload);
  }

  console.log("Seeding scholarships...");
  const scholarshipSeeds = [
    {
      slug: "uoft-international-scholarship",
      university_id: universityIds["university-of-toronto"],
      country_id: countryIds.canada,
      title: "University of Toronto International Scholar Award",
      degree_level: "Bachelor",
      amount: "Up to CAD 20,000/year",
      eligibility: "Outstanding academic achievement and leadership.",
      deadline: "2026-12-01",
      description: "Merit-based award for high-achieving international undergraduate applicants.",
      is_published: true,
    },
    {
      slug: "manchester-global-futures",
      university_id: universityIds["university-of-manchester"],
      country_id: countryIds.uk,
      title: "Manchester Global Futures Scholarship",
      degree_level: "Master",
      amount: "£5,000 – £10,000",
      eligibility: "First-class equivalent GPA and strong SOP.",
      deadline: "2026-06-30",
      description: "Partial tuition scholarship for postgraduate international students.",
      is_published: true,
    },
    {
      slug: "monash-leadership-scholarship",
      university_id: universityIds["monash-university"],
      country_id: countryIds.australia,
      title: "Monash International Leadership Scholarship",
      degree_level: "Bachelor",
      amount: "AUD 10,000",
      eligibility: "IELTS 7.0+ and extracurricular excellence.",
      deadline: "2026-08-15",
      description: "Recognises students with leadership potential and academic merit.",
      is_published: true,
    },
  ];

  for (const scholarship of scholarshipSeeds) {
    const { slug, ...payload } = scholarship;
    await upsertBySlug(admin, "scholarships", slug, payload);
  }

  console.log("Seeding blog posts...");
  const blogSeeds = [
    {
      slug: "how-to-choose-study-abroad-country",
      title: "How to Choose the Right Study Abroad Country",
      excerpt: "A practical framework for comparing destinations by budget, career goals, and visa pathways.",
      content:
        "<p>Choosing where to study abroad is one of the biggest decisions you'll make. Start by defining your budget, preferred subject, and post-graduation plans.</p><p>Compare tuition, living costs, and work rights. Then shortlist 2–3 countries and speak with a counselor before applying.</p>",
      meta_title: "How to Choose a Study Abroad Country",
      meta_description: "Compare countries by cost, visa rules, and career outcomes.",
      is_published: true,
      published_at: new Date().toISOString(),
    },
    {
      slug: "ielts-preparation-guide-2026",
      title: "IELTS Preparation Guide for 2026 Applicants",
      excerpt: "Target band scores, study timelines, and common mistakes to avoid before your test.",
      content:
        "<p>Most universities require IELTS 6.0–6.5 for undergraduate programs and 6.5–7.0 for competitive master's degrees.</p><p>Plan 8–12 weeks of preparation, practise timed writing tasks, and book your test early for popular intake deadlines.</p>",
      meta_title: "IELTS Preparation Guide 2026",
      meta_description: "Tips to reach your target IELTS score for university applications.",
      is_published: true,
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      slug: "canada-student-visa-checklist",
      title: "Canada Student Visa Checklist",
      excerpt: "Documents and steps for a smooth study permit application.",
      content:
        "<p>After receiving your letter of acceptance, gather proof of funds, passport, photos, and biometrics.</p><p>Apply online through IRCC, pay fees, and track your application status. Processing times vary by country.</p>",
      meta_title: "Canada Student Visa Checklist",
      meta_description: "Step-by-step Canada study permit document checklist.",
      is_published: true,
      published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const post of blogSeeds) {
    const { slug, ...payload } = post;
    await upsertBySlug(admin, "blog_posts", slug, payload);
  }

  console.log("Seeding FAQs...");
  const faqSeeds = [
    {
      question: "How long does the application process take?",
      answer:
        "Typically 3–6 months depending on the country and intake. We recommend starting at least 6 months before your desired intake.",
      category: "general",
      sort_order: 1,
      is_published: true,
    },
    {
      question: "Do I need IELTS for all countries?",
      answer:
        "Most English-speaking countries require IELTS, PTE, or TOEFL. Some universities accept MOI letters. Requirements vary by country and program.",
      category: "general",
      sort_order: 2,
      is_published: true,
    },
    {
      question: "Is the consultation really free?",
      answer:
        "Yes! Your first consultation with our counselors is completely free with no obligation.",
      category: "general",
      sort_order: 3,
      is_published: true,
    },
    {
      question: "Can you help with visa applications?",
      answer:
        "Absolutely. We provide end-to-end visa support including document preparation, application submission, and interview preparation.",
      category: "general",
      sort_order: 4,
      is_published: true,
    },
    {
      question: "What documents do I need to start?",
      answer:
        "Passport, academic transcripts, English test score (if available), and CV. Your counselor will share a tailored checklist.",
      category: "documents",
      sort_order: 5,
      is_published: true,
    },
  ];

  for (const faq of faqSeeds) {
    const { question, ...payload } = faq;
    await upsertFaq(admin, question, payload);
  }

  console.log("Seeding testimonials...");
  const testimonialSeeds = [
    {
      student_name: "Rahim Ahmed",
      countrySlug: "canada",
      universitySlug: "university-of-toronto",
      quote:
        "Abroadly guided me from university shortlisting to visa approval. I couldn't have done it without them.",
      rating: 5,
      is_published: true,
    },
    {
      student_name: "Fatima Khan",
      countrySlug: "uk",
      universitySlug: "university-of-manchester",
      quote:
        "The counselors were incredibly supportive throughout my application process. Highly recommended!",
      rating: 5,
      is_published: true,
    },
    {
      student_name: "Karim Hassan",
      countrySlug: "australia",
      universitySlug: "monash-university",
      quote:
        "Got my scholarship with their help. The eligibility checker was spot on with recommendations.",
      rating: 5,
      is_published: true,
    },
    {
      student_name: "Nadia Islam",
      countrySlug: "canada",
      universitySlug: "university-of-british-columbia",
      quote:
        "Clear timelines, honest advice, and fast document reviews. My study permit was approved on the first try.",
      rating: 5,
      is_published: true,
    },
  ];

  for (const testimonial of testimonialSeeds) {
    const { student_name, countrySlug, universitySlug, ...rest } = testimonial;
    const countryId = countryIds[countrySlug];
    const universityId = universityIds[universitySlug];
    const countryName = COUNTRIES.find((c) => c.slug === countrySlug)?.name ?? null;
    const universityName = universitySeeds.find((u) => u.slug === universitySlug)?.name ?? null;

    await upsertTestimonial(admin, fks, student_name, {
      ...rest,
      country_id: countryId ?? null,
      university_id: universityId ?? null,
      destination_country: countryName,
      university_name: universityName,
    });
  }

  console.log("Seeding cost settings...");
  const costSeeds = [
    { countrySlug: "canada", degree_level: "Bachelor", tuition_min: 15000, tuition_max: 35000, living_cost_min: 800, living_cost_max: 1200, visa_fee: 200, insurance_fee: 700, application_fee: 150 },
    { countrySlug: "canada", degree_level: "Master", tuition_min: 18000, tuition_max: 40000, living_cost_min: 900, living_cost_max: 1300, visa_fee: 200, insurance_fee: 700, application_fee: 150 },
    { countrySlug: "uk", degree_level: "Bachelor", tuition_min: 12000, tuition_max: 25000, living_cost_min: 900, living_cost_max: 1400, visa_fee: 500, insurance_fee: 600, application_fee: 100 },
    { countrySlug: "uk", degree_level: "Master", tuition_min: 14000, tuition_max: 28000, living_cost_min: 1000, living_cost_max: 1500, visa_fee: 500, insurance_fee: 600, application_fee: 100 },
    { countrySlug: "australia", degree_level: "Bachelor", tuition_min: 18000, tuition_max: 35000, living_cost_min: 1000, living_cost_max: 1500, visa_fee: 650, insurance_fee: 500, application_fee: 100 },
    { countrySlug: "malaysia", degree_level: "Bachelor", tuition_min: 4000, tuition_max: 12000, living_cost_min: 400, living_cost_max: 700, visa_fee: 100, insurance_fee: 300, application_fee: 50 },
    { countrySlug: "germany", degree_level: "Master", tuition_min: 0, tuition_max: 8000, living_cost_min: 700, living_cost_max: 1100, visa_fee: 100, insurance_fee: 400, application_fee: 75 },
  ];

  for (const cost of costSeeds) {
    const { countrySlug, degree_level, ...payload } = cost;
    const countryName = COUNTRIES.find((c) => c.slug === countrySlug)?.name;
    await upsertCostSetting(admin, fks, countryIds[countrySlug], countryName, degree_level, payload);
  }

  console.log("Seeding eligibility rules...");
  const eligibilitySeeds = [
    {
      countrySlug: "canada",
      education_level: "Bachelor",
      min_cgpa: 2.5,
      min_ielts: 6.0,
      min_budget: 15000,
      recommendation: "Strong pathway for STEM and business programs with post-graduation work options.",
      is_active: true,
    },
    {
      countrySlug: "canada",
      education_level: "Master",
      min_cgpa: 3.0,
      min_ielts: 6.5,
      min_budget: 20000,
      recommendation: "Ideal for career-focused master's degrees and PR pathways.",
      is_active: true,
    },
    {
      countrySlug: "uk",
      education_level: "Master",
      min_cgpa: 3.0,
      min_ielts: 6.5,
      min_budget: 18000,
      recommendation: "One-year master's programs with global recognition.",
      is_active: true,
    },
    {
      countrySlug: "malaysia",
      education_level: "Bachelor",
      min_cgpa: 2.0,
      min_ielts: 5.5,
      min_budget: 8000,
      recommendation: "Affordable English-medium education with branch campuses.",
      is_active: true,
    },
    {
      countrySlug: "germany",
      education_level: "Master",
      min_cgpa: 3.0,
      min_ielts: 6.5,
      min_budget: 12000,
      recommendation: "Low-tuition options for engineering and research programs.",
      is_active: true,
    },
  ];

  for (const rule of eligibilitySeeds) {
    const { countrySlug, education_level, ...payload } = rule;
    const countryName = COUNTRIES.find((c) => c.slug === countrySlug)?.name;
    await upsertEligibilityRule(admin, fks, countryIds[countrySlug], countryName, education_level, payload);
  }

  console.log("\nContent seed complete!");
  console.log(`  Countries:      ${COUNTRIES.length}`);
  console.log(`  Universities:   ${universitySeeds.length}`);
  console.log(`  Courses:        ${courseSeeds.length}`);
  console.log(`  Scholarships:   ${scholarshipSeeds.length}`);
  console.log(`  Blog posts:     ${blogSeeds.length}`);
  console.log(`  FAQs:           ${faqSeeds.length}`);
  console.log(`  Testimonials:   ${testimonialSeeds.length}`);
  console.log(`  Cost settings:  ${costSeeds.length}`);
  console.log(`  Eligibility:    ${eligibilitySeeds.length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
