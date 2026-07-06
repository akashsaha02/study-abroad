"use client";

import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SendNotificationFormProps {
  userId: string;
}

export function SendNotificationForm({ userId }: SendNotificationFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title: title.trim(),
          message: message.trim(),
          type: type.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send notification");
      setTitle("");
      setMessage("");
      setType("");
      toast.success("Notification sent");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold">Send Notification</h3>
      <FormField label="Title" htmlFor="notif_title" required>
        <Input
          id="notif_title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Message" htmlFor="notif_message" required>
        <Textarea
          id="notif_message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
        />
      </FormField>
      <FormField label="Type" htmlFor="notif_type">
        <Input
          id="notif_type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="e.g. reminder"
        />
      </FormField>
      <Button type="submit" disabled={loading || !title.trim() || !message.trim()}>
        Send notification
      </Button>
    </form>
  );
}
