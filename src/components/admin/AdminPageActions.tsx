import { Button } from "@/components/ui/button";
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
    <Button asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
