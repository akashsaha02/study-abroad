"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Counselor } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileOption {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface CounselorFormProps {
  initial?: Counselor;
  profileOptions: ProfileOption[];
}

const FORM_ID = "counselor-form";

export function CounselorForm({ initial, profileOptions }: CounselorFormProps) {
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

      toast.success(isEdit ? "Counselor updated" : "Counselor created");
      router.push("/admin/counselors");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit counselor" : "New counselor"}
      backHref="/admin/counselors"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <FormField label="Profile" htmlFor="profile_id" required>
              <select
                id="profile_id"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                required
                disabled={isEdit}
                className={selectClassName}
              >
                <option value="">Select profile</option>
                {profileOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name ?? p.email ?? p.id}
                  </option>
                ))}
              </select>
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
              <Textarea
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
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
