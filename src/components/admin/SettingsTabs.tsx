"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import type { CostSetting, EligibilityRule } from "@/types";

interface SettingsTabsProps {
  costSettings: CostSetting[];
  eligibilityRules: EligibilityRule[];
  isSuperAdmin: boolean;
}

export function SettingsTabs({
  costSettings,
  eligibilityRules,
  isSuperAdmin,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="cost-settings">
      <TabsList>
        <TabsTrigger value="cost-settings">Cost Settings</TabsTrigger>
        <TabsTrigger value="eligibility-rules">Eligibility Rules</TabsTrigger>
      </TabsList>

      <TabsContent value="cost-settings" className="space-y-4">
        <div className="flex justify-end">
          {isSuperAdmin && (
            <AdminPageActions href="/admin/settings/cost-settings/new" label="Add cost setting" />
          )}
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Country</th>
                <th className="p-3 font-medium">Degree</th>
                <th className="p-3 font-medium">Tuition Range</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {costSettings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No cost settings configured
                  </td>
                </tr>
              ) : (
                costSettings.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-3">{r.country}</td>
                    <td className="p-3">{r.degree_level}</td>
                    <td className="p-3">
                      ${r.tuition_min?.toLocaleString() ?? "—"} – $
                      {r.tuition_max?.toLocaleString() ?? "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/settings/cost-settings/${r.id}/edit`}>Edit</Link>
                        </Button>
                        <AdminDeleteButton
                          apiUrl={`/api/admin/cost-settings/${r.id}`}
                          itemName={`${r.country} ${r.degree_level}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="eligibility-rules" className="space-y-4">
        <div className="flex justify-end">
          <AdminPageActions href="/admin/settings/eligibility-rules/new" label="Add rule" />
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Country</th>
                <th className="p-3 font-medium">Education</th>
                <th className="p-3 font-medium">Min CGPA</th>
                <th className="p-3 font-medium">Min IELTS</th>
                <th className="p-3 font-medium">Active</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eligibilityRules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No eligibility rules configured
                  </td>
                </tr>
              ) : (
                eligibilityRules.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-3">{r.country}</td>
                    <td className="p-3">{r.education_level}</td>
                    <td className="p-3">{r.min_cgpa ?? "—"}</td>
                    <td className="p-3">{r.min_ielts ?? "—"}</td>
                    <td className="p-3">{r.is_active ? "Yes" : "No"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/settings/eligibility-rules/${r.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <AdminDeleteButton
                          apiUrl={`/api/admin/eligibility-rules/${r.id}`}
                          itemName={`${r.country} ${r.education_level}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
