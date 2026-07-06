import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { POPULAR_COUNTRIES } from "@/constants";
import { getPublishedCountries } from "@/lib/services/content";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with Abroadly counselors for free study abroad consultation.",
  path: "/contact",
});

export default async function ContactPage() {
  const published = await getPublishedCountries();
  const countries =
    published.length > 0
      ? published.map((c) => ({ id: c.id, name: c.name }))
      : POPULAR_COUNTRIES.map((c, i) => ({ id: String(i), name: c.name }));

  return (
    <Container className="py-12">
      <PageHeader
        title="Contact Us"
        description="Book a free consultation or send us a message. We typically respond within 24 hours."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <ContactForm countries={countries} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Office</h3>
            <p className="mt-2 text-sm text-muted-foreground">Dhaka, Bangladesh</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone / WhatsApp</h3>
            <p className="mt-2 text-sm text-muted-foreground">+880 1XXX-XXXXXX</p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground">info@abroadly.com</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
