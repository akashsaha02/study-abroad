export class AppError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.body = body ?? { error: message };
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

function zodMessage(payload: unknown, fallback = "Invalid input"): string {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object" && "issues" in payload) {
    const issues = (payload as { issues?: { message?: string }[] }).issues;
    if (issues?.[0]?.message) return issues[0].message;
  }
  return fallback;
}

export class ValidationError extends AppError {
  constructor(payload: unknown) {
    const message = zodMessage(payload);
    super(message, 400, { error: message });
    this.name = "ValidationError";
  }
}
