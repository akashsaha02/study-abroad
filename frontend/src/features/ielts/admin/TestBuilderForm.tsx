"use client";

import { ieltsApi } from "@/features/ielts/api";
import { IELTS_SKILLS, QUESTION_TYPE_LABELS } from "@abroadly/shared/ielts";
import { App, Button, Form, Input, InputNumber, Select, Switch } from "antd";
import { useEffect, useState } from "react";

type Question = { id: string; title: string; skill: string; question_type: string };

export function TestBuilderForm({ initialId }: { initialId?: string }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const data = (await ieltsApi.listQuestions("pageSize=100&status=published")) as {
        items: Question[];
      };
      setQuestions(data.items ?? []);
      if (initialId) {
        const test = (await ieltsApi.getTest(initialId)) as {
          title: string;
          description: string;
          skill: string;
          kind: string;
          ielts_type: string;
          duration_seconds: number;
          visibility: string;
          review_policy: string;
          allow_audio_replay: boolean;
          ielts_test_questions: { question_id: string; sort_order: number }[];
        };
        form.setFieldsValue(test);
        setSelected(
          [...(test.ielts_test_questions ?? [])]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((q) => q.question_id)
        );
      }
    })();
  }, [form, initialId]);

  async function onFinish(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const skill = String(values.skill ?? "reading");
      const payload = {
        ...values,
        sections: [
          {
            skill,
            title: "Section 1",
            sort_order: 0,
            question_ids: selected,
          },
        ],
      };
      if (initialId) await ieltsApi.updateTest(initialId, payload);
      else await ieltsApi.createTest(payload);
      message.success("Test saved");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function move(id: string, dir: -1 | 1) {
    setSelected((ids) => {
      const i = ids.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ids.length) return ids;
      const next = [...ids];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ kind: "skill", ielts_type: "academic", duration_seconds: 1200, visibility: "students", review_policy: "after_submit", allow_audio_replay: true, status: "draft", skill: "reading" }}>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <div className="grid gap-3 md:grid-cols-3">
        <Form.Item name="skill" label="Skill">
          <Select options={IELTS_SKILLS.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="ielts_type" label="Module">
          <Select options={[{ value: "academic", label: "Academic" }, { value: "general", label: "General" }, { value: "both", label: "Both" }]} />
        </Form.Item>
        <Form.Item name="kind" label="Kind">
          <Select
            options={[
              { value: "skill", label: "Skill test" },
              { value: "full", label: "Full mock" },
              { value: "practice", label: "Practice" },
            ]}
          />
        </Form.Item>
        <Form.Item name="duration_seconds" label="Duration (seconds)">
          <InputNumber className="w-full" min={60} />
        </Form.Item>
        <Form.Item name="visibility" label="Visibility">
          <Select
            options={[
              { value: "public", label: "Public" },
              { value: "students", label: "Students" },
              { value: "hidden", label: "Hidden" },
            ]}
          />
        </Form.Item>
        <Form.Item name="review_policy" label="Review policy">
          <Select
            options={[
              { value: "immediate", label: "Immediate" },
              { value: "after_submit", label: "After submit" },
              { value: "never", label: "Never" },
            ]}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "review", label: "Review" },
              { value: "published", label: "Published" },
            ]}
          />
        </Form.Item>
      </div>
      <Form.Item name="allow_audio_replay" label="Allow audio replay" valuePropName="checked">
        <Switch />
      </Form.Item>
      <h3 className="mb-2 font-semibold">Questions</h3>
      <div className="mb-4 grid gap-2 md:grid-cols-2">
        <div className="max-h-80 overflow-auto rounded border p-2">
          {questions.map((q) => (
            <button
              type="button"
              key={q.id}
              className="mb-1 block w-full rounded px-2 py-1 text-left text-sm hover:bg-muted"
              onClick={() =>
                setSelected((ids) => (ids.includes(q.id) ? ids : [...ids, q.id]))
              }
            >
              {q.title} · {QUESTION_TYPE_LABELS[q.question_type] ?? q.question_type}
            </button>
          ))}
        </div>
        <ol className="max-h-80 overflow-auto rounded border p-2">
          {selected.map((id, i) => {
            const q = questions.find((item) => item.id === id);
            return (
              <li key={id} className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span>
                  {i + 1}. {q?.title ?? id}
                </span>
                <span className="flex gap-1">
                  <Button size="small" onClick={() => move(id, -1)}>
                    Up
                  </Button>
                  <Button size="small" onClick={() => move(id, 1)}>
                    Down
                  </Button>
                  <Button size="small" onClick={() => setSelected((ids) => ids.filter((x) => x !== id))}>
                    Remove
                  </Button>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <Button type="primary" htmlType="submit" loading={saving}>
        Save test
      </Button>
    </Form>
  );
}
