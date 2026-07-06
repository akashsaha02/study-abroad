"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME, NAV_LINKS, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "../common/Container";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href={ROUTES.home} className="text-xl font-bold text-primary">
            {APP_NAME}
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.register}>Register</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.eligibilityChecker}>Check Eligibility</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.contact}>Book Consultation</Link>
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <HugeiconsIcon icon={Menu01Icon} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{APP_NAME}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="outline" asChild className="mt-4">
                  <Link href={ROUTES.login} onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={ROUTES.register} onClick={() => setOpen(false)}>
                    Register
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.contact} onClick={() => setOpen(false)}>
                    Book Consultation
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
