"use client";

import { ieltsApi } from "@/features/ielts/api";
import { IELTS_MODULE_TYPES, IELTS_SKILLS, QUESTION_TYPE_LABELS } from "@abroadly/shared/ielts";
import { App, Button, Form, Select } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function PracticeStartForm({
  defaults,
}: {
  defaults?: { skill?: string; question_type?: string; difficulty?: string };
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  return (
    <Form
      layout="vertical"
      initialValues={{
        skill: defaults?.skill ?? "reading",
        question_type: defaults?.question_type,
        difficulty: defaults?.difficulty,
        ielts_type: "academic",
        limit: 10,
      }}
      onFinish={async (values) => {
        setLoading(true);
        try {
          const data = (await ieltsApi.startPractice(values)) as {
            attempt: { id: string };
          };
          router.push(`/dashboard/ielts/attempts/${data.attempt.id}`);
        } catch (err) {
          message.error(err instanceof Error ? err.message : "Could not start");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Form.Item name="skill" label="Skill">
        <Select options={IELTS_SKILLS.map((s) => ({ value: s, label: s }))} />
      </Form.Item>
      <Form.Item name="ielts_type" label="Academic / General">
        <Select
          allowClear
          options={IELTS_MODULE_TYPES.map((s) => ({ value: s, label: s }))}
        />
      </Form.Item>
      <Form.Item name="question_type" label="Question type">
        <Select
          allowClear
          options={Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Form.Item>
      <Form.Item name="difficulty" label="Difficulty">
        <Select
          allowClear
          options={["easy", "medium", "hard"].map((s) => ({ value: s, label: s }))}
        />
      </Form.Item>
      <Form.Item name="limit" label="Number of questions">
        <Select
          options={[5, 10, 20].map((n) => ({ value: n, label: String(n) }))}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Start practice
      </Button>
    </Form>
  );
}
