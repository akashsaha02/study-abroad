import { Card } from "antd";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";

import { getLeadById } from "@/lib/services/leads";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types";
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
    <div className="space-y-6">
      <PageHeader title={lead.name} description={`Lead from ${lead.source}`}>
        <StatusBadge status={lead.status} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="space-y-3 p-6">
            <h3 className="font-semibold">Contact Info</h3>
            <p className="text-sm">
              <span className="text-muted-foreground">Phone:</span> {lead.phone}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Email:</span> {lead.email ?? "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Country:</span>{" "}
              {lead.preferred_country ?? "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Education:</span>{" "}
              {lead.education_level ?? "—"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Budget:</span>{" "}
              {lead.budget ? `$${lead.budget}` : "—"}
            </p>
            {lead.message && (
              <p className="text-sm">
                <span className="text-muted-foreground">Message:</span> {lead.message}
              </p>
            )}
          </div>
        </Card>

        <LeadActions
          leadId={lead.id}
          currentStatus={lead.status}
          assignedCounselorId={lead.assigned_counselor_id}
          isConverted={lead.status === "converted_to_student" || !!lead.converted_student_id}
          counselors={counselorOptions}
          studentProfiles={profileOptions}
        />
      </div>

      <Card>
        <div className="p-6">
          <LeadNotesSection
            leadId={lead.id}
            notes={(notes as Note[]) ?? []}
            authorNames={authorNames}
          />
        </div>
      </Card>
    </div>
  );
}
