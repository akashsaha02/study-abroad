import { CountryForm } from "@/components/admin/forms/CountryForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditCountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("*").eq("id", id).single();

  if (!data) notFound();

  return <CountryForm initial={data} />;
}
