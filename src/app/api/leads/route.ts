import { createLead } from "@/lib/services/leads";
import { contactSchema } from "@/lib/validations/leads";
import { sendNewLeadEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const lead = await createLead({
      ...parsed.data,
      email: parsed.data.email || undefined,
      source: body.source ?? "contact_form",
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    await sendNewLeadEmail(lead);

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
