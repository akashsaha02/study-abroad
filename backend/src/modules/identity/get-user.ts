import { createClient } from "@/infrastructure/supabase/client";
import { loadAuthUser } from "@abroadly/shared/auth";
import type { AuthUser } from "@abroadly/shared/types";

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  return loadAuthUser(supabase);
}
