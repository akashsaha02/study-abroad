"use client";

import { useRouter } from "@/i18n/navigation";
import { Button, Modal, App } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AdminDeleteButtonProps {
  apiUrl: string;
  label?: string;
  itemName?: string;
}

export function AdminDeleteButton({
  apiUrl,
  label,
  itemName,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("deleteFailed"));
      message.success(t("deleted"));
      setOpen(false);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("deleteFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button danger size="small" onClick={() => setOpen(true)}>
        {label ?? t("delete")}
      </Button>
      <Modal
        title={t("confirmDeletion")}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)} disabled={loading}>
            {t("cancel")}
          </Button>,
          <Button
            key="delete"
            danger
            loading={loading}
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>,
        ]}
      >
        {t("confirmDeleteMessage", {
          item: itemName ?? t("thisItem"),
        })}
      </Modal>
    </>
  );
}
