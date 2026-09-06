import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/http/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express requires 4 args to treat this as error middleware.
  next: NextFunction
) {
  void next;
  if (err instanceof AppError) {
    res.status(err.status).json(err.body);
    return;
  }

  console.error("API route error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal server error" });
  }
}
