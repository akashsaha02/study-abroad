/**
 * Extension point for future AI or teacher scoring.
 * Returns pending until a real evaluator is wired.
 */
export const WritingEvaluationService = {
  async evaluate(_input: {
    prompt?: string | null;
    content: string;
    wordCount: number;
  }) {
    void _input;
    return {
      status: "pending" as const,
      band: null as number | null,
      notes: null as string | null,
    };
  },
};

export const SpeakingEvaluationService = {
  async evaluate(_input: { durationMs?: number | null; storagePath?: string | null }) {
    void _input;
    return {
      status: "pending" as const,
      band: null as number | null,
      notes: null as string | null,
    };
  },
};
