"use client";

import { App, Card, Input, InputNumber } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { FormField } from "@/components/forms/FormField";
import type { Service } from "@/types";
import { finishAdminSave, type AdminFormBaseProps } from "@/lib/admin/form-utils";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface ServiceFormProps extends AdminFormBaseProps {
  initial?: Service;
}

const FORM_ID = "service-form";

export function ServiceForm({
  initial,
  variant = "page",
  onSuccess,
  onClose,
  onSavingChange,
}: ServiceFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(Number(initial?.price ?? 0));
  const [discountPercent, setDiscountPercent] = useState(
    Number(initial?.discount_percent ?? 0)
  );
  const [sortOrder, setSortOrder] = useState(Number(initial?.sort_order ?? 0));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    onSavingChange?.(true);

    try {
      const payload = {
        title,
        slug,
        description: description || null,
        price,
        discount_percent: discountPercent,
        sort_order: sortOrder,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/services/${initial!.id}` : "/api/admin/services",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save service"));

      message.success(isEdit ? "Service updated" : "Service created");
      finishAdminSave(router, {
        variant,
        onSuccess,
        onClose,
        backHref: "/admin/services",
      });
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
      onSavingChange?.(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit service" : "New service"}
      backHref="/admin/services"
      formId={FORM_ID}
      saving={loading}
      variant={variant}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="grid gap-4 p-6 md:grid-cols-2">
            <FormField label="Title" htmlFor="title" required className="md:col-span-2">
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </FormField>
            <SlugField title={title} value={slug} onChange={setSlug} />
            <FormField label="Sort order" htmlFor="sort_order">
              <InputNumber
                id="sort_order"
                className="w-full"
                value={sortOrder}
                onChange={(v) => setSortOrder(Number(v ?? 0))}
              />
            </FormField>
            <FormField label="Price (BDT)" htmlFor="price">
              <InputNumber
                id="price"
                className="w-full"
                min={0}
                value={price}
                onChange={(v) => setPrice(Number(v ?? 0))}
              />
            </FormField>
            <FormField label="Discount %" htmlFor="discount_percent">
              <InputNumber
                id="discount_percent"
                className="w-full"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(v) => setDiscountPercent(Number(v ?? 0))}
              />
            </FormField>
            <FormField label="Description" htmlFor="description" className="md:col-span-2">
              <Input.TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </FormField>
            <FormField label="Published" htmlFor="is_published">
              <label className="flex items-center gap-2 text-sm">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                Visible on public site
              </label>
            </FormField>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
