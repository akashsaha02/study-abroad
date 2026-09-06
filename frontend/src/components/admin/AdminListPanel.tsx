"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import {
  FilterableDataTable,
  type FilterableColumnDef,
  type TableRow,
} from "@/components/tables/FilterableDataTable";
import type { AdminFormBaseProps } from "@/lib/admin/form-utils";
import { useCallback, useMemo, useState } from "react";

export interface AdminListPanelProps<T extends { id: string }> {
  title: string;
  description?: string;
  addLabel?: string;
  formId: string;
  formTitleAdd: string;
  formTitleEdit: string;
  columns: FilterableColumnDef[];
  data: TableRow[];
  records: T[];
  emptyText?: string;
  showAdd?: boolean;
  modalWidth?: number;
  renderForm: (props: AdminFormBaseProps & { initial?: T }) => React.ReactNode;
}

export function AdminListPanel<T extends { id: string }>({
  title,
  description,
  addLabel = "Add new",
  formId,
  formTitleAdd,
  formTitleEdit,
  columns,
  data,
  records,
  emptyText,
  showAdd = true,
  modalWidth,
  renderForm,
}: AdminListPanelProps<T>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | undefined>();
  const [saving, setSaving] = useState(false);

  const closeModal = useCallback(() => {
    setOpen(false);
    setEditing(undefined);
  }, []);

  const openAdd = useCallback(() => {
    setEditing(undefined);
    setOpen(true);
  }, []);

  const openEdit = useCallback(
    (id: string) => {
      const record = records.find((r) => r.id === id);
      if (!record) return;
      setEditing(record);
      setOpen(true);
    },
    [records]
  );

  const tableColumns = useMemo(
    () =>
      columns.map((col) => {
        if (
          col.cell?.type === "resource-actions" ||
          col.cell?.type === "counselor-actions"
        ) {
          return { ...col, cell: { ...col.cell, onEdit: openEdit } };
        }
        return col;
      }),
    [columns, openEdit]
  );

  return (
    <PageStack>
      <PageHeader compact title={title} description={description}>
        {showAdd && <AdminPageActions label={addLabel} onClick={openAdd} />}
      </PageHeader>

      <FilterableDataTable
        columns={tableColumns}
        data={data}
        emptyText={emptyText}
      />

      <AdminFormModal
        open={open}
        title={editing ? formTitleEdit : formTitleAdd}
        onClose={closeModal}
        formId={formId}
        saving={saving}
        width={modalWidth}
      >
        {open &&
          renderForm({
            initial: editing,
            variant: "modal",
            onSuccess: closeModal,
            onClose: closeModal,
            onSavingChange: setSaving,
          })}
      </AdminFormModal>
    </PageStack>
  );
}
