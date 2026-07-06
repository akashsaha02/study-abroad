import { SettingsTabs } from "@/components/admin/SettingsTabs";
import { PageHeader } from "@/components/common/PageHeader";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { CostSetting, EligibilityRule } from "@/types";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const user = await getUser();

  const [{ data: costSettings }, { data: eligibilityRules }] = await Promise.all([
    supabase.from("cost_settings").select("*").order("country"),
    supabase.from("eligibility_rules").select("*").order("country"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Cost calculator and eligibility checker configuration."
      />
      <SettingsTabs
        costSettings={(costSettings as CostSetting[]) ?? []}
        eligibilityRules={(eligibilityRules as EligibilityRule[]) ?? []}
        isSuperAdmin={user?.profile?.role === "super_admin"}
      />
    </div>
  );
}
