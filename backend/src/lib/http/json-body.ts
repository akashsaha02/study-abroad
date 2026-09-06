/** Parse JSON request body (API routes). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function jsonBody(request: Request): Promise<any> {
  return request.json();
}
