"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/components/layout/DashboardShell";
import { Breadcrumb } from "antd";
import { useMemo } from "react";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function humanize(segment: string): string {
  if (UUID_RE.test(segment)) return "Details";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface DashboardBreadcrumbProps {
  title: string;
  navItems: NavItem[];
  homeHref: string;
}

export function DashboardBreadcrumb({
  title,
  navItems,
  homeHref,
}: DashboardBreadcrumbProps) {
  const pathname = usePathname();

  const items = useMemo(() => {
    const labelByHref = new Map(navItems.map((item) => [item.href, item.label]));
    const crumbs: { title: React.ReactNode; href?: string }[] = [
      {
        title: <Link href={homeHref}>{title}</Link>,
      },
    ];

    if (pathname === homeHref) {
      return [{ title: labelByHref.get(homeHref) ?? "Overview" }];
    }

    // Prefer longest matching nav item as the section crumb
    const matched = [...navItems]
      .filter(
        (item) =>
          item.href !== homeHref &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`))
      )
      .sort((a, b) => b.href.length - a.href.length)[0];

    if (matched) {
      const isExact = pathname === matched.href;
      crumbs.push({
        title: isExact ? (
          matched.label
        ) : (
          <Link href={matched.href}>{matched.label}</Link>
        ),
      });

      if (!isExact) {
        const rest = pathname.slice(matched.href.length).split("/").filter(Boolean);
        for (const segment of rest) {
          crumbs.push({ title: humanize(segment) });
        }
      }
    } else {
      const segments = pathname.split("/").filter(Boolean);
      // Skip role root (admin|dashboard|counselor|account)
      const rest = segments.slice(1);
      let accumulated = `/${segments[0] ?? ""}`;
      for (const segment of rest) {
        accumulated += `/${segment}`;
        const label = labelByHref.get(accumulated) ?? humanize(segment);
        const isLast = accumulated === pathname;
        crumbs.push({
          title: isLast ? label : <Link href={accumulated}>{label}</Link>,
        });
      }
    }

    return crumbs.map(({ title: crumbTitle }) => ({ title: crumbTitle }));
  }, [homeHref, navItems, pathname, title]);

  return (
    <Breadcrumb
      className="min-w-0 text-sm"
      items={items}
      separator="/"
    />
  );
}
