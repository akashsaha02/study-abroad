"use client";

import { Button } from "antd";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { Link } from "@/i18n/navigation";

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
      <Link href={editHref}>
          <Button  size="small">Edit</Button>
        </Link>
      <PublishToggle apiUrl={`${apiPath}/${id}`} isPublished={isPublished} />
      <AdminDeleteButton apiUrl={`${apiPath}/${id}`} itemName={itemName} />
    </div>
  );
}
