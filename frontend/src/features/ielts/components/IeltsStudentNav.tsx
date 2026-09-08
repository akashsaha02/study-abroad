"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard/ielts", label: "Overview" },
  { href: "/dashboard/ielts/practice", label: "Practice" },
  { href: "/dashboard/ielts/mock-tests", label: "Mock tests" },
  { href: "/dashboard/ielts/analytics", label: "Analytics" },
];

export function IeltsStudentNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="IELTS preparation"
      className="mb-6 flex flex-wrap gap-1 rounded-lg border bg-card p-1"
    >
      {ITEMS.map((item) => {
        const active =
          item.href === "/dashboard/ielts"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
