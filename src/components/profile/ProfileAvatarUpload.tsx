"use client";

import { getInitials } from "@/lib/auth/nav-user";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { App, Avatar, Button, Upload } from "antd";
import type { UploadProps } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileAvatarUploadProps {
  userId: string;
  name: string;
  avatarUrl: string | null;
}

export function ProfileAvatarUpload({
  userId,
  name,
  avatarUrl: initialAvatarUrl,
}: ProfileAvatarUploadProps) {
  const t = useTranslations("dashboard");
  const { message } = App.useApp();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);

  async function saveAvatarUrl(url: string | null) {
    const res = await fetch("/api/student/profile/avatar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar_url: url }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Failed to save avatar");
    }
  }

  const uploadProps: UploadProps = {
    accept: "image/jpeg,image/png,image/webp,image/gif",
    showUploadList: false,
    disabled: uploading,
    beforeUpload: async (file) => {
      if (!file.type.startsWith("image/")) {
        message.error(t("avatarInvalidType"));
        return Upload.LIST_IGNORE;
      }
      if (file.size > 2 * 1024 * 1024) {
        message.error(t("avatarTooLarge"));
        return Upload.LIST_IGNORE;
      }

      setUploading(true);
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId}/avatar.${ext}`;
        const { publicUrl } = await uploadPublicFile(
          STORAGE_BUCKETS.profileAvatars,
          file,
          path
        );
        await saveAvatarUrl(publicUrl);
        setAvatarUrl(publicUrl);
        message.success(t("avatarUpdated"));
        router.refresh();
      } catch (err) {
        message.error(err instanceof Error ? err.message : t("avatarFailed"));
      } finally {
        setUploading(false);
      }
      return Upload.LIST_IGNORE;
    },
  };

  async function handleRemove() {
    setUploading(true);
    try {
      await saveAvatarUrl(null);
      setAvatarUrl(null);
      message.success(t("avatarRemoved"));
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("avatarFailed"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="relative">
        <Avatar
          size={96}
          src={avatarUrl ?? undefined}
          className="border-2 border-border bg-primary/10 text-xl font-semibold text-primary"
        >
          {getInitials(name)}
        </Avatar>
        <Upload {...uploadProps}>
          <button
            type="button"
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            aria-label={t("avatarUpload")}
          >
            <HugeiconsIcon icon={Camera01Icon} className="size-4" />
          </button>
        </Upload>
      </div>
      <div className="text-center sm:text-left">
        <p className="text-sm text-muted-foreground">{t("avatarDesc")}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Upload {...uploadProps}>
            <Button loading={uploading} size="small">
              {t("avatarUpload")}
            </Button>
          </Upload>
          {avatarUrl && (
            <Button size="small" danger loading={uploading} onClick={handleRemove}>
              {t("avatarRemove")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
