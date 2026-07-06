"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { CONSULTATION_STATUSES } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Consultation, ConsultationStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LeadOption {
  id: string;
  name: string;
}

interface StudentOption {
  id: string;
  label: string;
}

interface CounselorOption {
  profile_id: string;
  name: string;
}

interface ConsultationFormProps {
  initial?: Consultation;
  leads?: LeadOption[];
  students?: StudentOption[];
  counselors?: CounselorOption[];
  backHref?: string;
}

const FORM_ID = "consultation-form";

export function ConsultationForm({
  initial,
  leads = [],
  students = [],
  counselors = [],
  backHref = "/admin/consultations",
}: ConsultationFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState(initial?.lead_id ?? "");
  const [studentId, setStudentId] = useState(initial?.student_id ?? "");
  const [counselorId, setCounselorId] = useState(initial?.counselor_id ?? "");
  const [requestedDate, setRequestedDate] = useState(initial?.requested_date ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    initial?.scheduled_at ? initial.scheduled_at.slice(0, 16) : ""
  );
  const [meetingLink, setMeetingLink] = useState(initial?.meeting_link ?? "");
  const [status, setStatus] = useState<ConsultationStatus>(initial?.status ?? "requested");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        lead_id: leadId || null,
        student_id: studentId || null,
        counselor_id: counselorId || null,
        requested_date: requestedDate || null,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        meeting_link: meetingLink || null,
        status,
        notes: notes || null,
      };

      const res = await fetch(
        isEdit ? `/api/admin/consultations/${initial!.id}` : "/api/admin/consultations",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save consultation"));

      toast.success(isEdit ? "Consultation updated" : "Consultation scheduled");
      router.push(backHref);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit consultation" : "Schedule consultation"}
      backHref={backHref}
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Lead" htmlFor="lead_id">
                <select
                  id="lead_id"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Student" htmlFor="student_id">
                <select
                  id="student_id"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Counselor" htmlFor="counselor_id">
                <select
                  id="counselor_id"
                  value={counselorId}
                  onChange={(e) => setCounselorId(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Unassigned</option>
                  {counselors.map((c) => (
                    <option key={c.profile_id} value={c.profile_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Status" htmlFor="status">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ConsultationStatus)}
                  className={selectClassName}
                >
                  {CONSULTATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Requested date" htmlFor="requested_date">
                <Input
                  id="requested_date"
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                />
              </FormField>
              <FormField label="Scheduled at" htmlFor="scheduled_at">
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Meeting link" htmlFor="meeting_link">
              <Input
                id="meeting_link"
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Notes" htmlFor="notes">
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </FormField>
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
