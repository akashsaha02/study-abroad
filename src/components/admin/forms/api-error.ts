export function parseApiError(data: unknown, fallback = "Request failed"): string {
  if (typeof data !== "object" || !data || !("error" in data)) {
    return fallback;
  }

  const { error } = data as { error: unknown };
  if (typeof error === "string") return error;
  if (typeof error === "object" && error && "formErrors" in error) {
    return "Validation failed. Check your inputs.";
  }

  return fallback;
}
