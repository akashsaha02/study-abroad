"use client";

import { selectClassName } from "@/components/admin/forms/select-class";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LeadNotesSectionProps {
  leadId: string;
  notes: Note[];
  authorNames: Record<string, string>;
}

export function LeadNotesSection({ leadId, notes, authorNames }: LeadNotesSectionProps) {
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
      if (!res.ok) throw new Error(data.error ?? "Failed to add note");
      setContent("");
      toast.success("Note added");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add note");
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
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          rows={3}
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Note["visibility"])}
            className={selectClassName}
            aria-label="Note visibility"
          >
            <option value="internal">Internal</option>
            <option value="admin_only">Admin only</option>
            <option value="student_visible">Student visible</option>
          </select>
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            Add note
          </Button>
        </div>
      </form>
    </div>
  );
}
