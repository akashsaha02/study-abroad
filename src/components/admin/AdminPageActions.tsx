import { Button } from "antd";
import Link from "next/link";

interface AdminPageActionsProps {
  href?: string;
  label?: string;
  onClick?: () => void;
}

export function AdminPageActions({
  href,
  label = "Add new",
  onClick,
}: AdminPageActionsProps) {
  if (onClick) {
    return <Button onClick={onClick}>{label}</Button>;
  }

  if (!href) return null;

  return (
    <Link href={href}>
      <Button>{label}</Button>
    </Link>
  );
}
