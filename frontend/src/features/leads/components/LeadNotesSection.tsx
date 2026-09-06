"use client";

import { App, Button, Input } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { parseApiError } from "@/components/admin/forms/api-error";
import type { Note } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface LeadNotesSectionProps {
  leadId: string;
  notes: Note[];
  authorNames: Record<string, string>;
}

export function LeadNotesSection({ leadId, notes, authorNames }: LeadNotesSectionProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Note["visibility"]>("internal");
  const [loading, setLoading] = useState(false);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, content: content.trim(), visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to add note"));
      setContent("");
      message.success("Note added");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Notes ({notes.length})</h3>
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border p-3 text-sm">
              <p className="whitespace-pre-wrap">{note.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {authorNames[note.author_id] ?? "Staff"} ·{" "}
                {new Date(note.created_at).toLocaleString()} · {note.visibility}
              </p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddNote} className="space-y-3">
        <Input.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-3">
          <AppSelect
            value={visibility}
            onChange={(value) => setVisibility(value as Note["visibility"])}
            size="middle"
            allowClear={false}
            aria-label="Note visibility"
            options={[
              { value: "internal", label: "Internal" },
              { value: "admin_only", label: "Admin only" },
              { value: "student_visible", label: "Student visible" },
            ]}
          />
          <Button htmlType="submit" size="small" disabled={loading || !content.trim()}>
            Add note
          </Button>
        </div>
      </form>
    </div>
  );
}
