import { Link } from "@/i18n/navigation";
import { Button, Empty } from "antd";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Empty
      image={icon ?? Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="space-y-3">
          <div>
            <p className="font-medium">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actionLabel && actionHref && (
            <Link href={actionHref}>
              <Button type="primary">{actionLabel}</Button>
            </Link>
          )}
        </div>
      }
    />
  );
}
