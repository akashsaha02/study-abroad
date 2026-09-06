import { sendMail } from "@/infrastructure/email/resend";
import { escapeHtml } from "@abroadly/shared/html";

export async function sendApplicationStatusEmail(
  to: string,
  status: string,
  note?: string
) {
  const label = status.replace(/_/g, " ");
  await sendMail(
    to,
    `Application Status: ${label}`,
    `
      <h2>Application Status Update</h2>
      <p>Your application status has been updated to <strong>${escapeHtml(label)}</strong>.</p>
      ${note ? `<p><strong>Note:</strong> ${escapeHtml(note)}</p>` : ""}
    `
  );
}
