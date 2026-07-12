"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ConsultationForm } from "@/components/admin/forms/ConsultationForm";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FilterableDataTable,
  type FilterableColumnDef,
  type TableRow,
} from "@/components/tables/FilterableDataTable";
import { useState } from "react";

interface ConsultationsAdminPanelProps {
  title: string;
  description?: string;
  addLabel: string;
  emptyText?: string;
  columns: FilterableColumnDef[];
  rows: TableRow[];
  leads: { id: string; name: string }[];
  students: { id: string; label: string }[];
  counselors: { profile_id: string; name: string }[];
}

export function ConsultationsAdminPanel({
  title,
  description,
  addLabel,
  emptyText,
  columns,
  rows,
  leads,
  students,
  counselors,
}: ConsultationsAdminPanelProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <PageHeader title={title} description={description}>
        <AdminPageActions label={addLabel} onClick={() => setOpen(true)} />
      </PageHeader>
      <FilterableDataTable columns={columns} data={rows} emptyText={emptyText} />
      <AdminFormModal
        open={open}
        title="Schedule consultation"
        onClose={() => setOpen(false)}
        formId="consultation-form"
        saving={saving}
        width={720}
      >
        {open && (
          <ConsultationForm
            variant="modal"
            leads={leads}
            students={students}
            counselors={counselors}
            onSuccess={() => setOpen(false)}
            onClose={() => setOpen(false)}
            onSavingChange={setSaving}
          />
        )}
      </AdminFormModal>
    </div>
  );
}
