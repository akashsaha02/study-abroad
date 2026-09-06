import { createClient } from "@/lib/supabase/server";

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  assignedCounselorId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.assignedCounselorId) {
    query = query.eq("assigned_counselor_id", filters.assignedCounselorId);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getLeadById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data;
}
