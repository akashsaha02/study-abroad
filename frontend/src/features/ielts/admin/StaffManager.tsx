"use client";

import { ieltsApi } from "@/features/ielts/api";
import { App, Button, Form, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";

type StaffRow = {
  profile_id: string;
  staff_role: string;
  profiles?: { full_name?: string; email?: string };
};

export function StaffManager() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<StaffRow[]>([]);

  async function load() {
    const data = (await ieltsApi.listStaff()) as StaffRow[];
    setRows(data);
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Assign counselors as IELTS editor, reviewer, or manager. They can open{" "}
        <strong>/admin/ielts</strong> without becoming platform admins.
      </p>
      <Form
        layout="inline"
        onFinish={async (values) => {
          try {
            await ieltsApi.addStaff(values);
            message.success("Contributor saved");
            await load();
          } catch (err) {
            message.error(err instanceof Error ? err.message : "Failed");
          }
        }}
      >
        <Form.Item name="profile_id" rules={[{ required: true }]} label="Profile UUID">
          <Input className="w-72" />
        </Form.Item>
        <Form.Item name="staff_role" label="Role" initialValue="editor">
          <Select
            className="w-40"
            options={["editor", "reviewer", "manager"].map((s) => ({
              value: s,
              label: s,
            }))}
          />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Add
        </Button>
      </Form>
      <Table
        rowKey="profile_id"
        dataSource={rows}
        columns={[
          {
            title: "Name",
            render: (_: unknown, r: StaffRow) => r.profiles?.full_name ?? r.profile_id,
          },
          { title: "Email", render: (_: unknown, r: StaffRow) => r.profiles?.email },
          { title: "Role", dataIndex: "staff_role" },
          {
            title: "",
            render: (_: unknown, r: StaffRow) => (
              <Button
                size="small"
                danger
                onClick={() =>
                  void ieltsApi.removeStaff(r.profile_id).then(() => load())
                }
              >
                Remove
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
