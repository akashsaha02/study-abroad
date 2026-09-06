import { sendMail } from "@/infrastructure/email/resend";
import { escapeHtml } from "@abroadly/shared/html";

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
      <p>Your <strong>${escapeHtml(documentType)}</strong> has been <strong>${escapeHtml(status)}</strong>.</p>
      ${note ? `<p><strong>Note:</strong> ${escapeHtml(note)}</p>` : ""}
    `
  );
}
