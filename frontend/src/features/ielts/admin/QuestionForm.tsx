"use client";

import { ieltsApi } from "@/features/ielts/api";
import {
  IELTS_DIFFICULTIES,
  IELTS_MODULE_TYPES,
  IELTS_QUESTION_TYPES,
  IELTS_SKILLS,
  IELTS_STORAGE_BUCKETS,
  QUESTION_TYPE_LABELS,
} from "@abroadly/shared/ielts";
import { createClient } from "@/lib/supabase/client";
import { App, Button, Form, Input, InputNumber, Select } from "antd";
import { useState } from "react";

type Initial = Record<string, unknown> | undefined;

export function IeltsQuestionForm({
  initial,
  onSaved,
}: {
  initial?: Initial;
  onSaved?: () => void;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const skill = Form.useWatch("skill", form) ?? initial?.skill ?? "reading";

  async function uploadAudio(file: File) {
    const supabase = createClient();
    const path = `audio/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from(IELTS_STORAGE_BUCKETS.media)
      .upload(path, file);
    if (error) throw error;
    const media = await ieltsApi.registerMedia({
      path,
      kind: "audio",
      mime_type: file.type,
    });
    form.setFieldValue("media_id", (media as { id: string }).id);
    message.success("Audio uploaded");
  }

  async function uploadImage(file: File) {
    const supabase = createClient();
    const path = `images/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from(IELTS_STORAGE_BUCKETS.media)
      .upload(path, file);
    if (error) throw error;
    const media = await ieltsApi.registerMedia({
      path,
      kind: "image",
      mime_type: file.type,
    });
    form.setFieldValue("media_id", (media as { id: string }).id);
    message.success("Image uploaded");
  }

  async function onFinish(values: Record<string, unknown>) {
    setSaving(true);
    try {
      const options = ["A", "B", "C", "D"]
        .map((id) => {
          const text = String(values[`option_${id}`] ?? "").trim();
          return text ? { id, text } : null;
        })
        .filter(Boolean);
      const payload = {
        title: values.title,
        skill: values.skill,
        ielts_type: values.ielts_type,
        question_type: values.question_type,
        difficulty: values.difficulty,
        instructions: values.instructions,
        passage: values.passage,
        passage_title: values.passage_title,
        question_text: values.question_text,
        prompt: values.prompt,
        correct_answer: values.correct_answer,
        accepted_answers: String(values.accepted_answers ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        explanation: values.explanation,
        tags: String(values.tags ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: values.status ?? "draft",
        options: options.length ? options : null,
        media_id: values.media_id ? values.media_id : null,
        word_min: values.word_min,
        suggested_minutes: values.suggested_minutes,
      };
      if (initial?.id) await ieltsApi.updateQuestion(String(initial.id), payload);
      else await ieltsApi.createQuestion(payload);
      message.success("Question saved");
      onSaved?.();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        skill: "reading",
        ielts_type: "academic",
        difficulty: "medium",
        question_type: "multiple_choice",
        status: "draft",
        ...initial,
        accepted_answers: Array.isArray(initial?.accepted_answers)
          ? (initial.accepted_answers as string[]).join(", ")
          : "",
        tags: Array.isArray(initial?.tags) ? (initial.tags as string[]).join(", ") : "",
        option_A: (initial?.options as { id: string; text: string }[] | undefined)?.find(
          (o) => o.id === "A"
        )?.text,
        option_B: (initial?.options as { id: string; text: string }[] | undefined)?.find(
          (o) => o.id === "B"
        )?.text,
        option_C: (initial?.options as { id: string; text: string }[] | undefined)?.find(
          (o) => o.id === "C"
        )?.text,
        option_D: (initial?.options as { id: string; text: string }[] | undefined)?.find(
          (o) => o.id === "D"
        )?.text,
      }}
      onFinish={onFinish}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="skill" label="Skill" rules={[{ required: true }]}>
          <Select options={IELTS_SKILLS.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="ielts_type" label="Module">
          <Select options={IELTS_MODULE_TYPES.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="question_type" label="Question type" rules={[{ required: true }]}>
          <Select
            options={IELTS_QUESTION_TYPES.map((s) => ({
              value: s,
              label: QUESTION_TYPE_LABELS[s] ?? s,
            }))}
          />
        </Form.Item>
        <Form.Item name="difficulty" label="Difficulty">
          <Select options={IELTS_DIFFICULTIES.map((s) => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item name="correct_answer" label="Correct answer">
          <Input />
        </Form.Item>
      </div>
      <Form.Item name="question_text" label="Question" rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      {(skill === "reading" || skill === "listening") && (
        <>
          <Form.Item name="passage_title" label="Passage title">
            <Input />
          </Form.Item>
          <Form.Item name="passage" label="Passage">
            <Input.TextArea rows={6} />
          </Form.Item>
        </>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item name="option_A" label="Option A">
          <Input />
        </Form.Item>
        <Form.Item name="option_B" label="Option B">
          <Input />
        </Form.Item>
        <Form.Item name="option_C" label="Option C">
          <Input />
        </Form.Item>
        <Form.Item name="option_D" label="Option D">
          <Input />
        </Form.Item>
      </div>
      <Form.Item name="accepted_answers" label="Accepted answers (comma separated)">
        <Input />
      </Form.Item>
      <Form.Item name="explanation" label="Explanation">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="tags" label="Tags">
        <Input placeholder="matching headings, environment" />
      </Form.Item>
      <Form.Item name="instructions" label="Instructions">
        <Input />
      </Form.Item>
      <Form.Item name="prompt" label="Writing / speaking prompt">
        <Input.TextArea rows={3} />
      </Form.Item>
      <div className="grid gap-3 md:grid-cols-3">
        <Form.Item name="word_min" label="Min words">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="suggested_minutes" label="Suggested minutes">
          <InputNumber className="w-full" min={1} />
        </Form.Item>
        <Form.Item name="media_id" label="Audio media id">
          <Input />
        </Form.Item>
      </div>
      {skill === "listening" && (
        <input
          type="file"
          accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/webm"
          aria-label="Upload listening audio"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadAudio(file);
          }}
        />
      )}
      {(skill === "writing" || skill === "reading") && (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          aria-label="Upload diagram or chart"
          className="mt-3 block"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadImage(file);
          }}
        />
      )}
      <Form.Item name="status" label="Status">
        <Select
          options={["draft", "review", "published"].map((s) => ({ value: s, label: s }))}
        />
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={saving}>
        Save question
      </Button>
    </Form>
  );
}
