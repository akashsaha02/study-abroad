import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Abroadly <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@abroadly.com";

async function sendMail(to: string, subject: string, html: string) {
  if (!resend) return;
  await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}

export async function sendNewLeadEmail(lead: {
  name: string;
  email?: string | null;
  phone: string;
  preferred_country?: string | null;
  source?: string;
  message?: string | null;
}) {
  if (!resend) {
    console.log("Resend not configured, skipping email for lead:", lead.name);
    return;
  }

  await sendMail(
    ADMIN_EMAIL,
    `New Lead: ${lead.name}`,
    `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email ?? "N/A"}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Country:</strong> ${lead.preferred_country ?? "N/A"}</p>
      <p><strong>Source:</strong> ${lead.source ?? "website"}</p>
      <p><strong>Message:</strong> ${lead.message ?? "N/A"}</p>
    `
  );
}

export async function sendDocumentStatusEmail(
  to: string,
  documentType: string,
  status: string,
  note?: string
) {
  await sendMail(
    to,
    `Document ${status}: ${documentType}`,
    `
      <h2>Document Status Update</h2>
      <p>Your <strong>${documentType}</strong> has been <strong>${status}</strong>.</p>
      ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
    `
  );
}

export async function sendApplicationStatusEmail(
  to: string,
  status: string,
  note?: string
) {
  await sendMail(
    to,
    `Application Status: ${status.replace(/_/g, " ")}`,
    `
      <h2>Application Status Update</h2>
      <p>Your application status has been updated to <strong>${status.replace(/_/g, " ")}</strong>.</p>
      ${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}
    `
  );
}
