import { z } from "zod";
import {
  IELTS_CONTENT_STATUSES,
  IELTS_DIFFICULTIES,
  IELTS_MODULE_TYPES,
  IELTS_QUESTION_TYPES,
  IELTS_REVIEW_POLICIES,
  IELTS_SKILLS,
  IELTS_STAFF_ROLES,
  IELTS_TEST_KINDS,
  IELTS_VISIBILITIES,
} from "../ielts/constants";

export const ieltsQuestionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const ieltsQuestionSchema = z.object({
  title: z.string().min(1).max(240),
  skill: z.enum(IELTS_SKILLS),
  ielts_type: z.enum(IELTS_MODULE_TYPES).default("academic"),
  section: z.string().max(80).optional().nullable(),
  question_type: z.string().min(1),
  difficulty: z.enum(IELTS_DIFFICULTIES).default("medium"),
  passage_id: z.string().uuid().optional().nullable(),
  passage: z.string().optional().nullable(),
  passage_title: z.string().optional().nullable(),
  media_id: z.string().uuid().optional().nullable(),
  instructions: z.string().optional().nullable(),
  question_text: z.string().min(1),
  prompt: z.string().optional().nullable(),
  options: z.array(ieltsQuestionOptionSchema).optional().nullable(),
  correct_answer: z.string().optional().nullable(),
  accepted_answers: z.array(z.string()).optional().nullable(),
  explanation: z.string().optional().nullable(),
  marks: z.number().int().positive().default(1),
  tags: z.array(z.string()).default([]),
  source: z.string().optional().nullable(),
  status: z.enum(IELTS_CONTENT_STATUSES).default("draft"),
  word_min: z.number().int().positive().optional().nullable(),
  word_max: z.number().int().positive().optional().nullable(),
  suggested_minutes: z.number().int().positive().optional().nullable(),
  cue_card: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const ieltsQuestionUpdateSchema = ieltsQuestionSchema.partial();

export const ieltsTestSchema = z.object({
  title: z.string().min(1).max(240),
  description: z.string().optional().nullable(),
  ielts_type: z.enum(IELTS_MODULE_TYPES).default("academic"),
  kind: z.enum(IELTS_TEST_KINDS).default("skill"),
  skill: z.enum(IELTS_SKILLS).optional().nullable(),
  duration_seconds: z.number().int().positive().default(3600),
  attempt_limit: z.number().int().positive().optional().nullable(),
  visibility: z.enum(IELTS_VISIBILITIES).default("students"),
  review_policy: z.enum(IELTS_REVIEW_POLICIES).default("after_submit"),
  allow_audio_replay: z.boolean().default(true),
  status: z.enum(IELTS_CONTENT_STATUSES).default("draft"),
  published_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
  sections: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        skill: z.enum(IELTS_SKILLS),
        title: z.string().min(1),
        sort_order: z.number().int().nonnegative().default(0),
        duration_seconds: z.number().int().positive().optional().nullable(),
        passage_id: z.string().uuid().optional().nullable(),
        media_id: z.string().uuid().optional().nullable(),
        question_ids: z.array(z.string().uuid()).default([]),
      })
    )
    .default([]),
});

export const ieltsTestUpdateSchema = ieltsTestSchema.partial();

export const ieltsPracticeStartSchema = z.object({
  skill: z.enum(IELTS_SKILLS),
  question_type: z.string().optional(),
  difficulty: z.enum(IELTS_DIFFICULTIES).optional(),
  ielts_type: z.enum(IELTS_MODULE_TYPES).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(40).default(10),
  reveal: z.enum(["end", "immediate"]).default("end"),
});

export const ieltsAnswerSaveSchema = z.object({
  question_id: z.string().uuid(),
  answer: z.unknown().optional().nullable(),
  flagged: z.boolean().optional(),
  time_spent_ms: z.number().int().nonnegative().optional(),
});

export const ieltsAttemptSaveSchema = z.object({
  answers: z.array(ieltsAnswerSaveSchema).default([]),
});

export const ieltsStaffSchema = z.object({
  profile_id: z.string().uuid(),
  staff_role: z.enum(IELTS_STAFF_ROLES),
});

export const ieltsTargetBandSchema = z.object({
  target_band: z.number().min(4).max(9).nullable(),
});

export const ieltsEvaluationSchema = z.object({
  band: z.number().min(0).max(9).optional().nullable(),
  feedback: z.string().optional().nullable(),
  evaluation_status: z.enum(["pending", "manual", "completed"]).default("manual"),
});

export const ieltsReportSchema = z.object({
  message: z.string().min(4).max(2000),
});

export const IELTS_QUESTION_TYPE_SET = new Set<string>(IELTS_QUESTION_TYPES);

export type IeltsQuestionInput = z.infer<typeof ieltsQuestionSchema>;
export type IeltsTestInput = z.infer<typeof ieltsTestSchema>;
export type IeltsPracticeStartInput = z.infer<typeof ieltsPracticeStartSchema>;
