import { APP_NAME, POPULAR_COUNTRIES, ROUTES } from "@/constants";
import Link from "next/link";
import { Container } from "../common/Container";
import { Separator } from "../ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href={ROUTES.home} className="text-xl font-bold text-primary">
              {APP_NAME}
            </Link>
            <p className="text-sm text-muted-foreground">
              Expert study abroad guidance from university selection to visa approval.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Destinations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {POPULAR_COUNTRIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={ROUTES.studyIn(c.slug)}
                    className="hover:text-primary"
                  >
                    {c.flag} Study in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={ROUTES.eligibilityChecker} className="hover:text-primary">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link href={ROUTES.costCalculator} className="hover:text-primary">
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link href={ROUTES.universities} className="hover:text-primary">
                  Universities
                </Link>
              </li>
              <li>
                <Link href={ROUTES.scholarships} className="hover:text-primary">
                  Scholarships
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@abroadly.com</li>
              <li>+880 1XXX-XXXXXX</li>
              <li>
                <Link href={ROUTES.contact} className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href={ROUTES.login} className="hover:text-primary">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href={ROUTES.register} className="hover:text-primary">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
