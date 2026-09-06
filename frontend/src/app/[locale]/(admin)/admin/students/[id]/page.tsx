import { AdminDocumentsPanel } from "@/components/admin/AdminDocumentsPanel";

import { GlassPanelCard } from "@/components/common/GlassCard";

import { PageHeader } from "@/components/common/PageHeader";

import { PageStack } from "@/components/common/PageStack";

import { StatusBadge } from "@/components/common/StatusBadge";

import { resolveStudentCountryNames } from "@/lib/countries/display";

import { translateStatus } from "@/lib/i18n-format";

import { Link } from "@/i18n/navigation";

import { STUDENTS_WITH_PROFILE_DETAIL } from "@/lib/supabase/embeds";

import { createClient } from "@/lib/supabase/server";

import { Descriptions } from "antd";

import { getLocale, getTranslations } from "next-intl/server";

import { notFound } from "next/navigation";

import { SendNotificationForm } from "./SendNotificationForm";



interface Props {

  params: Promise<{ id: string }>;

}



export default async function AdminStudentDetailPage({ params }: Props) {

  const { id } = await params;

  const locale = await getLocale();

  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";

  const tStatus = await getTranslations("status");

  const supabase = await createClient();

  const { data: student } = await supabase

    .from("students")

    .select(STUDENTS_WITH_PROFILE_DETAIL)

    .eq("id", id)

    .single();



  if (!student) notFound();



  const countryMap = await resolveStudentCountryNames(supabase, [student]);

  const countryDisplay = countryMap.get(student.id) ?? "—";



  const [{ data: applications }, { data: documents }] = await Promise.all([

    supabase

      .from("applications")

      .select("*, universities(name), countries(name)")

      .eq("student_id", id)

      .order("updated_at", { ascending: false }),

    supabase

      .from("documents")

      .select("*")

      .eq("student_id", id)

      .order("uploaded_at", { ascending: false }),

  ]);



  const profile = student.profiles as {

    id: string;

    full_name?: string;

    email?: string;

    phone?: string;

  };



  const docItems = (documents ?? []).map((d) => ({

    id: d.id,

    document_type: d.document_type,

    file_name: d.file_name,

    mime_type: d.mime_type,

    status: d.status,

    statusLabel: translateStatus(tStatus, d.status),

    uploaded_at: d.uploaded_at,

  }));



  return (

    <PageStack>

      <PageHeader

        compact

        title={profile.full_name ?? "Student"}

        description={profile.email}

      />



      <div className="grid gap-6 lg:grid-cols-2">

        <GlassPanelCard title="Profile" variant="glass" contentClassName="panel-descriptions">

          <Descriptions column={1} size="small">

            <Descriptions.Item label="Email">{profile.email ?? "—"}</Descriptions.Item>

            <Descriptions.Item label="Phone">{profile.phone ?? "—"}</Descriptions.Item>

            <Descriptions.Item label="Country">{countryDisplay}</Descriptions.Item>

            <Descriptions.Item label="Education">

              {student.highest_education ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="Institution">

              {student.institution_name ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="CGPA">{student.cgpa ?? "—"}</Descriptions.Item>

            <Descriptions.Item label="English test">

              {[student.english_test_type, student.english_test_score]

                .filter(Boolean)

                .join(" · ") || "—"}

            </Descriptions.Item>

          </Descriptions>

        </GlassPanelCard>



        <GlassPanelCard title="Send notification" variant="glass">

          <SendNotificationForm userId={profile.id} />

        </GlassPanelCard>



        <GlassPanelCard

          title={`Applications (${applications?.length ?? 0})`}

          variant="glass"

        >

          {(applications?.length ?? 0) === 0 ? (

            <p className="text-sm text-muted-foreground">No applications yet</p>

          ) : (

            <ul className="space-y-3">

              {applications?.map((a) => (

                <li

                  key={a.id}

                  className="flex items-center justify-between gap-3 rounded-xl border border-foreground/5 bg-muted/20 p-3"

                >

                  <div className="min-w-0">

                    <Link

                      href={`/admin/applications/${a.id}`}

                      className="font-medium text-primary hover:underline"

                    >

                      {(a.universities as { name?: string })?.name ?? "Application"}

                    </Link>

                    <p className="text-xs text-muted-foreground">

                      {(a.countries as { name?: string })?.name ?? ""}

                    </p>

                  </div>

                  <StatusBadge status={a.status} />

                </li>

              ))}

            </ul>

          )}

        </GlassPanelCard>



        <GlassPanelCard

          title={`Documents (${docItems.length})`}

          description="Preview any file and approve or reject at any time"

          variant="glass"

          className="lg:col-span-2"

        >

          <AdminDocumentsPanel documents={docItems} locale={dateLocale} />

        </GlassPanelCard>

      </div>

    </PageStack>

  );

}


