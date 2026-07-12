import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/common/Eyebrow";
import { ROUTES } from "@/constants";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../common/Container";

const HERO_STATS = [
  { value: "98%", label: "Visa success rate" },
  { value: "200+", label: "Partner universities" },
  { value: "15+", label: "Countries" },
];

const HERO_HIGHLIGHTS = [
  "Personalized program matching",
  "End-to-end visa support",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <Container className="py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-fade-in-up">
            <Eyebrow icon={StarIcon}>Trusted by 5,000+ students</Eyebrow>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Study abroad with{" "}
              <span className="relative whitespace-nowrap text-primary">
                confidence
                <span className="absolute inset-x-0 -bottom-1 -z-10 h-3 rounded-full bg-primary/15" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
              Find the right country, university, and scholarship — then let our
              experts guide every step from application to visa approval.
            </p>

            <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-6">
              {HERO_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-5 text-emerald-600 dark:text-emerald-400"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={ROUTES.eligibilityChecker}>
                  Check your eligibility
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4"
                    data-icon="inline-end"
                  />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.contact}>Book free consultation</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-foreground md:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual */}
          <div className="relative animate-fade-in-up lg:justify-self-end">
            <div className="relative mx-auto aspect-4/3 w-full max-w-xl overflow-hidden rounded-3xl border bg-muted shadow-xl ring-1 ring-foreground/5">
              <Image
                src="/images/hero-students.png"
                alt="International students walking together on a university campus"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Floating accolade card */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border bg-card p-4 shadow-lg ring-1 ring-foreground/5 sm:block">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Offer received</p>
                  <p className="text-xs text-muted-foreground">
                    University of Toronto
                  </p>
                </div>
              </div>
            </div>

            {/* Floating rating card */}
            <div className="absolute -right-3 top-6 hidden rounded-2xl border bg-card px-4 py-3 shadow-lg ring-1 ring-foreground/5 md:block">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HugeiconsIcon key={i} icon={StarIcon} className="size-3.5" />
                ))}
              </div>
              <p className="mt-1 text-xs font-medium">4.9/5 from 1,200+ reviews</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
