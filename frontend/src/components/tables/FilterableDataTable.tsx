"use client";

import { ConsultationStatusSelect } from "@/components/admin/ConsultationStatusSelect";
import { CounselorRowActions } from "@/components/admin/CounselorRowActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/i18n-format";
import { Link } from "@/i18n/navigation";
import type { ConsultationStatus, UserRole } from "@/types";
import { Empty, Input, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { DocumentReviewActions } from "@/features/documents/components/DocumentReviewActions";

export type TableRow = Record<string, unknown> & { id: string };

export type TableColumnCell =
  | { type: "text"; displayKey?: string; clamp?: boolean }
  | { type: "link"; hrefKey: string; labelKey?: string }
  | { type: "status"; statusKey?: string; labelKey: string }
  | { type: "date"; locale: string }
  | { type: "published" }
  | { type: "yesNo" }
  | { type: "role-badge"; roleKey: string }
  | {
      type: "resource-actions";
      apiPath: string;
      editPathTemplate?: string;
      publishedKey: string;
      nameKey: string;
      onEdit?: (id: string) => void;
    }
  | { type: "consultation-status"; statusKey?: string }
  | { type: "document-review" }
  | { type: "user-actions"; roleKey: string; activeKey: string; onEdit?: (id: string) => void }
  | { type: "counselor-actions"; nameKey: string; activeKey: string; onEdit?: (id: string) => void };

export type FilterableColumnDef = {
  key: string;
  title: string;
  dataIndex?: string;
  sortKey?: string;
  searchable?: boolean;
  filters?: { text: string; value: string }[];
  sortable?: boolean | "date" | "number";
  cell?: TableColumnCell;
  width?: number | string;
};

interface FilterableDataTableProps {
  columns: FilterableColumnDef[];
  data: TableRow[];
  emptyText?: string;
  pageSize?: number;
  defaultFilters?: Record<string, string[]>;
}

function getCellText(row: TableRow, col: FilterableColumnDef): string {
  if (col.dataIndex) {
    const value = row[col.dataIndex];
    return value == null ? "" : String(value);
  }
  return "";
}

function resolvePath(template: string, row: TableRow): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(row[key] ?? ""));
}

function renderCell(
  row: TableRow,
  col: FilterableColumnDef,
  value: unknown,
  labels: { published: string; draft: string; yes: string; no: string }
): React.ReactNode {
  const cell = col.cell ?? { type: "text" as const };

  switch (cell.type) {
    case "link": {
      const labelKey = cell.labelKey ?? col.dataIndex ?? col.key;
      const href = String(row[cell.hrefKey] ?? "");
      const label = String(row[labelKey] ?? value ?? "");
      if (!href) return label;
      return (
        <Link href={href} className="font-medium hover:underline">
          {label}
        </Link>
      );
    }
    case "status": {
      const statusKey = cell.statusKey ?? col.dataIndex ?? "status";
      return (
        <StatusBadge
          status={String(row[statusKey] ?? value)}
          label={String(row[cell.labelKey] ?? value)}
        />
      );
    }
    case "date":
      return value ? formatDate(String(value), cell.locale) : "—";
    case "published":
      return value === "true" ? labels.published : labels.draft;
    case "yesNo":
      return value === "true" ? labels.yes : labels.no;
    case "role-badge":
      return <RoleBadge role={String(row[cell.roleKey] ?? value) as UserRole} />;
    case "resource-actions":
      return (
        <ResourceRowActions
          id={row.id}
          apiPath={cell.apiPath}
          editHref={cell.editPathTemplate ? resolvePath(cell.editPathTemplate, row) : ""}
          isPublished={row[cell.publishedKey] === true || row[cell.publishedKey] === "true"}
          itemName={String(row[cell.nameKey] ?? "")}
          onEdit={cell.onEdit}
        />
      );
    case "consultation-status":
      return (
        <ConsultationStatusSelect
          consultationId={row.id}
          currentStatus={String(row[cell.statusKey ?? "status"] ?? "") as ConsultationStatus}
        />
      );
    case "document-review":
      return (
        <DocumentReviewActions
          documentId={row.id}
          status={String(row.status ?? "")}
          fileName={row.file != null ? String(row.file) : null}
          mimeType={row.mime_type != null ? String(row.mime_type) : null}
        />
      );
    case "user-actions":
      return (
        <UserRowActions
          userId={row.id}
          onEdit={cell.onEdit}
        />
      );
    case "counselor-actions":
      return (
        <CounselorRowActions
          id={row.id}
          name={String(row[cell.nameKey] ?? "")}
          isActive={row[cell.activeKey] === true}
          onEdit={cell.onEdit}
        />
      );
    case "text": {
      const displayKey =
        cell.type === "text" && cell.displayKey ? cell.displayKey : col.dataIndex;
      const displayValue = displayKey ? row[displayKey] : value;
      const text = displayValue == null ? "—" : String(displayValue);
      return cell.type === "text" && cell.clamp ? (
        <span className="line-clamp-2">{text}</span>
      ) : (
        text
      );
    }
  }
}

export function FilterableDataTable({
  columns,
  data,
  emptyText,
  pageSize = 10,
  defaultFilters,
}: FilterableDataTableProps) {
  const t = useTranslations("table");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");

  const labels = useMemo(
    () => ({
      published: tCommon("published"),
      draft: tCommon("draft"),
      yes: tCommon("yes"),
      no: tCommon("no"),
    }),
    [tCommon]
  );

  const searchableKeys = useMemo(
    () => columns.filter((c) => c.searchable).map((c) => c.key),
    [columns]
  );

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        if (!searchableKeys.includes(col.key)) return false;
        return getCellText(row, col).toLowerCase().includes(query);
      })
    );
  }, [columns, data, search, searchableKeys]);

  const antColumns: ColumnsType<TableRow> = columns.map((col) => {
    const defaultFilteredValue = defaultFilters?.[col.key];
    const column: ColumnsType<TableRow>[number] = {
      key: col.key,
      title: col.title,
      dataIndex: col.dataIndex,
      defaultFilteredValue,
      render: (value, record) => renderCell(record, col, value, labels),
      filters: col.filters?.map((f) => ({ text: f.text, value: f.value })),
      onFilter:
        col.filters && col.dataIndex
          ? (value, record) => String(record[col.dataIndex!]) === String(value)
          : undefined,
      sorter: col.sortable
        ? (() => {
            const sortField = col.sortKey ?? col.dataIndex;
            if (!sortField) return undefined;
            if (col.sortable === "date") {
              return (a: TableRow, b: TableRow) =>
                new Date(String(a[sortField] ?? 0)).getTime() -
                new Date(String(b[sortField] ?? 0)).getTime();
            }
            if (col.sortable === "number") {
              return (a: TableRow, b: TableRow) =>
                Number(a[sortField] ?? 0) - Number(b[sortField] ?? 0);
            }
            return (a: TableRow, b: TableRow) =>
              String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? ""));
          })()
        : undefined,
      width: col.width,
    };
    return column;
  });

  const pagination: TableProps<TableRow>["pagination"] = {
    pageSize,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showTotal: (total) => t("total", { total }),
  };

  return (
    <div className="space-y-4">
      {searchableKeys.length > 0 && (
        <Input.Search
          allowClear
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      )}
      <Table<TableRow>
        rowKey="id"
        columns={antColumns}
        dataSource={filteredData}
        pagination={pagination}
        locale={{
          emptyText: (
            <Empty
              description={emptyText ?? t("noData")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        scroll={{ x: true }}
        size="middle"
      />
    </div>
  );
}
