import { Button } from "antd";
import Link from "next/link";

interface AdminPageActionsProps {
  href: string;
  label?: string;
}

export function AdminPageActions({
  href,
  label = "Add new",
}: AdminPageActionsProps) {
  return (
    <Link href={href}>
          <Button>{label}</Button>
        </Link>
  );
}
