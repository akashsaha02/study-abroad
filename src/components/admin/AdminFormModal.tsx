"use client";

import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button, Modal } from "antd";

interface AdminFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  formId: string;
  saving?: boolean;
  children: React.ReactNode;
  width?: number;
}

export function AdminFormModal({
  open,
  title,
  onClose,
  formId,
  saving,
  children,
  width = 760,
}: AdminFormModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      width={width}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <SubmitButton form={formId} loading={saving}>
            Save
          </SubmitButton>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
    </Modal>
  );
}
