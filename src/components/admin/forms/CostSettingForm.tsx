"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CostSetting } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CountryOption {
  id: string;
  name: string;
}

interface CostSettingFormProps {
  countries: CountryOption[];
  initial?: CostSetting;
}

const FORM_ID = "cost-setting-form";

export function CostSettingForm({ countries, initial }: CostSettingFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(
    initial?.country_id ?? countries.find((c) => c.name === initial?.country)?.id ?? ""
  );
  const [degreeLevel, setDegreeLevel] = useState(initial?.degree_level ?? "");
  const [tuitionMin, setTuitionMin] = useState(initial?.tuition_min?.toString() ?? "");
  const [tuitionMax, setTuitionMax] = useState(initial?.tuition_max?.toString() ?? "");
  const [livingMin, setLivingMin] = useState(initial?.living_cost_min?.toString() ?? "");
  const [livingMax, setLivingMax] = useState(initial?.living_cost_max?.toString() ?? "");
  const [visaFee, setVisaFee] = useState(initial?.visa_fee?.toString() ?? "");
  const [insuranceFee, setInsuranceFee] = useState(initial?.insurance_fee?.toString() ?? "");
  const [applicationFee, setApplicationFee] = useState(initial?.application_fee?.toString() ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        country_id: countryId,
        degree_level: degreeLevel,
        tuition_min: tuitionMin ? Number(tuitionMin) : null,
        tuition_max: tuitionMax ? Number(tuitionMax) : null,
        living_cost_min: livingMin ? Number(livingMin) : null,
        living_cost_max: livingMax ? Number(livingMax) : null,
        visa_fee: visaFee ? Number(visaFee) : null,
        insurance_fee: insuranceFee ? Number(insuranceFee) : null,
        application_fee: applicationFee ? Number(applicationFee) : null,
      };

      const res = await fetch(
        isEdit ? `/api/admin/cost-settings/${initial!.id}` : "/api/admin/cost-settings",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save cost setting"));

      toast.success(isEdit ? "Cost setting updated" : "Cost setting created");
      router.push("/admin/settings");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit cost setting" : "New cost setting"}
      backHref="/admin/settings"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Country" htmlFor="country_id" required>
                <select
                  id="country_id"
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className={selectClassName}
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Degree level" htmlFor="degree_level" required>
                <Input
                  id="degree_level"
                  value={degreeLevel}
                  onChange={(e) => setDegreeLevel(e.target.value)}
                  placeholder="e.g. Masters"
                  required
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tuition min" htmlFor="tuition_min">
                <Input
                  id="tuition_min"
                  type="number"
                  value={tuitionMin}
                  onChange={(e) => setTuitionMin(e.target.value)}
                />
              </FormField>
              <FormField label="Tuition max" htmlFor="tuition_max">
                <Input
                  id="tuition_max"
                  type="number"
                  value={tuitionMax}
                  onChange={(e) => setTuitionMax(e.target.value)}
                />
              </FormField>
              <FormField label="Living cost min" htmlFor="living_cost_min">
                <Input
                  id="living_cost_min"
                  type="number"
                  value={livingMin}
                  onChange={(e) => setLivingMin(e.target.value)}
                />
              </FormField>
              <FormField label="Living cost max" htmlFor="living_cost_max">
                <Input
                  id="living_cost_max"
                  type="number"
                  value={livingMax}
                  onChange={(e) => setLivingMax(e.target.value)}
                />
              </FormField>
              <FormField label="Visa fee" htmlFor="visa_fee">
                <Input
                  id="visa_fee"
                  type="number"
                  value={visaFee}
                  onChange={(e) => setVisaFee(e.target.value)}
                />
              </FormField>
              <FormField label="Insurance fee" htmlFor="insurance_fee">
                <Input
                  id="insurance_fee"
                  type="number"
                  value={insuranceFee}
                  onChange={(e) => setInsuranceFee(e.target.value)}
                />
              </FormField>
              <FormField label="Application fee" htmlFor="application_fee">
                <Input
                  id="application_fee"
                  type="number"
                  value={applicationFee}
                  onChange={(e) => setApplicationFee(e.target.value)}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
