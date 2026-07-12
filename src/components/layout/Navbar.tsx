"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  ArrowRight01Icon,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "../common/Container";

interface NavChild {
  href: string;
  label: string;
  description: string;
  icon: IconSvgElement;
}

interface NavGroup {
  label: string;
  children: NavChild[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Explore",
    children: [
      {
        href: ROUTES.universities,
        label: "Universities",
        description: "Browse partner institutions worldwide",
        icon: UniversityIcon,
      },
      {
        href: ROUTES.courses,
        label: "Courses",
        description: "Browse programs by subject and degree",
        icon: BookOpen01Icon,
      },
      {
        href: ROUTES.compare,
        label: "Compare",
        description: "Weigh universities side-by-side",
        icon: Globe02Icon,
      },
      {
        href: ROUTES.scholarships,
        label: "Scholarships",
        description: "Find funding for your studies",
        icon: StarIcon,
      },
    ],
  },
  {
    label: "Prepare",
    children: [
      {
        href: ROUTES.ielts,
        label: "IELTS Prep",
        description: "Mock tests & band calculator",
        icon: FileValidationIcon,
      },
      {
        href: ROUTES.eligibilityChecker,
        label: "Eligibility Checker",
        description: "See where you qualify",
        icon: UserAccountIcon,
      },
      {
        href: ROUTES.costCalculator,
        label: "Cost Calculator",
        description: "Estimate your total budget",
        icon: Calculator01Icon,
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        href: ROUTES.services,
        label: "Services",
        description: "End-to-end guidance",
        icon: Briefcase01Icon,
      },
      {
        href: ROUTES.blog,
        label: "Blog",
        description: "Guides & student stories",
        icon: BookOpen01Icon,
      },
      {
        href: ROUTES.about,
        label: "About",
        description: "Who we are",
        icon: Message01Icon,
      },
      {
        href: ROUTES.contact,
        label: "Contact",
        description: "Talk to a counselor",
        icon: Calendar01Icon,
      },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
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
    closeTimer.current = window.setTimeout(() => setActiveGroup(null), 120);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/70"
          : "border-b border-transparent bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/50"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
            </span>
            <span>
              {APP_NAME}
              <span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavItemLink
              href={ROUTES.studyIn("uk")}
              label="Study Abroad"
              active={pathname.startsWith("/study-in")}
            />
            {NAV_GROUPS.map((group) => (
              <NavDropdown
                key={group.label}
                group={group}
                pathname={pathname}
                open={activeGroup === group.label}
                onOpen={() => openGroup(group.label)}
                onClose={scheduleClose}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.eligibilityChecker}>Check Eligibility</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={ROUTES.contact}>
                Book Consultation
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4"
                  data-icon="inline-end"
                />
              </Link>
            </Button>
          </div>

          <MobileNav open={open} setOpen={setOpen} pathname={pathname} />
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
        "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
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
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          open || hasActive
            ? "text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {group.label}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className={cn(
            "size-3.5 rotate-90 transition-transform duration-200",
            open && "-rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full w-72 origin-top pt-2 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        )}
      >
        <div className="overflow-hidden rounded-2xl border bg-popover p-2 shadow-lg ring-1 ring-foreground/5">
          {group.children.map((child) => {
            const active = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-2.5 transition-colors",
                  active ? "bg-muted" : "hover:bg-muted/60"
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={child.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {child.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {child.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileNav({
  open,
  setOpen,
  pathname,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  pathname: string;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={Menu01Icon} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[320px] flex-col p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-left">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-4" />
            </span>
            {APP_NAME}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          <Link
            href={ROUTES.studyIn("uk")}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Study Abroad
          </Link>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="mt-1 space-y-0.5">
                {group.children.map((child) => {
                  const active = pathname.startsWith(child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <HugeiconsIcon
                        icon={child.icon}
                        className="size-4 text-primary"
                      />
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t p-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href={ROUTES.login} onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </Button>
          <Button className="w-full" asChild>
            <Link href={ROUTES.contact} onClick={() => setOpen(false)}>
              Book Consultation
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
