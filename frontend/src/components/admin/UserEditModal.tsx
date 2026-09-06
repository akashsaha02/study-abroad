"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { USER_ROLES } from "@/constants";
import { useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/types";
import { App, Form, Input, Modal, Switch } from "antd";
import { useEffect, useState } from "react";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  phone?: string | null;
}

interface UserEditModalProps {
  open: boolean;
  user: UserRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserEditModal({
  open,
  user,
  onClose,
  onSuccess,
}: UserEditModalProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    form.setFieldsValue({
      full_name: user.name === "—" ? "" : user.name,
      phone: user.phone ?? "",
      role: user.role,
      is_active: user.isActive,
    });
  }, [user, open, form]);

  async function handleSubmit() {
    if (!user) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update user");
      message.success("User updated");
      onSuccess();
      onClose();
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Edit user"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnHidden
      okText="Save"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item label="Email">
          <Input value={user?.email} disabled />
        </Form.Item>
        <Form.Item
          name="full_name"
          label="Full name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <AppSelect
            options={USER_ROLES.map((r) => ({
              value: r,
              label: r.replace(/_/g, " "),
            }))}
          />
        </Form.Item>
        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
