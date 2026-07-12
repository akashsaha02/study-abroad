"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  country_id: string | null;
  sort_order: number | null;
  is_published: boolean;
}

interface FaqFormProps {
  countries: CountryOption[];
  initial?: Faq;
}

const FORM_ID = "faq-form";

export function FaqForm({ countries, initial }: FaqFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [countryId, setCountryId] = useState(initial?.country_id ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? "0");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        question,
        answer,
        category: category || null,
        country_id: countryId || null,
        sort_order: sortOrder ? Number(sortOrder) : 0,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/faqs/${initial!.id}` : "/api/admin/faqs",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save FAQ"));

      message.success(isEdit ? "FAQ updated" : "FAQ created");
      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit FAQ" : "New FAQ"}
      backHref="/admin/faqs"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4 p-6">
            <FormField label="Question" htmlFor="question" required>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Answer" htmlFor="answer" required>
              <Input.TextArea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                required
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category" htmlFor="category">
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </FormField>
              <FormField label="Country" htmlFor="country_id">
                <AppSelect
                  id="country_id"
                  value={countryId}
                  onChange={setCountryId}
                  placeholder="General"
                  size="middle"
                  options={countries.map((c) => ({ value: c.id, label: c.name }))}
                />
              </FormField>
              <FormField label="Sort order" htmlFor="sort_order">
                <Input
                  id="sort_order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </FormField>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published
            </label>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
