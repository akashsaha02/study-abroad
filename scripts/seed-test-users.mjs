/**
 * Seeds test users and sample CRM data for local/staging demos.
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 *
 * Depends on content seed (npm run seed:content) for country/university/course FKs.
 *
 * Usage: npm run seed:test
 */

import { createClient } from "@supabase/supabase-js";
import { applyFkPayload, detectFkColumns, warnIfMigrationMissing } from "./seed-fk-support.mjs";

const TEST_PASSWORD = "Test@12345";

const USERS = [
  {
    email: "student@test.abroadly.com",
    fullName: "Test Student",
    phone: "+8801710000001",
    role: "student",
  },
  {
    email: "counselor@test.abroadly.com",
    fullName: "Test Counselor",
    phone: "+8801710000002",
    role: "counselor",
  },
  {
    email: "admin@test.abroadly.com",
    fullName: "Test Admin",
    phone: "+8801710000003",
    role: "admin",
  },
  {
    email: "superadmin@test.abroadly.com",
    fullName: "Test Super Admin",
    phone: "+8801710000004",
    role: "super_admin",
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.local`);
    process.exit(1);
  }
  return value;
}

async function findUserByEmail(admin, email) {
  let page = 1;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((u) => u.email === email);
    if (user) return user;
    if (data.users.length < 200) break;
    page += 1;
  }
  return null;
}

async function ensureUser(admin, { email, fullName, phone, role }) {
  let user = await findUserByEmail(admin, email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone },
    });
    if (error) throw new Error(`Create ${email}: ${error.message}`);
    user = data.user;
    console.log(`  Created auth user: ${email}`);
  } else {
    await admin.auth.admin.updateUserById(user.id, {
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone },
    });
    console.log(`  Updated auth user: ${email}`);
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    email,
    full_name: fullName,
    phone,
    role,
  });
  if (profileError) throw new Error(`Profile ${email}: ${profileError.message}`);

  return user;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const fks = await detectFkColumns(admin);
  warnIfMigrationMissing(fks);

  console.log("Seeding test users...\n");

  const ids = {};
  for (const u of USERS) {
    const user = await ensureUser(admin, u);
    ids[u.role] = user.id;
  }

  const studentId = ids.student;
  const counselorId = ids.counselor;

  console.log("\nSeeding counselor record...");
  const { data: existingCounselor } = await admin
    .from("counselors")
    .select("id")
    .eq("profile_id", counselorId)
    .maybeSingle();

  if (!existingCounselor) {
    await admin.from("counselors").insert({
      profile_id: counselorId,
      specialization: "Study Abroad Counseling",
      bio: "Test counselor account for demo flows.",
      is_active: true,
    });
  }

  console.log("Seeding student record...");
  const { data: canada } = await admin.from("countries").select("id, name").eq("slug", "canada").maybeSingle();

  let studentRecordId;
  const { data: existingStudent } = await admin
    .from("students")
    .select("id")
    .eq("profile_id", studentId)
    .maybeSingle();

  const studentPayload = applyFkPayload(
    fks,
    {
      assigned_counselor_id: counselorId,
      preferred_country: canada?.name ?? "Canada",
      preferred_country_id: canada?.id ?? null,
      preferred_subject: "Computer Science",
      highest_education: "Bachelor",
    },
    [["students", "preferred_country_id"]]
  );

  if (existingStudent) {
    studentRecordId = existingStudent.id;
    await admin.from("students").update(studentPayload).eq("id", studentRecordId);
  } else {
    const { data: studentRow, error } = await admin
      .from("students")
      .insert({
        profile_id: studentId,
        nationality: "Bangladesh",
        ...studentPayload,
      })
      .select("id")
      .single();
    if (error) throw error;
    studentRecordId = studentRow.id;
  }

  console.log("Seeding leads...");
  const leadSeeds = [
    { name: "Rahim Ahmed", phone: "+8801711111111", status: "new", source: "contact_form" },
    { name: "Sadia Khan", phone: "+8801722222222", status: "contacted", source: "eligibility_checker" },
    { name: "Karim Hassan", phone: "+8801733333333", status: "qualified", source: "website" },
    { name: "Nadia Islam", phone: "+8801744444444", status: "new", source: "cost_calculator" },
  ];

  for (const [i, lead] of leadSeeds.entries()) {
    const { data: existing } = await admin
      .from("leads")
      .select("id")
      .eq("phone", lead.phone)
      .maybeSingle();

    const payload = applyFkPayload(
      fks,
      {
        ...lead,
        email: `lead${i + 1}@test.abroadly.com`,
        preferred_country: canada?.name ?? "Canada",
        preferred_country_id: canada?.id ?? null,
        assigned_counselor_id: i < 2 ? counselorId : null,
      },
      [["leads", "preferred_country_id"]]
    );

    if (existing) {
      await admin.from("leads").update(payload).eq("id", existing.id);
    } else {
      await admin.from("leads").insert(payload);
    }
  }

  console.log("Linking application to demo content...");
  const [{ data: uoft }, { data: mscCourse }] = await Promise.all([
    admin.from("universities").select("id").eq("slug", "university-of-toronto").maybeSingle(),
    admin
      .from("courses")
      .select("id")
      .eq("slug", "msc-data-science")
      .maybeSingle(),
  ]);

  console.log("Seeding application...");
  let applicationId;
  const { data: existingApp } = await admin
    .from("applications")
    .select("id")
    .eq("student_id", studentRecordId)
    .maybeSingle();

  const applicationPayload = {
    counselor_id: counselorId,
    status: "documents_pending",
    intake: "Fall 2026",
    country_id: canada?.id ?? null,
    university_id: uoft?.id ?? null,
    course_id: mscCourse?.id ?? null,
    student_note: "Interested in data science programs in Toronto.",
  };

  if (existingApp) {
    applicationId = existingApp.id;
    await admin.from("applications").update(applicationPayload).eq("id", applicationId);
  } else {
    const { data: appRow, error } = await admin
      .from("applications")
      .insert({
        student_id: studentRecordId,
        priority: "normal",
        ...applicationPayload,
      })
      .select("id")
      .single();
    if (error) throw error;
    applicationId = appRow.id;
  }

  console.log("Seeding application steps...");
  const stepSeeds = [
    { title: "Profile review", description: "Verify student profile and goals", status: "completed", sort_order: 1 },
    { title: "Document collection", description: "Gather transcripts and passport", status: "in_progress", sort_order: 2 },
    { title: "University shortlisting", description: "Finalize program choices", status: "pending", sort_order: 3 },
    { title: "Application submission", description: "Submit to selected universities", status: "pending", sort_order: 4 },
  ];

  for (const step of stepSeeds) {
    const { data: existing } = await admin
      .from("application_steps")
      .select("id")
      .eq("application_id", applicationId)
      .eq("title", step.title)
      .maybeSingle();

    const payload = { application_id: applicationId, ...step };
    if (existing) {
      await admin.from("application_steps").update(payload).eq("id", existing.id);
    } else {
      await admin.from("application_steps").insert(payload);
    }
  }

  console.log("Seeding documents...");
  const docSeeds = [
    { document_type: "passport", status: "pending_review", file_path: "seed/passport.pdf" },
    { document_type: "transcript", status: "needs_update", file_path: "seed/transcript.pdf" },
  ];

  for (const doc of docSeeds) {
    const { data: existing } = await admin
      .from("documents")
      .select("id")
      .eq("student_id", studentRecordId)
      .eq("document_type", doc.document_type)
      .maybeSingle();

    const payload = {
      student_id: studentRecordId,
      application_id: applicationId,
      document_type: doc.document_type,
      file_path: doc.file_path,
      file_name: doc.file_path.split("/").pop(),
      status: doc.status,
    };

    if (existing) {
      await admin.from("documents").update(payload).eq("id", existing.id);
    } else {
      await admin.from("documents").insert(payload);
    }
  }

  console.log("Seeding notifications...");
  const notifSeeds = [
    { title: "Welcome to Abroadly", message: "Complete your profile to get started.", is_read: true },
    { title: "Document needs update", message: "Please re-upload your transcript.", is_read: false },
  ];

  for (const n of notifSeeds) {
    const { data: existing } = await admin
      .from("notifications")
      .select("id")
      .eq("user_id", studentId)
      .eq("title", n.title)
      .maybeSingle();

    if (!existing) {
      await admin.from("notifications").insert({ user_id: studentId, ...n, type: "info" });
    }
  }

  console.log("Seeding lead notes...");
  const { data: sampleLead } = await admin
    .from("leads")
    .select("id")
    .eq("phone", "+8801722222222")
    .maybeSingle();

  if (sampleLead) {
    const noteContent = "Followed up via phone — interested in Canada Fall 2026 intake.";
    const { data: existingNote } = await admin
      .from("notes")
      .select("id")
      .eq("lead_id", sampleLead.id)
      .eq("content", noteContent)
      .maybeSingle();

    if (!existingNote) {
      await admin.from("notes").insert({
        author_id: counselorId,
        lead_id: sampleLead.id,
        content: noteContent,
        visibility: "internal",
      });
    }
  }

  console.log("Seeding consultation...");
  const { data: existingConsult } = await admin
    .from("consultations")
    .select("id")
    .eq("student_id", studentRecordId)
    .eq("status", "scheduled")
    .maybeSingle();

  if (!existingConsult) {
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 7);
    await admin.from("consultations").insert({
      student_id: studentRecordId,
      counselor_id: counselorId,
      status: "scheduled",
      scheduled_at: scheduledAt.toISOString(),
      notes: "Initial counseling session",
    });
  }

  console.log("\nSeed complete!\n");
  console.log("Test accounts (password for all: Test@12345):");
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(12)} ${u.email}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
