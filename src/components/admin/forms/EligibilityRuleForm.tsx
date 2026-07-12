"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import type { EligibilityRule } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface EligibilityRuleFormProps {
  countries: CountryOption[];
  initial?: EligibilityRule;
}

const FORM_ID = "eligibility-rule-form";

export function EligibilityRuleForm({ countries, initial }: EligibilityRuleFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(
    initial?.country_id ?? countries.find((c) => c.name === initial?.country)?.id ?? ""
  );
  const [educationLevel, setEducationLevel] = useState(initial?.education_level ?? "");
  const [minCgpa, setMinCgpa] = useState(initial?.min_cgpa?.toString() ?? "");
  const [minIelts, setMinIelts] = useState(initial?.min_ielts?.toString() ?? "");
  const [minBudget, setMinBudget] = useState(initial?.min_budget?.toString() ?? "");
  const [recommendation, setRecommendation] = useState(initial?.recommendation ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        country_id: countryId,
        education_level: educationLevel,
        min_cgpa: minCgpa ? Number(minCgpa) : null,
        min_ielts: minIelts ? Number(minIelts) : null,
        min_budget: minBudget ? Number(minBudget) : null,
        recommendation: recommendation || null,
        is_active: isActive,
      };

      const res = await fetch(
        isEdit ? `/api/admin/eligibility-rules/${initial!.id}` : "/api/admin/eligibility-rules",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save rule"));

      message.success(isEdit ? "Rule updated" : "Rule created");
      router.push("/admin/settings");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit eligibility rule" : "New eligibility rule"}
      backHref="/admin/settings"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Country" htmlFor="country_id" required>
                <AppSelect
                  id="country_id"
                  value={countryId}
                  onChange={setCountryId}
                  placeholder="Select country"
                  size="middle"
                  options={countries.map((c) => ({ value: c.id, label: c.name }))}
                />
              </FormField>
              <FormField label="Education level" htmlFor="education_level" required>
                <Input
                  id="education_level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  placeholder="e.g. Bachelor"
                  required
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Min CGPA" htmlFor="min_cgpa">
                <Input
                  id="min_cgpa"
                  type="number"
                  step="0.01"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                />
              </FormField>
              <FormField label="Min IELTS" htmlFor="min_ielts">
                <Input
                  id="min_ielts"
                  type="number"
                  step="0.5"
                  value={minIelts}
                  onChange={(e) => setMinIelts(e.target.value)}
                />
              </FormField>
              <FormField label="Min budget" htmlFor="min_budget">
                <Input
                  id="min_budget"
                  type="number"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Recommendation" htmlFor="recommendation">
              <Input.TextArea
                id="recommendation"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                rows={3}
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active
            </label>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
