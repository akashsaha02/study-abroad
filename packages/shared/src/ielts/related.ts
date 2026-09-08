/** PostgREST nested selects may be an object or a one-element array. */
export function relatedOne<T>(rel: T | T[] | null | undefined): T | null {
  if (rel == null) return null;
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}

export function isAttemptExpired(expiresAt: string | null | undefined, now = Date.now()) {
  return Boolean(expiresAt && new Date(expiresAt).getTime() < now);
}
