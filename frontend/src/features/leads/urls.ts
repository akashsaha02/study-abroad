export function buildLeadContextUrl(
  basePath: string,
  params: {
    university?: string;
    course?: string;
    service?: string;
    country?: string;
    message?: string;
  }
): string {
  const search = new URLSearchParams();
  if (params.university) search.set("university", params.university);
  if (params.course) search.set("course", params.course);
  if (params.service) search.set("service", params.service);
  if (params.country) search.set("country", params.country);
  if (params.message) search.set("message", params.message);
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
