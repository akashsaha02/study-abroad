import { PageHeader } from "@/components/common/PageHeader";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, ApplicationStep } from "@/types";
import { notFound } from "next/navigation";
import { ApplicationStepsSection } from "./ApplicationStepsSection";
import { ApplicationStatusForm } from "./status-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("applications")
    .select("*, students(profiles(full_name, email)), universities(name), countries(name), courses(title)")
    .eq("id", id)
    .single();

  if (!app) notFound();

  const { data: steps } = await supabase
    .from("application_steps")
    .select("*")
    .eq("application_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <PageHeader
        title={(app.universities as { name?: string })?.name ?? "Application"}
        description={`${(app.countries as { name?: string })?.name} · ${(app.courses as { title?: string })?.title ?? ""}`}
      >
        <StatusBadge status={app.status} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Student</h3>
            <p className="mt-2">
              {(app.students as { profiles?: { full_name?: string; email?: string } })?.profiles
                ?.full_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {(app.students as { profiles?: { email?: string } })?.profiles?.email}
            </p>
          </CardContent>
        </Card>
        <ApplicationStatusForm applicationId={app.id} currentStatus={app.status} />
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Progress Timeline</h3>
          <ApplicationTimeline currentStatus={app.status as ApplicationStatus} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <ApplicationStepsSection
            applicationId={app.id}
            steps={(steps as ApplicationStep[]) ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
