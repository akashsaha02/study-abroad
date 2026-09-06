import { AdminDocumentsPanel } from "@/features/documents/components/AdminDocumentsPanel";

import { ApplicationTargetForm } from "@/features/applications/components/ApplicationTargetForm";

import { GlassPanelCard, GlassStatCard } from "@/components/common/GlassCard";

import { PageHeader } from "@/components/common/PageHeader";

import { PageStack, SectionStack } from "@/components/common/PageStack";

import { StatusBadge } from "@/components/common/StatusBadge";

import { ApplicationPipeline } from "@/features/applications/components/ApplicationPipeline";

import { Link } from "@/i18n/navigation";

import { translateStatus } from "@/lib/i18n-format";

import { APPLICATION_DETAIL_SELECT } from "@abroadly/shared/embeds";

import { createClient } from "@/lib/supabase/server";

import type { ApplicationStatus, ApplicationStep } from "@/types";

import {

  ArrowRight01Icon,

  CheckmarkCircle02Icon,

  File01Icon,

  Mail01Icon,

  UserIcon,

} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { getLocale, getTranslations } from "next-intl/server";

import { notFound } from "next/navigation";

import { ApplicationStepsSection } from "@/features/applications/components/ApplicationStepsSection";

import { ApplicationStatusForm } from "@/features/applications/components/ApplicationStatusForm";
import { getUser } from "@/infrastructure/auth/get-user";
import { isAdminRole, staffRoot } from "@/lib/staff-paths";



interface Props {

  params: Promise<{ id: string }>;

}



export default async function AdminApplicationDetailPage({ params }: Props) {

  const { id } = await params;

  const user = await getUser();
  const canManage = isAdminRole(user?.profile?.role);
  const root = staffRoot(user?.profile?.role);

  const locale = await getLocale();

  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";

  const tStatus = await getTranslations("status");

  const supabase = await createClient();

  const { data: app } = await supabase

    .from("applications")

    .select(APPLICATION_DETAIL_SELECT)

    .eq("id", id)

    .single();



  if (!app) notFound();



  const studentId = (app as { student_id?: string }).student_id ?? null;

  const studentProfile = app.students as {

    profiles?: { full_name?: string; email?: string };

  } | null;



  const universityName =

    (app.universities as { name?: string })?.name ?? "Application";

  const countryName = (app.countries as { name?: string })?.name ?? "";

  const courseTitle = (app.courses as { title?: string })?.title ?? "";



  const [

    { data: countries },

    { data: universities },

    { data: courses },

    { data: steps },

    { data: documents },

  ] = await Promise.all([

    supabase.from("countries").select("id, name").order("name"),

    supabase.from("universities").select("id, name, country_id").order("name"),

    supabase.from("courses").select("id, title, university_id").order("title"),

    supabase

      .from("application_steps")

      .select("*")

      .eq("application_id", id)

      .order("sort_order", { ascending: true }),

    studentId

      ? supabase

          .from("documents")

          .select("*")

          .eq("student_id", studentId)

          .order("uploaded_at", { ascending: false })

      : Promise.resolve({ data: [] as never[] }),

  ]);



  const docItems = (documents ?? []).map((d) => ({

    id: d.id,

    document_type: d.document_type,

    file_name: d.file_name,

    mime_type: d.mime_type,

    status: d.status,

    statusLabel: translateStatus(tStatus, d.status),

    uploaded_at: d.uploaded_at,

  }));



  const pendingDocs = docItems.filter((d) => d.status === "pending_review").length;

  const completedSteps = (steps ?? []).filter((s) => s.status === "completed").length;



  return (

    <PageStack>

      <PageHeader

        compact

        title={universityName}

        description={[countryName, courseTitle].filter(Boolean).join(" · ") || undefined}

      >

        <StatusBadge status={app.status} />

      </PageHeader>



      <div className="grid gap-4 sm:grid-cols-3">

        <GlassStatCard

          label="Student"

          value={

            <span className="truncate text-lg font-semibold">

              {studentProfile?.profiles?.full_name ?? "—"}

            </span>

          }

          icon={UserIcon}

          tone="primary"

          variant="glass"

        />

        <GlassStatCard

          label="Custom steps"

          value={

            <span className="text-lg font-semibold">

              {completedSteps}/{steps?.length ?? 0} complete

            </span>

          }

          icon={CheckmarkCircle02Icon}

          tone="success"

          variant="glass"

        />

        <GlassStatCard

          label="Documents"

          value={

            <span className="text-lg font-semibold">

              {docItems.length} total

              {pendingDocs > 0 ? (

                <span className="ml-1 text-sm font-normal text-amber-600">

                  · {pendingDocs} pending

                </span>

              ) : null}

            </span>

          }

          icon={File01Icon}

          tone="amber"

          variant="glass"

        />

      </div>



      <div className="grid gap-6 lg:grid-cols-12">

        <SectionStack className="lg:col-span-8">

          <GlassPanelCard

            title="Pipeline progress"

            description="Where this application sits in the end-to-end journey"

            variant="glass"

          >

            <ApplicationPipeline

              currentStatus={app.status as ApplicationStatus}

            />

          </GlassPanelCard>



          {canManage ? (
          <GlassPanelCard

            title="Checklist steps"

            description="Custom tasks for this specific application"

            variant="glass"

          >

            <ApplicationStepsSection

              applicationId={app.id}

              steps={(steps as ApplicationStep[]) ?? []}

            />

          </GlassPanelCard>
          ) : null}



          <GlassPanelCard

            title="Student documents"

            description="Preview and approve/reject anytime — including previously approved files"

            variant="glass"

          >

            <AdminDocumentsPanel documents={docItems} locale={dateLocale} canReview={canManage} />

          </GlassPanelCard>

        </SectionStack>



        <aside className="lg:col-span-4">

          <SectionStack className="lg:sticky lg:top-20 lg:self-start">

            <GlassPanelCard title="Student" variant="glass">

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <HugeiconsIcon icon={UserIcon} className="size-5" />

                  </span>

                  <div className="min-w-0">

                    <p className="truncate font-semibold">

                      {studentProfile?.profiles?.full_name ?? "Student"}

                    </p>

                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">

                      <HugeiconsIcon icon={Mail01Icon} className="size-3.5 shrink-0" />

                      {studentProfile?.profiles?.email ?? "—"}

                    </p>

                  </div>

                </div>

                {studentId ? (

                  <Link

                    href={`${root}/students/${studentId}`}

                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"

                  >

                    Open student profile

                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />

                  </Link>

                ) : null}

              </div>

            </GlassPanelCard>



            {canManage ? (
            <GlassPanelCard title="Update status" variant="glass">

              <ApplicationStatusForm

                applicationId={app.id}

                currentStatus={app.status}

                embedded

              />

            </GlassPanelCard>
            ) : null}



            {canManage ? (
            <GlassPanelCard title="Study targets" variant="glass">

              <ApplicationTargetForm

                applicationId={app.id}

                embedded

                countries={countries ?? []}

                universities={universities ?? []}

                courses={(courses ?? []).map((c) => ({

                  id: c.id,

                  name: c.title,

                  university_id: c.university_id,

                }))}

                initial={{

                  country_id: app.country_id,

                  university_id: app.university_id,

                  course_id: app.course_id,

                }}

              />

            </GlassPanelCard>
            ) : null}

          </SectionStack>

        </aside>

      </div>

    </PageStack>

  );

}


