import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with Abroadly counselors for free study abroad consultation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-12">
      <PageHeader
        title="Contact Us"
        description="Book a free consultation or send us a message. We typically respond within 24 hours."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <ContactForm />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Office</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Dhaka, Bangladesh
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Phone / WhatsApp</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              +880 1XXX-XXXXXX
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              info@abroadly.com
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
