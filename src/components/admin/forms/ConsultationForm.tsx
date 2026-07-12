"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { CONSULTATION_STATUSES } from "@/constants";
import type { Consultation, ConsultationStatus } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

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
  const { message } = App.useApp();
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

      message.success(isEdit ? "Consultation updated" : "Consultation scheduled");
      router.push(backHref);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
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
          <div className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Lead" htmlFor="lead_id">
                <AppSelect
                  id="lead_id"
                  value={leadId}
                  onChange={setLeadId}
                  placeholder="None"
                  size="middle"
                  options={leads.map((l) => ({ value: l.id, label: l.name }))}
                />
              </FormField>
              <FormField label="Student" htmlFor="student_id">
                <AppSelect
                  id="student_id"
                  value={studentId}
                  onChange={setStudentId}
                  placeholder="None"
                  size="middle"
                  options={students.map((s) => ({ value: s.id, label: s.label }))}
                />
              </FormField>
              <FormField label="Counselor" htmlFor="counselor_id">
                <AppSelect
                  id="counselor_id"
                  value={counselorId}
                  onChange={setCounselorId}
                  placeholder="Unassigned"
                  size="middle"
                  options={counselors.map((c) => ({ value: c.profile_id, label: c.name }))}
                />
              </FormField>
              <FormField label="Status" htmlFor="status">
                <AppSelect
                  id="status"
                  value={status}
                  onChange={(value) => setStatus(value as ConsultationStatus)}
                  size="middle"
                  allowClear={false}
                  options={CONSULTATION_STATUSES.map((s) => ({
                    value: s,
                    label: s.replace(/_/g, " "),
                  }))}
                />
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
              <Input.TextArea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </FormField>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
