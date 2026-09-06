import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { createLead } from "@/lib/services/leads";
import { getStudentByProfileIdForOrder } from "@/lib/services/students";
import { z } from "zod";
import { NextResponse } from "@/lib/http/response";

const orderSchema = z.object({
  service_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).default(1),
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).optional(),
  notes: z.string().optional(),
});

function finalPrice(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("id", parsed.data.service_id)
      .eq("is_published", true)
      .maybeSingle();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const user = await getUser();
    let studentId: string | null = null;
    let leadId: string | null = null;

    if (user) {
      const student = await getStudentByProfileIdForOrder(user.id);
      studentId = student?.id ?? null;
    }

    if (!studentId) {
      const name = parsed.data.name ?? user?.profile?.full_name;
      const phone = parsed.data.phone ?? user?.profile?.phone;
      const email = parsed.data.email || user?.profile?.email || undefined;

      if (!name || !phone) {
        return NextResponse.json(
          { error: "Name and phone are required for guest orders" },
          { status: 400 }
        );
      }

      const lead = await createLead({
        name,
        phone,
        email,
        message: parsed.data.notes,
        service_slug: service.slug,
        source: "service_order",
      });
      if (!lead) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
      }
      leadId = lead.id;
    }

    const unitPrice = finalPrice(Number(service.price), Number(service.discount_percent));
    const discountApplied =
      Math.round((Number(service.price) - unitPrice) * parsed.data.quantity * 100) / 100;

    const { data: order, error } = await supabase
      .from("service_orders")
      .insert({
        service_id: service.id,
        lead_id: leadId,
        student_id: studentId,
        quantity: parsed.data.quantity,
        unit_price: unitPrice,
        discount_applied: discountApplied,
        notes: parsed.data.notes ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: order.id, unit_price: unitPrice });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
