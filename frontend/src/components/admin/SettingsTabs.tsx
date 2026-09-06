"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { CostSettingForm } from "@/components/admin/forms/CostSettingForm";
import { EligibilityRuleForm } from "@/components/admin/forms/EligibilityRuleForm";
import type { CostSetting, EligibilityRule } from "@/types";
import { Button, Tabs } from "antd";
import { useCallback, useState } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface SettingsTabsProps {
  costSettings: CostSetting[];
  eligibilityRules: EligibilityRule[];
  countries: CountryOption[];
  isSuperAdmin: boolean;
}

export function SettingsTabs({
  costSettings,
  eligibilityRules,
  countries,
  isSuperAdmin,
}: SettingsTabsProps) {
  const [costOpen, setCostOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<CostSetting | undefined>();
  const [costSaving, setCostSaving] = useState(false);

  const [ruleOpen, setRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EligibilityRule | undefined>();
  const [ruleSaving, setRuleSaving] = useState(false);

  const closeCostModal = useCallback(() => {
    setCostOpen(false);
    setEditingCost(undefined);
  }, []);

  const openCostAdd = useCallback(() => {
    setEditingCost(undefined);
    setCostOpen(true);
  }, []);

  const openCostEdit = useCallback((record: CostSetting) => {
    setEditingCost(record);
    setCostOpen(true);
  }, []);

  const closeRuleModal = useCallback(() => {
    setRuleOpen(false);
    setEditingRule(undefined);
  }, []);

  const openRuleAdd = useCallback(() => {
    setEditingRule(undefined);
    setRuleOpen(true);
  }, []);

  const openRuleEdit = useCallback((record: EligibilityRule) => {
    setEditingRule(record);
    setRuleOpen(true);
  }, []);

  return (
    <>
      <Tabs
        defaultActiveKey="cost-settings"
        items={[
          {
            key: "cost-settings",
            label: "Cost Settings",
            children: (
              <div className="space-y-4">
                <div className="flex justify-end">
                  {isSuperAdmin && (
                    <AdminPageActions label="Add cost setting" onClick={openCostAdd} />
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
                          <td
                            colSpan={4}
                            className="p-6 text-center text-muted-foreground"
                          >
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
                                <Button size="small" onClick={() => openCostEdit(r)}>
                                  Edit
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
              </div>
            ),
          },
          {
            key: "eligibility-rules",
            label: "Eligibility Rules",
            children: (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <AdminPageActions label="Add rule" onClick={openRuleAdd} />
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
                          <td
                            colSpan={6}
                            className="p-6 text-center text-muted-foreground"
                          >
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
                                <Button size="small" onClick={() => openRuleEdit(r)}>
                                  Edit
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
              </div>
            ),
          },
        ]}
      />

      <AdminFormModal
        open={costOpen}
        title={editingCost ? "Edit cost setting" : "Add cost setting"}
        onClose={closeCostModal}
        formId="cost-setting-form"
        saving={costSaving}
        width={720}
      >
        {costOpen && (
          <CostSettingForm
            variant="modal"
            countries={countries}
            initial={editingCost}
            onSuccess={closeCostModal}
            onClose={closeCostModal}
            onSavingChange={setCostSaving}
          />
        )}
      </AdminFormModal>

      <AdminFormModal
        open={ruleOpen}
        title={editingRule ? "Edit eligibility rule" : "Add eligibility rule"}
        onClose={closeRuleModal}
        formId="eligibility-rule-form"
        saving={ruleSaving}
        width={720}
      >
        {ruleOpen && (
          <EligibilityRuleForm
            variant="modal"
            countries={countries}
            initial={editingRule}
            onSuccess={closeRuleModal}
            onClose={closeRuleModal}
            onSavingChange={setRuleSaving}
          />
        )}
      </AdminFormModal>
    </>
  );
}
