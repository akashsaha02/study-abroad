"use client";

import { Button } from "antd";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Link } from "@/i18n/navigation";
import type { AdminFormVariant } from "@/lib/admin/form-utils";

interface AdminFormShellProps {
  title: string;
  backHref: string;
  formId: string;
  saving?: boolean;
  variant?: AdminFormVariant;
  children: React.ReactNode;
}

export function AdminFormShell({
  title,
  backHref,
  formId,
  saving,
  variant = "page",
  children,
}: AdminFormShellProps) {
  if (variant === "modal") {
    return <>{children}</>;
  }

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
          <Link href={backHref}>
            <Button>Cancel</Button>
          </Link>
          <SubmitButton form={formId} loading={saving}>
            Save
          </SubmitButton>
        </div>
      </PageHeader>
      <PanelCard>{children}</PanelCard>
    </div>
  );
}
