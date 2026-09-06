"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import type { Counselor } from "@/types";
import { finishAdminSave, type AdminFormBaseProps } from "@/lib/admin/form-utils";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface ProfileOption {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface CounselorFormProps extends AdminFormBaseProps {
  initial?: Counselor;
  profileOptions: ProfileOption[];
}

const FORM_ID = "counselor-form";

export function CounselorForm({
  initial,
  profileOptions,
  variant = "page",
  onSuccess,
  onClose,
  onSavingChange,
}: CounselorFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(initial?.profile_id ?? "");
  const [specialization, setSpecialization] = useState(initial?.specialization ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    onSavingChange?.(true);

    try {
      const payload = isEdit
        ? {
            specialization: specialization || null,
            bio: bio || null,
            is_active: isActive,
          }
        : {
            profile_id: profileId,
            specialization: specialization || null,
            bio: bio || null,
            is_active: isActive,
          };

      const res = await fetch(
        isEdit ? `/api/admin/counselors/${initial!.id}` : "/api/admin/counselors",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save counselor"));

      message.success(isEdit ? "Counselor updated" : "Counselor created");
      finishAdminSave(router, {
        variant,
        onSuccess,
        onClose,
        backHref: "/admin/counselors",
      });
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
      onSavingChange?.(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit counselor" : "New counselor"}
      backHref="/admin/counselors"
      formId={FORM_ID}
      saving={loading}
      variant={variant}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4 p-6">
            <FormField label="Profile" htmlFor="profile_id" required>
              <AppSelect
                id="profile_id"
                value={profileId}
                onChange={setProfileId}
                placeholder="Select profile"
                size="middle"
                disabled={isEdit}
                options={profileOptions.map((p) => ({
                  value: p.id,
                  label: p.full_name ?? p.email ?? p.id,
                }))}
              />
            </FormField>
            <FormField label="Specialization" htmlFor="specialization">
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. UK admissions"
              />
            </FormField>
            <FormField label="Bio" htmlFor="bio">
              <Input.TextArea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
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
