import { APP_NAME, POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight01Icon,
  GraduationScrollIcon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";
import { getTranslations } from "next-intl/server";
import { Container } from "../common/Container";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tAuth = await getTranslations("auth");

  const exploreLinks = [
    { href: ROUTES.universities, label: tNav("universities") },
    { href: ROUTES.courses, label: tNav("courses") },
    { href: ROUTES.compare, label: tNav("compare") },
    { href: ROUTES.scholarships, label: tNav("scholarships") },
  ];

  const prepareLinks = [
    { href: ROUTES.ielts, label: tNav("ielts") },
    { href: ROUTES.eligibilityChecker, label: tNav("eligibilityChecker") },
    { href: ROUTES.costCalculator, label: tNav("costCalculator") },
    { href: ROUTES.services, label: tNav("services") },
    { href: ROUTES.blog, label: tNav("blog") },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12">
        <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 ring-1 ring-foreground/5 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-md">
            <h3 className="text-xl font-bold tracking-tight">{t("newsletterTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("newsletterDesc")}</p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              {tAuth("email")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="h-10 flex-1 rounded-4xl border border-input bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Button type="primary" htmlType="submit" className="shrink-0">
              {t("subscribe")}
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
            <p className="max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
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

          <FooterColumn title={t("explore")} links={exploreLinks} />
          <FooterColumn title={t("prepare")} links={prepareLinks} />

          <div>
            <h4 className="mb-4 text-sm font-semibold">{t("destinations")}</h4>
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
            © {new Date().getFullYear()} {APP_NAME}. {t("rights")}
          </p>
          <div className="flex gap-4">
            <Link href={ROUTES.login} className="hover:text-primary">
              {t("studentLogin")}
            </Link>
            <Link href={ROUTES.register} className="hover:text-primary">
              {t("register")}
            </Link>
            <Link href={ROUTES.contact} className="hover:text-primary">
              {t("contact")}
            </Link>
            <Link href={ROUTES.about} className="hover:text-primary">
              {t("about")}
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
