"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ResourceRowActionsProps {
  id: string;
  apiPath: string;
  editHref: string;
  isPublished: boolean;
  itemName: string;
}

export function ResourceRowActions({
  id,
  apiPath,
  editHref,
  isPublished,
  itemName,
}: ResourceRowActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={editHref}>Edit</Link>
      </Button>
      <PublishToggle apiUrl={`${apiPath}/${id}`} isPublished={isPublished} />
      <AdminDeleteButton apiUrl={`${apiPath}/${id}`} itemName={itemName} />
    </div>
  );
}
