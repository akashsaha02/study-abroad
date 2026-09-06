"use client";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { RoleBadge } from "@/components/common/RoleBadge";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "@/features/auth/actions";
import { getInitials } from "@/features/auth/nav-user";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { GraduationScrollIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, Button } from "antd";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  section?: string;
  badgeCount?: number;
}

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
  profileHref: string;
  userName?: string;
  userRole?: UserRole;
  avatarUrl?: string | null;
}

function withSectionFlags(items: NavItem[]) {
  const seen = new Set<string>();
  return items.map((item) => {
    const showSection = Boolean(item.section && !seen.has(item.section));
    if (item.section) seen.add(item.section);
    return { item, showSection };
  });
}

function resolveHomeHref(navItems: NavItem[], pathname: string): string {
  if (pathname.startsWith("/admin")) return "/admin";
  if (pathname.startsWith("/counselor")) return "/counselor";
  if (pathname.startsWith("/dashboard")) return "/dashboard";
  return navItems[0]?.href ?? "/";
}

function NavLinks({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  const navEntries = withSectionFlags(items);

  return (
    <nav className="space-y-0.5">
      {navEntries.map(({ item, showSection }) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" &&
            item.href !== "/dashboard" &&
            item.href !== "/counselor" &&
            pathname.startsWith(item.href + "/"));

        return (
          <div key={item.href}>
            {showSection && (
              <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
                {item.section}
              </p>
            )}
            <Link
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="flex-1 truncate">{item.label}</span>
              {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
                  {item.badgeCount > 99 ? "99+" : item.badgeCount}
                </span>
              ) : null}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  children,
  title,
  navItems,
  profileHref,
  userName,
  userRole,
  avatarUrl,
}: DashboardShellProps) {
  const pathname = usePathname();
  const t = useTranslations("common");
  const tDash = useTranslations("dashboard");
  const isProfileActive = pathname === profileHref;
  const homeHref = useMemo(
    () => resolveHomeHref(navItems, pathname),
    [navItems, pathname]
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="glass-strong sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r sm:w-64">
        <div className="flex h-16 shrink-0 items-center border-b px-4 sm:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
            </span>
            <span className="truncate">Abroadly</span>
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <NavLinks items={navItems} pathname={pathname} />
        </div>

        {userName && (
          <div className="shrink-0 space-y-2 border-t p-3">
            <Link
              href={profileHref}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted",
                isProfileActive && "bg-primary/10"
              )}
            >
              <Avatar
                size={40}
                src={avatarUrl ?? undefined}
                className="shrink-0 border border-border bg-primary/10 text-xs font-semibold text-primary"
              >
                {getInitials(userName)}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{userName}</p>
                {userRole && (
                  <div className="mt-1">
                    <RoleBadge role={userRole} />
                  </div>
                )}
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {tDash("editProfile")}
                </p>
              </div>
            </Link>
            <form action={signOut}>
              <Button block size="small" htmlType="submit">
                {t("signOut")}
              </Button>
            </form>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-strong sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <DashboardBreadcrumb
              title={title}
              navItems={navItems}
              homeHref={homeHref}
            />
          </div>
          <LanguageSwitcher />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
