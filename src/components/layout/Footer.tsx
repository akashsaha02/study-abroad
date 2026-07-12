import { Button } from "@/components/ui/button";
import { APP_NAME, POPULAR_COUNTRIES, ROUTES } from "@/constants";
import {
  ArrowRight01Icon,
  GraduationScrollIcon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Container } from "../common/Container";

const EXPLORE_LINKS = [
  { href: ROUTES.universities, label: "Universities" },
  { href: ROUTES.courses, label: "Courses" },
  { href: ROUTES.compare, label: "Compare" },
  { href: ROUTES.scholarships, label: "Scholarships" },
];

const PREPARE_LINKS = [
  { href: ROUTES.ielts, label: "IELTS Prep" },
  { href: ROUTES.eligibilityChecker, label: "Eligibility Checker" },
  { href: ROUTES.costCalculator, label: "Cost Calculator" },
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.blog, label: "Blog" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter band */}
      <Container className="py-12">
        <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 ring-1 ring-foreground/5 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-md">
            <h3 className="text-xl font-bold tracking-tight">
              Get study abroad tips in your inbox
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Scholarship alerts, application deadlines, and country guides — no
              spam, unsubscribe anytime.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@email.com"
              className="h-10 flex-1 rounded-4xl border border-input bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Button type="submit" className="shrink-0">
              Subscribe
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4"
                data-icon="inline-end"
              />
            </Button>
          </form>
        </div>
      </Container>

      <Container className="pb-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link
              href={ROUTES.home}
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
              </span>
              {APP_NAME}
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Expert study abroad guidance from university selection to visa
              approval — all in one place.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="size-4 text-primary" />
                info@abroadly.com
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  className="size-4 text-primary"
                />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="size-4 text-primary"
                />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Prepare" links={PREPARE_LINKS} />

          <div>
            <h4 className="mb-4 text-sm font-semibold">Destinations</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {POPULAR_COUNTRIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={ROUTES.studyIn(c.slug)}
                    className="transition-colors hover:text-primary"
                  >
                    <span aria-hidden>{c.flag}</span> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href={ROUTES.login} className="hover:text-primary">
              Student Login
            </Link>
            <Link href={ROUTES.register} className="hover:text-primary">
              Register
            </Link>
            <Link href={ROUTES.contact} className="hover:text-primary">
              Contact
            </Link>
            <Link href={ROUTES.about} className="hover:text-primary">
              About
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
