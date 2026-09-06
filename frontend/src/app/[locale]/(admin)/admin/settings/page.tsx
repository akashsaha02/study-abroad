import { SettingsTabs } from "@/components/admin/SettingsTabs";
import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { getUser } from "@/infrastructure/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { CostSetting, EligibilityRule } from "@/types";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const user = await getUser();

  const [{ data: costSettings }, { data: eligibilityRules }, { data: countries }] =
    await Promise.all([
      supabase.from("cost_settings").select("*").order("country"),
      supabase.from("eligibility_rules").select("*").order("country"),
      supabase.from("countries").select("id, name").order("name"),
    ]);

  return (
    <PageStack>
      <PageHeader
        compact
        title="Settings"
        description="Cost calculator and eligibility checker configuration."
      />
      <SettingsTabs
        costSettings={(costSettings as CostSetting[]) ?? []}
        eligibilityRules={(eligibilityRules as EligibilityRule[]) ?? []}
        countries={countries ?? []}
        isSuperAdmin={user?.profile?.role === "super_admin"}
      />
    </PageStack>
  );
}
