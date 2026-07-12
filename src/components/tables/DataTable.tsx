import { EmptyState } from "@/components/common/EmptyState";
import { Table } from "antd";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5">
      <Table
        rowKey="id"
        pagination={false}
        dataSource={data}
        columns={columns.map((col) => ({
          key: col.key,
          title: col.header,
          render: (_: unknown, row: T) => col.cell(row),
        }))}
      />
    </div>
  );
}
