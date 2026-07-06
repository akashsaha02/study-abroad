import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/services/content";
import { getLeads } from "@/lib/services/leads";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, leads] = await Promise.all([getAdminStats(), getLeads()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        description="Platform statistics and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="New Leads" value={stats.newLeads} />
        <StatCard title="Active Students" value={stats.activeStudents} />
        <StatCard title="Active Applications" value={stats.activeApplications} />
        <StatCard title="Pending Documents" value={stats.pendingDocuments} />
        <StatCard
          title="Consultations"
          value={stats.scheduledConsultations}
          description="Scheduled"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Leads
            <Link href="/admin/leads" className="text-sm font-normal text-primary">
              View all →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
