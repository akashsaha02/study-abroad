import { UsersAdminPanel } from "@/components/admin/UsersAdminPanel";
import { requireRole } from "@/infrastructure/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminUsersPage() {
  await requireRole(["super_admin"]);

  const t = await getTranslations("adminPages.users");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const profiles = (data as Profile[]) ?? [];

  const records = profiles.map((r) => ({
    id: r.id,
    name: r.full_name ?? "—",
    email: r.email ?? "—",
    role: r.role,
    isActive: r.is_active,
    phone: r.phone,
  }));

  const rows = profiles.map((r) => ({
    id: r.id,
    name: r.full_name ?? "—",
    email: r.email ?? "—",
    role: r.role,
    is_active: String(r.is_active),
    currentRole: r.role,
    isActive: r.is_active,
    created_at: r.created_at,
  }));

  return (
    <UsersAdminPanel
      title={t("title")}
      description={t("description")}
      emptyText={t("empty")}
      dateLocale={dateLocale}
      labels={{
        name: t("columns.name"),
        email: t("columns.email"),
        role: t("columns.role"),
        active: t("columns.active"),
        created: t("columns.created"),
        actions: t("columns.actions"),
        yes: tCommon("yes"),
        no: tCommon("no"),
      }}
      rows={rows}
      records={records}
    />
  );
}
