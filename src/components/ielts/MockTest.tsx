"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LISTENING_QUESTIONS,
  READING_PASSAGE,
  READING_QUESTIONS,
  WRITING_TASK,
  type MockQuestion,
} from "@/data/ielts";
import {
  Cancel01Icon,
  Clock01Icon,
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Section = "reading" | "listening" | "writing";

const SECTIONS: { key: Section; label: string; minutes: number }[] = [
  { key: "listening", label: "Listening", minutes: 30 },
  { key: "reading", label: "Reading", minutes: 60 },
  { key: "writing", label: "Writing", minutes: 60 },
];

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function MockTest() {
  const [section, setSection] = useState<Section>("listening");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(30 * 60);

  function changeSection(key: Section) {
    const meta = SECTIONS.find((s) => s.key === key)!;
    setSection(key);
    setRemaining(meta.minutes * 60);
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [section]);

  const totalQuestions = READING_QUESTIONS.length + LISTENING_QUESTIONS.length;
  const answeredCount = Object.values(answers).filter((v) => v.trim()).length;

  function setAnswer(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  const lowTime = remaining <= 60;

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-background">
      {/* Exam top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-semibold sm:inline">
            IELTS Academic — Mock Test
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">Mock Test</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-4xl border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors",
            lowTime
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border bg-muted/50"
          )}
          aria-live="polite"
        >
          <HugeiconsIcon icon={Clock01Icon} className="size-4" />
          {formatTime(remaining)}
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link href="/ielts">
            <HugeiconsIcon
              icon={Cancel01Icon}
              className="size-4"
              data-icon="inline-start"
            />
            Exit
          </Link>
        </Button>
      </header>

      {/* Section switcher */}
      <div className="flex shrink-0 items-center gap-1 border-b bg-card px-3 py-2 sm:px-5">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => changeSection(s.key)}
            className={cn(
              "rounded-4xl px-3 py-1.5 text-sm font-medium transition-colors",
              section === s.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-current={section === s.key}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {section === "reading" && (
          <ReadingSection answers={answers} setAnswer={setAnswer} />
        )}
        {section === "listening" && (
          <ListeningSection answers={answers} setAnswer={setAnswer} />
        )}
        {section === "writing" && (
          <WritingSection
            value={answers.writing ?? ""}
            onChange={(v) => setAnswer("writing", v)}
          />
        )}
      </div>

      {/* Bottom bar */}
      <footer className="flex h-14 shrink-0 items-center justify-between border-t bg-card px-3 sm:px-5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{answeredCount}</span>{" "}
          of {totalQuestions} questions answered
        </p>
        <Button size="sm">Submit test</Button>
      </footer>
    </div>
  );
}

/* -------------------- Reading (split-screen) -------------------- */

function ReadingSection({
  answers,
  setAnswer,
}: {
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
}) {
  return (
    <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-1">
      <div className="overflow-y-auto border-b p-5 md:border-b-0 md:border-r md:p-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reading Passage 1
        </p>
        <h2 className="mb-4 text-xl font-bold">{READING_PASSAGE.title}</h2>
        <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
          {READING_PASSAGE.paragraphs.map((p, i) => (
            <p key={i}>
              <span className="mr-2 font-semibold text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto p-5 md:p-8">
        <p className="mb-4 text-sm text-muted-foreground">
          Questions 1–{READING_QUESTIONS.length}. Complete each answer using
          information from the passage.
        </p>
        <div className="space-y-5">
          {READING_QUESTIONS.map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => setAnswer(q.id, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Listening (player + answer sheet) -------------------- */

function ListeningSection({
  answers,
  setAnswer,
}: {
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <AudioPlayer durationSeconds={212} />
      <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-sm text-muted-foreground">
            Section 1. Listen and complete questions 1–{LISTENING_QUESTIONS.length}.
            You will hear the recording once.
          </p>
          <div className="space-y-5">
            {LISTENING_QUESTIONS.map((q) => (
              <QuestionField
                key={q.id}
                question={q}
                value={answers[q.id] ?? ""}
                onChange={(v) => setAnswer(q.id, v)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({ durationSeconds }: { durationSeconds: number }) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(80);
  const rafRef = useRef<number | null>(null);

  // Simulated playback: in production, swap this for a real <audio> element
  // bound to the exam's listening track.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setCurrent((c) => {
        const next = c + delta;
        if (next >= durationSeconds) {
          setPlaying(false);
          return durationSeconds;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, durationSeconds]);

  const pct = (current / durationSeconds) * 100;

  return (
    <div className="shrink-0 border-b bg-muted/30 px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <Button
          size="icon"
          onClick={() => {
            if (current >= durationSeconds) setCurrent(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} className="size-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-xs tabular-nums text-muted-foreground">
            <span>Listening Section 1</span>
            <span>
              {formatTime(current)} / {formatTime(durationSeconds)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={durationSeconds}
            step={1}
            value={Math.floor(current)}
            onChange={(e) => setCurrent(Number(e.target.value))}
            className="w-full accent-primary"
            aria-label="Seek audio"
            style={{
              background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)`,
            }}
          />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <HugeiconsIcon
            icon={VolumeHighIcon}
            className="size-4 text-muted-foreground"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-primary"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------- Writing (split-screen) -------------------- */

function WritingSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const wordCount = useMemo(
    () => (value.trim() ? value.trim().split(/\s+/).length : 0),
    [value]
  );
  const metMin = wordCount >= WRITING_TASK.minWords;

  return (
    <div className="grid h-full grid-rows-2 md:grid-cols-[minmax(0,420px)_1fr] md:grid-rows-1">
      <div className="overflow-y-auto border-b bg-muted/20 p-5 md:border-b-0 md:border-r md:p-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {WRITING_TASK.title}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          You should spend about 40 minutes on this task.
        </p>
        <p className="text-sm leading-relaxed">{WRITING_TASK.prompt}</p>
      </div>

      <div className="flex min-h-0 flex-col p-5 md:p-8">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your response here…"
          className="min-h-0 flex-1 resize-none rounded-xl border border-input bg-transparent p-4 text-sm leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          spellCheck
        />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span
            className={cn(
              "font-medium",
              metMin ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          >
            {wordCount} words
            {!metMin && ` · ${WRITING_TASK.minWords} minimum`}
          </span>
          {metMin && (
            <span className="text-emerald-600 dark:text-emerald-400">
              Minimum reached
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Shared question field -------------------- */

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: MockQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-2 text-sm">
        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {question.number}
        </span>
        {question.prompt}
      </p>
      {question.type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      ) : (
        <div className="space-y-1.5">
          {question.options?.map((opt) => (
            <label
              key={opt}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                value === opt
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-muted/60"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="size-4 accent-primary"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
