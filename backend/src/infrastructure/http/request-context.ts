import { AsyncLocalStorage } from "node:async_hooks";
import type { Request, Response } from "express";

type RequestContext = {
  req: Request;
  res: Response;
};

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(
  req: Request,
  res: Response,
  fn: () => T
): T {
  return storage.run({ req, res }, fn);
}

export function getRequestContext(): RequestContext {
  const ctx = storage.getStore();
  if (!ctx) {
    throw new Error("Request context is not available");
  }
  return ctx;
}

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: () => void
) {
  runWithRequestContext(req, res, () => next());
}
