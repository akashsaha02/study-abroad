export type ApiResponse = {
  status: number;
  body: unknown;
};

export function jsonResponse(
  body: unknown,
  init?: { status?: number }
): ApiResponse {
  return { status: init?.status ?? 200, body };
}

/** Drop-in replacement for NextResponse.json in migrated route handlers. */
export const NextResponse = {
  json: jsonResponse,
};
