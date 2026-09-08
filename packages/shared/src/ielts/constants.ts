export const IELTS_SKILLS = [
  "listening",
  "reading",
  "writing",
  "speaking",
] as const;

export const IELTS_MODULE_TYPES = ["academic", "general", "both"] as const;

export const IELTS_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export const IELTS_CONTENT_STATUSES = [
  "draft",
  "review",
  "published",
  "archived",
] as const;

export const IELTS_TEST_KINDS = ["full", "skill", "practice"] as const;

export const IELTS_VISIBILITIES = ["public", "students", "hidden"] as const;

export const IELTS_REVIEW_POLICIES = [
  "immediate",
  "after_submit",
  "never",
] as const;

export const IELTS_ATTEMPT_STATUSES = [
  "not_started",
  "in_progress",
  "submitted",
  "evaluating",
  "completed",
  "expired",
] as const;

export const IELTS_ATTEMPT_KINDS = ["practice", "mock", "skill_test"] as const;

export const IELTS_STAFF_ROLES = ["manager", "editor", "reviewer"] as const;

export const IELTS_EVALUATION_STATUSES = [
  "pending",
  "manual",
  "completed",
] as const;

export const IELTS_READING_QUESTION_TYPES = [
  "multiple_choice",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_headings",
  "matching_information",
  "matching_features",
  "sentence_completion",
  "summary_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "diagram_label_completion",
  "short_answer",
] as const;

export const IELTS_LISTENING_QUESTION_TYPES = [
  "multiple_choice",
  "matching",
  "plan_map_diagram_labelling",
  "form_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "sentence_completion",
  "short_answer",
] as const;

export const IELTS_WRITING_QUESTION_TYPES = [
  "academic_task_1",
  "general_task_1",
  "task_2",
] as const;

export const IELTS_SPEAKING_QUESTION_TYPES = [
  "part_1",
  "part_2_cue_card",
  "part_3",
] as const;

export const IELTS_QUESTION_TYPES = [
  "multiple_choice",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_headings",
  "matching_information",
  "matching_features",
  "matching",
  "sentence_completion",
  "summary_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "diagram_label_completion",
  "plan_map_diagram_labelling",
  "form_completion",
  "short_answer",
  "academic_task_1",
  "general_task_1",
  "task_2",
  "part_1",
  "part_2_cue_card",
  "part_3",
] as const;

export const OBJECTIVE_SKILLS = ["listening", "reading"] as const;

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  true_false_not_given: "True / False / Not Given",
  yes_no_not_given: "Yes / No / Not Given",
  matching_headings: "Matching Headings",
  matching_information: "Matching Information",
  matching_features: "Matching Features",
  matching: "Matching",
  sentence_completion: "Sentence Completion",
  summary_completion: "Summary Completion",
  note_completion: "Note Completion",
  table_completion: "Table Completion",
  flow_chart_completion: "Flow-chart Completion",
  diagram_label_completion: "Diagram Label Completion",
  plan_map_diagram_labelling: "Plan / Map / Diagram Labelling",
  form_completion: "Form Completion",
  short_answer: "Short Answer",
  academic_task_1: "Academic Task 1",
  general_task_1: "General Task 1",
  task_2: "Task 2",
  part_1: "Part 1",
  part_2_cue_card: "Part 2 Cue Card",
  part_3: "Part 3",
};

export const IELTS_PERMISSIONS = [
  "ielts.view",
  "ielts.questions.create",
  "ielts.questions.edit",
  "ielts.questions.review",
  "ielts.questions.publish",
  "ielts.questions.delete",
  "ielts.tests.create",
  "ielts.tests.edit",
  "ielts.tests.publish",
  "ielts.analytics.view",
  "ielts.staff.manage",
  "ielts.evaluate",
] as const;

export const IELTS_STORAGE_BUCKETS = {
  media: "ielts-media",
  speaking: "ielts-speaking",
} as const;

export const IELTS_IMPORT_COLUMNS = [
  "skill",
  "ielts_type",
  "section",
  "question_type",
  "difficulty",
  "title",
  "instructions",
  "passage",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
  "accepted_answers",
  "explanation",
  "tags",
  "status",
] as const;
