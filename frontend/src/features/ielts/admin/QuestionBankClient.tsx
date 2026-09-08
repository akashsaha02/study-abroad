"use client";

import { ieltsApi } from "@/features/ielts/api";
import { IeltsQuestionForm } from "@/features/ielts/admin/QuestionForm";
import { QUESTION_TYPE_LABELS, relatedOne } from "@abroadly/shared/ielts";
import { Link } from "@/i18n/navigation";
import { App, Button, Input, Modal, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  title: string;
  skill: string;
  question_type: string;
  difficulty: string;
  status: string;
  created_by: string | null;
  ielts_question_stats?: { attempts?: number; correct_count?: number }[] | null;
};

export function QuestionBankClient({
  items,
  total,
}: {
  items: Row[];
  total: number;
}) {
  const { message } = App.useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      if (skill && r.skill !== skill) return false;
      if (status && r.status !== status) return false;
      return true;
    });
  }, [items, search, skill, status]);

  async function run(action: () => Promise<unknown>) {
    try {
      await action();
      message.success("Updated");
      window.location.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function openEditor(id?: string) {
    if (!id) {
      setEditing(null);
      setOpen(true);
      return;
    }
    try {
      const data = (await ieltsApi.getQuestion(id)) as Record<string, unknown> & {
        ielts_passages?: { title?: string; body?: string } | { title?: string; body?: string }[];
      };
      const passage = relatedOne(data.ielts_passages);
      setEditing({
        ...data,
        passage: passage?.body,
        passage_title: passage?.title,
      });
      setOpen(true);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Could not load question");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Search questions"
            onSearch={setSearch}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select
            allowClear
            placeholder="Skill"
            className="w-36"
            options={["listening", "reading", "writing", "speaking"].map((s) => ({
              value: s,
              label: s,
            }))}
            onChange={setSkill}
          />
          <Select
            allowClear
            placeholder="Status"
            className="w-36"
            options={["draft", "review", "published", "archived"].map((s) => ({
              value: s,
              label: s,
            }))}
            onChange={setStatus}
          />
          <Select
            placeholder="Mine / all"
            className="w-40"
            options={[
              { value: "", label: "All questions" },
              { value: "mine", label: "My questions" },
            ]}
            onChange={(v) => {
              const url = new URL(window.location.href);
              if (v === "mine") url.searchParams.set("mine", "1");
              else url.searchParams.delete("mine");
              window.location.href = url.toString();
            }}
          />
        </Space>
        <Space>
          <Link href="/admin/ielts/questions/import">
            <Button>Import CSV / XLSX</Button>
          </Link>
          <Button type="primary" onClick={() => void openEditor()}>
            New question
          </Button>
        </Space>
      </div>
      {selected.length > 0 && (
        <Space wrap>
          <Button onClick={() => void run(() => ieltsApi.bulkQuestions(selected, "review"))}>
            Send to review
          </Button>
          <Button onClick={() => void run(() => ieltsApi.bulkQuestions(selected, "published"))}>
            Publish selected
          </Button>
          <Button onClick={() => void run(() => ieltsApi.bulkQuestions(selected, "archived"))}>
            Archive selected
          </Button>
        </Space>
      )}
      <Table
        rowKey="id"
        dataSource={filtered}
        rowSelection={{ selectedRowKeys: selected, onChange: (keys) => setSelected(keys as string[]) }}
        pagination={{ total, pageSize: 20 }}
        columns={[
          { title: "Question", dataIndex: "title", ellipsis: true },
          { title: "Skill", dataIndex: "skill" },
          {
            title: "Type",
            dataIndex: "question_type",
            render: (v: string) => QUESTION_TYPE_LABELS[v] ?? v,
          },
          { title: "Difficulty", dataIndex: "difficulty" },
          {
            title: "Status",
            dataIndex: "status",
            render: (v: string) => <Tag>{v}</Tag>,
          },
          {
            title: "Attempts",
            render: (_: unknown, row: Row) =>
              row.ielts_question_stats?.[0]?.attempts ?? 0,
          },
          {
            title: "Accuracy",
            render: (_: unknown, row: Row) => {
              const s = row.ielts_question_stats?.[0];
              if (!s?.attempts) return "—";
              return `${Math.round(((s.correct_count ?? 0) / s.attempts) * 100)}%`;
            },
          },
          {
            title: "Actions",
            render: (_: unknown, row: Row) => (
              <Space wrap>
                <Button size="small" onClick={() => void openEditor(row.id)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setPreview(row as unknown as Record<string, unknown>);
                  }}
                >
                  Preview
                </Button>
                <Button size="small" onClick={() => void run(() => ieltsApi.duplicateQuestion(row.id))}>
                  Duplicate
                </Button>
                <Button size="small" onClick={() => void run(() => ieltsApi.archiveQuestion(row.id))}>
                  Archive
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={840}
        title={editing ? "Edit question" : "New question"}
        destroyOnHidden
      >
        <IeltsQuestionForm
          initial={editing ?? undefined}
          onSaved={() => {
            setOpen(false);
            window.location.reload();
          }}
        />
      </Modal>
      <Modal
        open={Boolean(preview)}
        onCancel={() => setPreview(null)}
        footer={null}
        title="Question preview"
      >
        <p className="font-medium">{String(preview?.title ?? "")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {String(preview?.skill ?? "")} · {String(preview?.question_type ?? "")} · {String(preview?.status ?? "")}
        </p>
      </Modal>
    </div>
  );
}
