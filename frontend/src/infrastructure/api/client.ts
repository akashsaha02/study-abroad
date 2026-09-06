export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function errorMessage(body: unknown, fallback: string) {
  if (typeof body !== "object" || !body || !("error" in body)) return fallback;
  const { error } = body as { error: unknown };
  if (typeof error === "string") return error;
  return fallback;
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, { ...init, headers });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(errorMessage(body, "Request failed"), res.status, body);
  }

  return body as T;
}
