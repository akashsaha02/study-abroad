import type { Request, Response } from "express";
import { createClient } from "@/infrastructure/supabase/client";

export async function signOut(_req: Request, res: Response) {
  const supabase = createClient();
  await supabase.auth.signOut();
  res.status(200).json({ success: true });
}
