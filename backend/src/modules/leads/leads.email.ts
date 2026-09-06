import { isEmailConfigured, sendMail } from "@/infrastructure/email/resend";
import { escapeHtml } from "@abroadly/shared/html";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@abroadly.com";

export async function sendNewLeadEmail(lead: {
  name: string;
  email?: string | null;
  phone: string;
  preferred_country?: string | null;
  source?: string;
  message?: string | null;
}) {
  if (!isEmailConfigured()) {
    console.log("Resend not configured, skipping email for lead:", lead.name);
    return;
  }

  await sendMail(
    ADMIN_EMAIL,
    `New Lead: ${lead.name}`,
    `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email ?? "N/A")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
      <p><strong>Country:</strong> ${escapeHtml(lead.preferred_country ?? "N/A")}</p>
      <p><strong>Source:</strong> ${escapeHtml(lead.source ?? "website")}</p>
      <p><strong>Message:</strong> ${escapeHtml(lead.message ?? "N/A")}</p>
    `
  );
}
