import { GlassPanelCard } from "@/components/common/GlassCard";

import { PageHeader } from "@/components/common/PageHeader";

import { PageStack } from "@/components/common/PageStack";

import { StatusBadge } from "@/components/common/StatusBadge";

import { getLeadById } from "@/lib/services/leads";

import { createClient } from "@/lib/supabase/server";

import type { Note } from "@/types";

import { Descriptions } from "antd";

import { notFound } from "next/navigation";

import { LeadActions } from "./lead-actions";

import { LeadNotesSection } from "./LeadNotesSection";



interface Props {

  params: Promise<{ id: string }>;

}



export default async function LeadDetailPage({ params }: Props) {

  const { id } = await params;

  const lead = await getLeadById(id);

  if (!lead) notFound();



  const supabase = await createClient();



  const [{ data: counselors }, { data: studentProfiles }, { data: notes }] =

    await Promise.all([

      supabase

        .from("counselors")

        .select("profile_id, profiles(full_name)")

        .eq("is_active", true),

      supabase

        .from("profiles")

        .select("id, full_name, email")

        .eq("role", "student")

        .order("full_name"),

      supabase

        .from("notes")

        .select("*")

        .eq("lead_id", id)

        .order("created_at", { ascending: false }),

    ]);



  const counselorOptions = (counselors ?? []).map((c) => ({

    profile_id: c.profile_id,

    name: (c.profiles as { full_name?: string })?.full_name ?? c.profile_id,

  }));



  const profileOptions = (studentProfiles ?? []).map((p) => ({

    id: p.id,

    label: p.full_name ?? p.email ?? p.id,

  }));



  const authorIds = [...new Set((notes ?? []).map((n) => n.author_id))];

  const { data: authors } =

    authorIds.length > 0

      ? await supabase.from("profiles").select("id, full_name").in("id", authorIds)

      : { data: [] };



  const authorNames = Object.fromEntries(

    (authors ?? []).map((a) => [a.id, a.full_name ?? "Staff"])

  );



  return (

    <PageStack>

      <PageHeader compact title={lead.name} description={`Lead from ${lead.source}`}>

        <StatusBadge status={lead.status} />

      </PageHeader>



      <div className="grid gap-6 lg:grid-cols-2">

        <GlassPanelCard

          title="Contact & preferences"

          variant="glass"

          contentClassName="panel-descriptions"

        >

          <Descriptions column={1} size="small">

            <Descriptions.Item label="Phone">{lead.phone}</Descriptions.Item>

            <Descriptions.Item label="Email">{lead.email ?? "—"}</Descriptions.Item>

            <Descriptions.Item label="Country">

              {lead.preferred_country ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="Education">

              {lead.education_level ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="Subject interest">

              {lead.subject_interest ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="Last result">

              {lead.last_result ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="IELTS">

              {lead.ielts_score ?? "—"}

            </Descriptions.Item>

            <Descriptions.Item label="Budget">

              {lead.budget ? `$${lead.budget}` : "—"}

            </Descriptions.Item>

            {lead.message ? (

              <Descriptions.Item label="Message">{lead.message}</Descriptions.Item>

            ) : null}

          </Descriptions>

        </GlassPanelCard>



        <LeadActions

          leadId={lead.id}

          currentStatus={lead.status}

          assignedCounselorId={lead.assigned_counselor_id}

          isConverted={lead.status === "converted_to_student" || !!lead.converted_student_id}

          counselors={counselorOptions}

          studentProfiles={profileOptions}

        />



        <GlassPanelCard title="Internal notes" variant="glass" className="lg:col-span-2">

          <LeadNotesSection

            leadId={lead.id}

            notes={(notes as Note[]) ?? []}

            authorNames={authorNames}

          />

        </GlassPanelCard>

      </div>

    </PageStack>

  );

}


