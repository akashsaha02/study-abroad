import type { MetadataRoute } from "next";
import { POPULAR_COUNTRIES, SERVICES } from "@/constants";
import { getPublishedBlogPosts, getPublishedCountries, getPublishedUniversities } from "@/lib/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/universities",
    "/courses",
    "/scholarships",
    "/blog",
    "/services",
    "/eligibility-checker",
    "/cost-calculator",
    "/compare",
    "/ielts",
    "/ielts/mock-test",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const [countries, universities, posts] = await Promise.all([
    getPublishedCountries(),
    getPublishedUniversities(),
    getPublishedBlogPosts(),
  ]);

  const countryRoutes = (countries.length ? countries : POPULAR_COUNTRIES).map((c) => ({
    url: `${baseUrl}/study-in/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const universityRoutes = universities.map((u) => ({
    url: `${baseUrl}/universities/${u.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...countryRoutes, ...universityRoutes, ...serviceRoutes, ...blogRoutes];
}
