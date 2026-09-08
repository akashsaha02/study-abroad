"use client";

import { ieltsApi } from "@/features/ielts/api";
import { loadLocalAttempt, saveLocalAttempt } from "@/features/ielts/offline";
import { cn } from "@/lib/utils";
import { Button, Input, Modal, Progress, Tag, Typography } from "antd";
import { SpeakingRecorder } from "@/features/ielts/components/SpeakingRecorder";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Question = {
  id: string;
  question_text: string;
  question_type: string;
  skill: string;
  options?: { id: string; text: string }[] | null;
  instructions?: string | null;
  prompt?: string | null;
  word_min?: number | null;
  cue_card?: { bullets?: string[]; topic?: string } | null;
  ielts_passages?: { title: string; body: string } | null;
  media?: { url?: string | null; kind?: string } | null;
  explanation?: string | null;
  correct_answer?: string | null;
};

type AnswerRow = {
  question_id: string;
  answer: unknown;
  flagged: boolean;
  time_spent_ms: number;
};

export function ExamWorkspace({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerRow>>({});
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState(false);
  const [highlight, setHighlight] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const started = useRef(Date.now());

  const load = useCallback(async () => {
    try {
      const data = (await ieltsApi.getAttempt(attemptId)) as {
        questions: Question[];
        attempt: {
          expires_at: string | null;
          status: string;
          ielts_attempt_answers: AnswerRow[];
        };
        review: boolean;
      };
      setQuestions(data.questions);
      setReview(data.review || data.attempt.status !== "in_progress");
      setExpiresAt(
        data.attempt.expires_at ? new Date(data.attempt.expires_at).getTime() : null
      );
      const map: Record<string, AnswerRow> = {};
      for (const row of data.attempt.ielts_attempt_answers ?? []) {
        map[row.question_id] = {
          question_id: row.question_id,
          answer: row.answer,
          flagged: row.flagged,
          time_spent_ms: row.time_spent_ms ?? 0,
        };
      }
      const local = await loadLocalAttempt<Record<string, AnswerRow>>(attemptId);
      setAnswers({ ...map, ...(local ?? {}) });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attempt");
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function onOnline() {
      setOffline(false);
    }
    function onOffline() {
      setOffline(true);
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    function warn(e: BeforeUnloadEvent) {
      if (!review) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [review]);

  const remaining = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : null;

  useEffect(() => {
    if (!review && remaining === 0) {
      void handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, review]);

  const current = questions[index];

  const persist = useCallback(
    async (next: Record<string, AnswerRow>) => {
      await saveLocalAttempt(attemptId, next);
      if (navigator.onLine) {
        try {
          await ieltsApi.saveAnswers(attemptId, Object.values(next));
        } catch {
          setOffline(true);
        }
      } else {
        setOffline(true);
      }
    },
    [attemptId]
  );

  function setAnswer(value: unknown) {
    if (!current || review) return;
    const next = {
      ...answers,
      [current.id]: {
        question_id: current.id,
        answer: value,
        flagged: answers[current.id]?.flagged ?? false,
        time_spent_ms: Date.now() - started.current,
      },
    };
    setAnswers(next);
    void persist(next);
  }

  function toggleFlag() {
    if (!current || review) return;
    const prev = answers[current.id];
    const next = {
      ...answers,
      [current.id]: {
        question_id: current.id,
        answer: prev?.answer ?? null,
        flagged: !prev?.flagged,
        time_spent_ms: prev?.time_spent_ms ?? 0,
      },
    };
    setAnswers(next);
    void persist(next);
  }

  async function handleSubmit(auto = false) {
    if (submitting || review) return;
    if (!auto) {
      const unanswered = questions.filter(
        (q) => answers[q.id]?.answer == null || answers[q.id]?.answer === ""
      ).length;
      const ok = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: "Submit test?",
          content: unanswered
            ? `${unanswered} question(s) are unanswered. You cannot change answers after submit.`
            : "You cannot change answers after submit.",
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      await ieltsApi.saveAnswers(attemptId, Object.values(answers));
      await ieltsApi.submit(attemptId);
      router.replace(`/dashboard/ielts/results/${attemptId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
      setSubmitting(false);
    }
  }

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => {
        const v = answers[q.id]?.answer;
        return v != null && v !== "";
      }).length,
    [answers, questions]
  );

  if (loading) return <p className="p-8 text-muted-foreground">Loading exam…</p>;
  if (error) return <p className="p-8 text-destructive">{error}</p>;
  if (!current) return <p className="p-8">No questions in this session.</p>;

  const passage = current.ielts_passages;
  const wordCount =
    typeof answers[current.id]?.answer === "string"
      ? String(answers[current.id]?.answer)
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {current.skill} · Question {index + 1} of {questions.length}
          </p>
          {remaining != null && (
            <p className={cn("font-mono text-lg", remaining < 60 && "text-destructive")}>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {offline && <Tag color="orange">Offline — answers stored locally</Tag>}
          <Progress
            percent={Math.round((answeredCount / questions.length) * 100)}
            size="small"
            className="w-32"
          />
          {!review && (
            <Button danger loading={submitting} onClick={() => void handleSubmit()}>
              Submit
            </Button>
          )}
        </div>
      </header>

      <div className="grid flex-1 gap-0 lg:grid-cols-2">
        {passage && (
          <article className="border-b p-4 lg:border-b-0 lg:border-r lg:p-6">
            <h2 className="mb-3 text-lg font-semibold">{passage.title}</h2>
            <div className="prose max-w-none whitespace-pre-wrap text-sm leading-7">
              {passage.body}
            </div>
            <label className="mt-4 block text-xs text-muted-foreground">
              Highlight notes
              <Input.TextArea
                className="mt-1"
                rows={3}
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
              />
            </label>
          </article>
        )}

        <section className={cn("p-4 lg:p-6", !passage && "lg:col-span-2")}>
          {current.media?.url && current.media.kind === "audio" && (
            <audio className="mb-4 w-full" controls src={current.media.url}>
              Your browser does not support audio.
            </audio>
          )}
          {current.instructions && (
            <p className="mb-2 text-sm text-muted-foreground">{current.instructions}</p>
          )}
          {current.prompt && <p className="mb-3 font-medium">{current.prompt}</p>}
          {current.cue_card && (
            <div className="mb-3 rounded-md border p-3">
              <p className="font-semibold">{current.cue_card.topic}</p>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {(current.cue_card.bullets ?? []).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          <Typography.Paragraph className="mb-4">
            {current.question_text}
          </Typography.Paragraph>

          {current.options?.length ? (
            <div className="space-y-2" role="radiogroup" aria-label="Answer choices">
              {current.options.map((opt) => {
                const selected = answers[current.id]?.answer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={review}
                    onClick={() => setAnswer(opt.id)}
                    className={cn(
                      "block w-full rounded-md border px-3 py-2 text-left",
                      selected && "border-primary bg-primary/5"
                    )}
                  >
                    <span className="mr-2 font-semibold">{opt.id}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          ) : current.skill === "writing" ? (
            <>
              <Input.TextArea
                rows={12}
                disabled={review}
                value={String(answers[current.id]?.answer ?? "")}
                onChange={(e) => setAnswer(e.target.value)}
                aria-label="Writing response"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Word count: {wordCount}
                {current.word_min ? ` (min ${current.word_min})` : ""}
              </p>
            </>
          ) : current.skill === "speaking" && userId ? (
            <SpeakingRecorder
              attemptId={attemptId}
              questionId={current.id}
              userId={userId}
            />
          ) : (
            <Input
              disabled={review}
              value={String(answers[current.id]?.answer ?? "")}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label="Your answer"
            />
          )}

          {review && current.correct_answer && (
            <div className="mt-4 rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <strong>Correct:</strong> {current.correct_answer}
              </p>
              {current.explanation && <p className="mt-2">{current.explanation}</p>}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              Previous
            </Button>
            <Button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={index === questions.length - 1}
            >
              Next
            </Button>
            {!review && (
              <Button onClick={toggleFlag}>
                {answers[current.id]?.flagged ? "Unflag" : "Flag"}
              </Button>
            )}
            <Button
              onClick={() =>
                void ieltsApi.bookmark(current.id).catch((err) => {
                  setError(err instanceof Error ? err.message : "Bookmark failed");
                })
              }
            >
              Bookmark
            </Button>
          </div>
        </section>
      </div>

      <nav className="sticky bottom-0 flex flex-wrap gap-1 border-t bg-card p-3" aria-label="Question navigator">
        {questions.map((q, i) => {
          const answered =
            answers[q.id]?.answer != null && answers[q.id]?.answer !== "";
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "min-w-8 rounded border px-1 text-xs",
                i === index && "border-primary",
                answered && "bg-emerald-100",
                answers[q.id]?.flagged && "ring-2 ring-amber-400"
              )}
              aria-label={`Question ${i + 1}${answered ? ", answered" : ", unanswered"}${
                answers[q.id]?.flagged ? ", flagged" : ""
              }`}
              aria-current={i === index ? "step" : undefined}
            >
              {i + 1}
              {answers[q.id]?.flagged ? "!" : answered ? "" : "·"}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
