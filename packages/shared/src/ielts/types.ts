import {
  IELTS_ATTEMPT_KINDS,
  IELTS_ATTEMPT_STATUSES,
  IELTS_CONTENT_STATUSES,
  IELTS_DIFFICULTIES,
  IELTS_EVALUATION_STATUSES,
  IELTS_MODULE_TYPES,
  IELTS_QUESTION_TYPES,
  IELTS_REVIEW_POLICIES,
  IELTS_SKILLS,
  IELTS_STAFF_ROLES,
  IELTS_TEST_KINDS,
  IELTS_VISIBILITIES,
} from "./constants";

export type IeltsSkill = (typeof IELTS_SKILLS)[number];
export type IeltsModuleType = (typeof IELTS_MODULE_TYPES)[number];
export type IeltsDifficulty = (typeof IELTS_DIFFICULTIES)[number];
export type IeltsContentStatus = (typeof IELTS_CONTENT_STATUSES)[number];
export type IeltsTestKind = (typeof IELTS_TEST_KINDS)[number];
export type IeltsVisibility = (typeof IELTS_VISIBILITIES)[number];
export type IeltsReviewPolicy = (typeof IELTS_REVIEW_POLICIES)[number];
export type IeltsAttemptStatus = (typeof IELTS_ATTEMPT_STATUSES)[number];
export type IeltsAttemptKind = (typeof IELTS_ATTEMPT_KINDS)[number];
export type IeltsQuestionType = (typeof IELTS_QUESTION_TYPES)[number];
export type IeltsStaffRole = (typeof IELTS_STAFF_ROLES)[number];
export type IeltsEvaluationStatus = (typeof IELTS_EVALUATION_STATUSES)[number];

export interface IeltsQuestionOption {
  id: string;
  text: string;
}

export interface IeltsQuestion {
  id: string;
  title: string;
  skill: IeltsSkill;
  ielts_type: IeltsModuleType;
  section: string | null;
  question_type: string;
  difficulty: IeltsDifficulty;
  passage_id: string | null;
  media_id: string | null;
  instructions: string | null;
  question_text: string;
  prompt: string | null;
  options: IeltsQuestionOption[] | null;
  correct_answer: string | null;
  accepted_answers: string[] | null;
  explanation: string | null;
  marks: number;
  tags: string[];
  source: string | null;
  status: IeltsContentStatus;
  word_min: number | null;
  word_max: number | null;
  suggested_minutes: number | null;
  cue_card: Record<string, unknown> | null;
  created_by: string | null;
  updated_by: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface IeltsPassage {
  id: string;
  title: string;
  body: string;
  skill: IeltsSkill;
  ielts_type: IeltsModuleType;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IeltsMedia {
  id: string;
  bucket: string;
  path: string;
  kind: "audio" | "image" | "diagram";
  mime_type: string | null;
  duration_ms: number | null;
  created_by: string | null;
  created_at: string;
}

export interface IeltsTest {
  id: string;
  title: string;
  description: string | null;
  ielts_type: IeltsModuleType;
  kind: IeltsTestKind;
  skill: IeltsSkill | null;
  duration_seconds: number;
  attempt_limit: number | null;
  visibility: IeltsVisibility;
  review_policy: IeltsReviewPolicy;
  allow_audio_replay: boolean;
  status: IeltsContentStatus;
  published_at: string | null;
  ends_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface IeltsTestSection {
  id: string;
  test_id: string;
  skill: IeltsSkill;
  title: string;
  sort_order: number;
  duration_seconds: number | null;
  passage_id: string | null;
  media_id: string | null;
}

export interface IeltsTestQuestion {
  id: string;
  test_id: string;
  section_id: string | null;
  question_id: string;
  sort_order: number;
}

export interface IeltsAttempt {
  id: string;
  user_id: string;
  test_id: string | null;
  kind: IeltsAttemptKind;
  status: IeltsAttemptStatus;
  started_at: string;
  submitted_at: string | null;
  expires_at: string | null;
  duration_seconds: number | null;
  raw_score: number | null;
  max_score: number | null;
  estimated_band: number | null;
  section_scores: Record<string, unknown> | null;
  practice_filters: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface IeltsAttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  answer: unknown;
  is_correct: boolean | null;
  marks_awarded: number | null;
  time_spent_ms: number;
  flagged: boolean;
  answered_at: string | null;
}

export interface IeltsStudentSettings {
  user_id: string;
  target_band: number | null;
  updated_at: string;
}
