"use client";

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
    <div>
      <Link
        href={backHref}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </Link>
      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={backHref}>Cancel</Link>
          </Button>
          <SubmitButton form={formId} loading={saving}>
            Save
          </SubmitButton>
        </div>
      </div>
      {children}
    </div>
  );
}
