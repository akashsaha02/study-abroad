import { resolveLeadContextFromSlugs } from "@/lib/leads/context";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const context = await resolveLeadContextFromSlugs({
    university: searchParams.get("university"),
    course: searchParams.get("course"),
    service: searchParams.get("service"),
    country: searchParams.get("country"),
    message: searchParams.get("message"),
  });
  return NextResponse.json(context);
}
