"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import type { ApplicationStep } from "@/types";
import { App, Button, Empty, Input } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface ApplicationStepsSectionProps {
  applicationId: string;
  steps: ApplicationStep[];
}

export function ApplicationStepsSection({
  applicationId,
  steps,
}: ApplicationStepsSectionProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/application-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: applicationId,
          title: title.trim(),
          description: description.trim() || null,
          sort_order: steps.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add step");
      setTitle("");
      setDescription("");
      message.success("Step added");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to add step");
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(stepId: string) {
    setCompletingId(stepId);
    try {
      const res = await fetch(`/api/admin/application-steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Failed to update step");
      message.success("Step marked complete");
      router.refresh();
    } catch {
      message.error("Failed to update step");
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      {steps.length === 0 ? (
        <Empty
          description="No custom steps yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-foreground/5 bg-muted/15 p-3"
            >
              <div className="flex min-w-0 gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{step.title}</p>
                    <StatusBadge status={step.status} />
                  </div>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                  {step.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Completed {new Date(step.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {step.status !== "completed" && (
                <Button
                  size="small"
                  type="primary"
                  ghost
                  disabled={completingId === step.id}
                  onClick={() => markComplete(step.id)}
                >
                  Mark complete
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleAddStep}
        className="space-y-3 rounded-xl border border-dashed border-foreground/15 bg-muted/10 p-4"
      >
        <p className="text-sm font-medium">Add a custom step</p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Step title"
          required
        />
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
        />
        <Button htmlType="submit" size="small" type="primary" disabled={loading || !title.trim()}>
          Add step
        </Button>
      </form>
    </div>
  );
}
