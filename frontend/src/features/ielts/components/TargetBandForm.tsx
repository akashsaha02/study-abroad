"use client";

import { ieltsApi } from "@/features/ielts/api";
import { App, Button, Form, InputNumber } from "antd";
import { useState } from "react";

export function TargetBandForm({ initial }: { initial: number | null }) {
  const { message } = App.useApp();
  const [saving, setSaving] = useState(false);

  return (
    <Form
      layout="inline"
      initialValues={{ target_band: initial ?? 7 }}
      onFinish={async (values: { target_band: number }) => {
        setSaving(true);
        try {
          await ieltsApi.setTarget(values.target_band);
          message.success("Target band saved");
        } catch (err) {
          message.error(err instanceof Error ? err.message : "Could not save");
        } finally {
          setSaving(false);
        }
      }}
    >
      <Form.Item name="target_band" label="Target band">
        <InputNumber min={4} max={9} step={0.5} />
      </Form.Item>
      <Button htmlType="submit" loading={saving}>
        Save
      </Button>
    </Form>
  );
}
