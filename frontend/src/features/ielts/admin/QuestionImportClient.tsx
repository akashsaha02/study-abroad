"use client";

import { ieltsApi } from "@/features/ielts/api";
import { App, Button, Table, Upload } from "antd";
import { useState } from "react";

type Preview = {
  validCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
};

export function QuestionImportClient() {
  const { message } = App.useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);

  async function toBase64(f: File) {
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  }

  async function runPreview() {
    if (!file) return;
    setBusy(true);
    try {
      const content = await toBase64(file);
      const data = (await ieltsApi.previewImport(file.name, content)) as Preview;
      setPreview(data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function commit() {
    if (!file) return;
    setBusy(true);
    try {
      const content = await toBase64(file);
      const data = (await ieltsApi.commitImport(file.name, content)) as {
        created: number;
      };
      message.success(`Imported ${data.created} questions`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload CSV or XLSX. Invalid rows are skipped. Published rows are imported as{" "}
        <strong>review</strong> unless you have publish permission.
      </p>
      <a href="/api/admin/ielts/questions/import/template.csv">Download CSV template</a>
      <Upload
        beforeUpload={(f) => {
          setFile(f);
          setPreview(null);
          return false;
        }}
        maxCount={1}
        accept=".csv,.xlsx,.xls"
      >
        <Button>Choose file</Button>
      </Upload>
      <div className="flex gap-2">
        <Button disabled={!file} loading={busy} onClick={() => void runPreview()}>
          Validate
        </Button>
        <Button
          type="primary"
          disabled={!preview || preview.errorCount > 0 && preview.validCount === 0}
          loading={busy}
          onClick={() => void commit()}
        >
          Import valid rows
        </Button>
      </div>
      {preview && (
        <>
          <p>
            Valid rows: {preview.validCount}. Errors: {preview.errorCount}.
          </p>
          <Table
            rowKey={(r) => `${r.row}-${r.message}`}
            dataSource={preview.errors}
            pagination={false}
            columns={[
              { title: "Row", dataIndex: "row", width: 80 },
              { title: "Error", dataIndex: "message" },
            ]}
          />
        </>
      )}
    </div>
  );
}
