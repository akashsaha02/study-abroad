import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { getLeadById } from "@/lib/services/leads";
import { notFound } from "next/navigation";
import { LeadActions } from "./lead-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.name}
        description={`Lead from ${lead.source}`}
      >
        <StatusBadge status={lead.status} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="font-semibold">Contact Info</h3>
            <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {lead.phone}</p>
            <p className="text-sm"><span className="text-muted-foreground">Email:</span> {lead.email ?? "—"}</p>
            <p className="text-sm"><span className="text-muted-foreground">Country:</span> {lead.preferred_country ?? "—"}</p>
            <p className="text-sm"><span className="text-muted-foreground">Education:</span> {lead.education_level ?? "—"}</p>
            <p className="text-sm"><span className="text-muted-foreground">Budget:</span> {lead.budget ? `$${lead.budget}` : "—"}</p>
            {lead.message && (
              <p className="text-sm"><span className="text-muted-foreground">Message:</span> {lead.message}</p>
            )}
          </CardContent>
        </Card>

        <LeadActions leadId={lead.id} currentStatus={lead.status} />
      </div>
    </div>
  );
}
