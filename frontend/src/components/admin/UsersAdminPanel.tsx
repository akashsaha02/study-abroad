"use client";

import { UserEditModal, type UserRecord } from "@/components/admin/UserEditModal";
import { PageHeader } from "@/components/common/PageHeader";
import {
  FilterableDataTable,
  type FilterableColumnDef,
  type TableRow,
} from "@/components/tables/FilterableDataTable";
import { useState } from "react";

interface UsersAdminPanelProps {
  title: string;
  description?: string;
  emptyText?: string;
  dateLocale: string;
  labels: {
    name: string;
    email: string;
    role: string;
    active: string;
    created: string;
    actions: string;
    yes: string;
    no: string;
  };
  rows: TableRow[];
  records: UserRecord[];
}

export function UsersAdminPanel({
  title,
  description,
  emptyText,
  dateLocale,
  labels,
  rows,
  records,
}: UsersAdminPanelProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);

  function openEdit(id: string) {
    setEditing(records.find((r) => r.id === id) ?? null);
    setOpen(true);
  }

  const columns: FilterableColumnDef[] = [
    {
      key: "name",
      title: labels.name,
      dataIndex: "name",
      searchable: true,
      sortable: true,
    },
    {
      key: "email",
      title: labels.email,
      dataIndex: "email",
      searchable: true,
    },
    {
      key: "role",
      title: labels.role,
      dataIndex: "role",
      filters: [
        { text: "student", value: "student" },
        { text: "counselor", value: "counselor" },
        { text: "admin", value: "admin" },
        { text: "super admin", value: "super_admin" },
      ],
      cell: { type: "role-badge", roleKey: "currentRole" },
    },
    {
      key: "active",
      title: labels.active,
      dataIndex: "is_active",
      filters: [
        { text: labels.yes, value: "true" },
        { text: labels.no, value: "false" },
      ],
      cell: { type: "yesNo" },
    },
    {
      key: "created",
      title: labels.created,
      dataIndex: "created_at",
      sortable: "date",
      cell: { type: "date", locale: dateLocale },
    },
    {
      key: "actions",
      title: labels.actions,
      cell: {
        type: "user-actions",
        roleKey: "currentRole",
        activeKey: "isActive",
        onEdit: openEdit,
      },
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} />
      <FilterableDataTable columns={columns} data={rows} emptyText={emptyText} />
      <UserEditModal
        open={open}
        user={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSuccess={() => setOpen(false)}
      />
    </div>
  );
}
