"use client";

import { App, Button, Input } from "antd";
import type { ApplicationStep } from "@/types";
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
    <div className="space-y-4">
      <h3 className="font-semibold">Application Steps ({steps.length})</h3>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No steps yet.</p>
      ) : (
        <ul className="space-y-2">
          {steps.map((step) => (
            <li
              key={step.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{step.title}</p>
                {step.description && (
                  <p className="text-muted-foreground">{step.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Status: {step.status}
                  {step.completed_at &&
                    ` · Completed ${new Date(step.completed_at).toLocaleDateString()}`}
                </p>
              </div>
              {step.status !== "completed" && (
                <Button
                  size="small"
                  
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
      <form onSubmit={handleAddStep} className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium">Add step</p>
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
        <Button htmlType="submit" size="small" disabled={loading || !title.trim()}>
          Add step
        </Button>
      </form>
    </div>
  );
}
