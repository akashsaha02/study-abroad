import { z } from "zod";
import { createClient } from "@/infrastructure/supabase/client";
import { getUser } from "@/modules/identity";
import { createLead } from "@/modules/leads";
import { getStudentByProfileIdForOrder } from "@/modules/students";
import { AppError, NotFoundError, ValidationError } from "@/shared/http/errors";

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

export async function createServiceOrder(body: unknown) {
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", parsed.data.service_id)
    .eq("is_published", true)
    .maybeSingle();

  if (!service) {
    throw new NotFoundError("Service not found");
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
      throw new ValidationError("Name and phone are required for guest orders");
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
      throw new AppError("Failed to create order", 500);
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

  if (error) throw new AppError(error.message, 500);

  return { success: true, id: order.id, unit_price: unitPrice };
}
