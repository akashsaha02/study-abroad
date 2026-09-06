import type { Request, Response } from "express";
import { parseNewsletter, subscribe } from "@/modules/newsletter/newsletter.service";

export async function subscribeNewsletter(req: Request, res: Response) {
  const parsed = parseNewsletter(req.body);
  const result = await subscribe(parsed.email);
  res.status(200).json(result);
}
