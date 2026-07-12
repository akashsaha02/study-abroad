import { APP_NAME, ROUTES } from "@/constants";
import {
  CheckmarkCircle02Icon,
  GraduationScrollIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const BRAND_POINTS = [
  "Personalized program matching",
  "Document vault & application tracking",
  "IELTS prep and mock tests",
  "End-to-end visa support",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col">
        <div className="absolute inset-0 z-0 bg-grid opacity-10" aria-hidden />
        <Image
          src="/images/hero-students.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-20"
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5" />
            </span>
            {APP_NAME}
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Your study abroad journey, all in one place.
            </h2>
            <ul className="mt-8 space-y-3">
              {BRAND_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-5 shrink-0"
                  />
                  <span className="text-primary-foreground/90">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-primary-foreground/70">
            Trusted by 5,000+ students worldwide.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link
            href={ROUTES.home}
            className="mb-8 flex items-center gap-2 text-lg font-bold lg:hidden"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-4" />
            </span>
            {APP_NAME}
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
