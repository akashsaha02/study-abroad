"use client";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { RoleBadge } from "@/components/common/RoleBadge";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import {
  GraduationScrollIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Drawer } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  section?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
  userName?: string;
  userRole?: UserRole;
}

function withSectionFlags(items: NavItem[]) {
  const seen = new Set<string>();
  return items.map((item) => {
    const showSection = Boolean(item.section && !seen.has(item.section));
    if (item.section) seen.add(item.section);
    return { item, showSection };
  });
}

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
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
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
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
  userName,
  userRole,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tNav = useTranslations("nav");
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="flex h-16 items-center border-b px-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
            </span>
            Abroadly
          </Link>
        </div>
        <div className="p-3">
          <NavLinks items={navItems} pathname={pathname} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/70 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              className="lg:hidden"
              icon={<HugeiconsIcon icon={Menu01Icon} className="size-5" />}
              onClick={() => setOpen(true)}
              aria-label={tNav("openMenu")}
            />
            <Drawer
              title={
                <span className="flex items-center gap-2 text-lg font-bold">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <HugeiconsIcon
                      icon={GraduationScrollIcon}
                      className="size-4"
                    />
                  </span>
                  Abroadly
                </span>
              }
              placement="left"
              onClose={() => setOpen(false)}
              open={open}
              width={256}
              className="lg:hidden"
            >
              <NavLinks
                items={navItems}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            </Drawer>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            {userName && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {userName}
              </span>
            )}
            {userRole && <RoleBadge role={userRole} />}
            <form action={signOut}>
              <Button size="small" htmlType="submit">
                {t("signOut")}
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
