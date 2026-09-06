import { createClient } from "@/lib/supabase/server";
import { jsonResponse } from "@/lib/http/response";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return jsonResponse({ success: true });
}
