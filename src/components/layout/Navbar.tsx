"use client";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ROUTES } from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/actions";
import { getInitials, type NavbarUser } from "@/lib/auth/nav-user";
import { cn } from "@/lib/utils";
import {
  ArrowDown01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  Calculator01Icon,
  Calendar01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  Menu01Icon,
  Message01Icon,
  StarIcon,
  UniversityIcon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Avatar, Button, Drawer, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Container } from "../common/Container";

interface NavChild {
  href: string;
  labelKey: keyof IntlMessages["nav"];
  descKey: keyof IntlMessages["nav"];
  icon: IconSvgElement;
}

interface NavGroup {
  labelKey: keyof IntlMessages["nav"];
  children: NavChild[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: "explore",
    children: [
      {
        href: ROUTES.universities,
        labelKey: "universities",
        descKey: "universitiesDesc",
        icon: UniversityIcon,
      },
      {
        href: ROUTES.courses,
        labelKey: "courses",
        descKey: "coursesDesc",
        icon: BookOpen01Icon,
      },
      {
        href: ROUTES.compare,
        labelKey: "compare",
        descKey: "compareDesc",
        icon: Globe02Icon,
      },
      {
        href: ROUTES.scholarships,
        labelKey: "scholarships",
        descKey: "scholarshipsDesc",
        icon: StarIcon,
      },
    ],
  },
  {
    labelKey: "prepare",
    children: [
      {
        href: ROUTES.ielts,
        labelKey: "ielts",
        descKey: "ieltsDesc",
        icon: FileValidationIcon,
      },
      {
        href: ROUTES.eligibilityChecker,
        labelKey: "eligibilityChecker",
        descKey: "eligibilityCheckerDesc",
        icon: UserAccountIcon,
      },
      {
        href: ROUTES.costCalculator,
        labelKey: "costCalculator",
        descKey: "costCalculatorDesc",
        icon: Calculator01Icon,
      },
    ],
  },
  {
    labelKey: "company",
    children: [
      {
        href: ROUTES.services,
        labelKey: "services",
        descKey: "servicesDesc",
        icon: Briefcase01Icon,
      },
      {
        href: ROUTES.blog,
        labelKey: "blog",
        descKey: "blogDesc",
        icon: BookOpen01Icon,
      },
      {
        href: ROUTES.about,
        labelKey: "about",
        descKey: "aboutDesc",
        icon: Message01Icon,
      },
      {
        href: ROUTES.contact,
        labelKey: "contact",
        descKey: "contactDesc",
        icon: Calendar01Icon,
      },
    ],
  },
];

export function Navbar({ user }: { user?: NavbarUser | null }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openGroup(label: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveGroup(label);
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveGroup(null), 150);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-background/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-background/90 backdrop-blur-sm"
      )}
    >
      <Container>
        <div className="flex h-[4.25rem] items-center gap-6">
          <Link
            href={ROUTES.home}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {tCommon("appName")}
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            <NavItemLink
              href={ROUTES.studyIn("uk")}
              label={t("studyAbroad")}
              active={pathname.startsWith("/study-in")}
            />
            {NAV_GROUPS.map((group) => (
              <NavDropdown
                key={group.labelKey}
                group={group}
                pathname={pathname}
                open={activeGroup === group.labelKey}
                onOpen={() => openGroup(group.labelKey)}
                onClose={scheduleClose}
              />
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <LanguageSwitcher />
              {user ? (
                <NavbarUserMenu user={user} />
              ) : (
                <Link href={ROUTES.login}>
                  <Button type="text">{t("signIn")}</Button>
                </Link>
              )}
              <Link href={ROUTES.contact}>
                <Button type="primary">{t("bookConsultation")}</Button>
              </Link>
            </div>
            <div className="lg:hidden">
              <MobileNav open={open} setOpen={setOpen} pathname={pathname} user={user} />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

function NavItemLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      {label}
      {active && (
        <span className="absolute inset-x-3.5 -bottom-[1.125rem] h-0.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}

function NavDropdown({
  group,
  pathname,
  open,
  onOpen,
  onClose,
}: {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const hasActive = group.children.some((c) => pathname.startsWith(c.href));

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
          open || hasActive
            ? "bg-muted/70 text-foreground"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        {t(group.labelKey)}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 pt-1 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-popover p-2 shadow-xl">
          <div className="grid gap-0.5">
            {group.children.map((child) => {
              const active = pathname.startsWith(child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    active
                      ? "bg-primary/8 text-foreground"
                      : "hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-primary"
                    )}
                  >
                    <HugeiconsIcon icon={child.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-semibold leading-tight">
                      {t(child.labelKey)}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {t(child.descKey)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavbarUserMenu({ user }: { user: NavbarUser }) {
  const t = useTranslations("nav");

  const items: MenuProps["items"] = [
    {
      key: "dashboard",
      label: (
        <Link href={user.dashboardHref} className="block">
          {t("myDashboard")}
        </Link>
      ),
    },
    ...(user.role === "student"
      ? [
          {
            key: "profile",
            label: (
              <Link href={ROUTES.dashboardProfile} className="block">
                {t("myProfile")}
              </Link>
            ),
          },
        ]
      : []),
    { type: "divider" as const },
    {
      key: "signout",
      label: (
        <form action={signOut}>
          <button type="submit" className="w-full text-left">
            {t("signOut")}
          </button>
        </form>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button
        type="button"
        className="rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={user.name}
      >
        <Avatar
          size={36}
          src={user.avatarUrl ?? undefined}
          className="border border-border bg-primary/10 font-semibold text-primary"
        >
          {getInitials(user.name)}
        </Avatar>
      </button>
    </Dropdown>
  );
}

function MobileNav({
  open,
  setOpen,
  pathname,
  user,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  pathname: string;
  user?: NavbarUser | null;
}) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <>
      <Button
        type="text"
        icon={<HugeiconsIcon icon={Menu01Icon} className="size-5" />}
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
      />
      <Drawer
        title={
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-4" />
            </span>
            <span className="font-semibold">{tCommon("appName")}</span>
          </span>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        size={340}
        classNames={{ body: "px-4" }}
        footer={
          <div className="flex flex-col gap-2">
            {user && (
              <div className="mb-1 flex items-center gap-3 rounded-xl border bg-muted/30 px-3 py-2.5">
                <Avatar
                  size={40}
                  src={user.avatarUrl ?? undefined}
                  className="border border-border bg-primary/10 font-semibold text-primary"
                >
                  {getInitials(user.name)}
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <Link
                    href={user.dashboardHref}
                    onClick={() => setOpen(false)}
                    className="text-xs text-primary hover:underline"
                  >
                    {t("myDashboard")}
                  </Link>
                </div>
              </div>
            )}
            <LanguageSwitcher className="w-full justify-center" />
            {user ? (
              <>
                {user.role === "student" && (
                  <Link
                    href={ROUTES.dashboardProfile}
                    onClick={() => setOpen(false)}
                    className="block"
                  >
                    <Button block>{t("myProfile")}</Button>
                  </Link>
                )}
                <form action={signOut}>
                  <Button block htmlType="submit">
                    {t("signOut")}
                  </Button>
                </form>
              </>
            ) : (
              <Link href={ROUTES.login} onClick={() => setOpen(false)} className="block">
                <Button block>{t("signIn")}</Button>
              </Link>
            )}
            <Link href={ROUTES.contact} onClick={() => setOpen(false)} className="block">
              <Button type="primary" block>
                {t("bookConsultation")}
              </Button>
            </Link>
          </div>
        }
      >
        <nav className="space-y-6 pb-4">
          <Link
            href={ROUTES.studyIn("uk")}
            onClick={() => setOpen(false)}
            className={cn(
              "block rounded-xl px-3 py-2.5 text-sm font-semibold",
              pathname.startsWith("/study-in")
                ? "bg-primary/8 text-primary"
                : "hover:bg-muted"
            )}
          >
            {t("studyAbroad")}
          </Link>
          {NAV_GROUPS.map((group) => (
            <div key={group.labelKey}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(group.labelKey)}
              </p>
              <div className="space-y-0.5">
                {group.children.map((child) => {
                  const active = pathname.startsWith(child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-primary/8 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <HugeiconsIcon
                        icon={child.icon}
                        className={cn("size-4", active ? "text-primary" : "text-primary/70")}
                      />
                      {t(child.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </Drawer>
    </>
  );
}
