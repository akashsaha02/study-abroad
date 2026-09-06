import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Abroadly <onboarding@resend.dev>";

export function isEmailConfigured() {
  return Boolean(resend);
}

export async function sendMail(to: string, subject: string, html: string) {
  if (!resend) return;
  await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}
