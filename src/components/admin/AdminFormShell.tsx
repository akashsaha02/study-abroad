"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminFormShellProps {
  title: string;
  backHref: string;
  formId: string;
  saving?: boolean;
  children: React.ReactNode;
}

export function AdminFormShell({
  title,
  backHref,
  formId,
  saving,
  children,
}: AdminFormShellProps) {
  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to list
      </Link>
      <PageHeader title={title}>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={backHref}>Cancel</Link>
          </Button>
          <SubmitButton form={formId} loading={saving}>
            Save
          </SubmitButton>
        </div>
      </PageHeader>
      <PanelCard>{children}</PanelCard>
    </div>
  );
}
