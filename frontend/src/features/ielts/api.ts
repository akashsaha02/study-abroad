import { apiFetch } from "@/infrastructure/api/client";

export const ieltsApi = {
  catalog: () => apiFetch<{ tests: Record<string, unknown>[] }>("/api/ielts/catalog"),
  me: () => apiFetch<Record<string, unknown>>("/api/ielts/me"),
  setTarget: (target_band: number | null) =>
    apiFetch("/api/ielts/me/target", {
      method: "PATCH",
      body: JSON.stringify({ target_band }),
    }),
  attempts: () => apiFetch<unknown[]>("/api/ielts/attempts"),
  startPractice: (body: unknown) =>
    apiFetch("/api/ielts/practice", { method: "POST", body: JSON.stringify(body) }),
  startTest: (id: string) =>
    apiFetch(`/api/ielts/tests/${id}/start`, { method: "POST" }),
  getAttempt: (id: string) => apiFetch(`/api/ielts/attempts/${id}`),
  saveAnswers: (id: string, answers: unknown[]) =>
    apiFetch(`/api/ielts/attempts/${id}/answers`, {
      method: "PATCH",
      body: JSON.stringify({ answers }),
    }),
  submit: (id: string) =>
    apiFetch(`/api/ielts/attempts/${id}/submit`, { method: "POST" }),
  bookmark: (id: string) =>
    apiFetch(`/api/ielts/questions/${id}/bookmark`, { method: "POST" }),
  report: (id: string, message: string) =>
    apiFetch(`/api/ielts/questions/${id}/report`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  saveSpeaking: (attemptId: string, questionId: string, path: string, duration_ms?: number) =>
    apiFetch(`/api/ielts/attempts/${attemptId}/speaking/${questionId}`, {
      method: "POST",
      body: JSON.stringify({ path, duration_ms }),
    }),
  adminOverview: () => apiFetch("/api/admin/ielts/overview"),
  listQuestions: (params: string) =>
    apiFetch(`/api/admin/ielts/questions?${params}`),
  getQuestion: (id: string) => apiFetch(`/api/admin/ielts/questions/${id}`),
  createQuestion: (body: unknown) =>
    apiFetch("/api/admin/ielts/questions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateQuestion: (id: string, body: unknown) =>
    apiFetch(`/api/admin/ielts/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  duplicateQuestion: (id: string) =>
    apiFetch(`/api/admin/ielts/questions/${id}/duplicate`, { method: "POST" }),
  archiveQuestion: (id: string) =>
    apiFetch(`/api/admin/ielts/questions/${id}/archive`, { method: "POST" }),
  bulkQuestions: (ids: string[], status: string) =>
    apiFetch("/api/admin/ielts/questions/bulk", {
      method: "POST",
      body: JSON.stringify({ ids, status }),
    }),
  previewImport: (filename: string, content: string) =>
    apiFetch("/api/admin/ielts/questions/import/preview", {
      method: "POST",
      body: JSON.stringify({ filename, content }),
    }),
  commitImport: (filename: string, content: string) =>
    apiFetch("/api/admin/ielts/questions/import", {
      method: "POST",
      body: JSON.stringify({ filename, content }),
    }),
  listTests: () => apiFetch("/api/admin/ielts/tests"),
  getTest: (id: string) => apiFetch(`/api/admin/ielts/tests/${id}`),
  createTest: (body: unknown) =>
    apiFetch("/api/admin/ielts/tests", { method: "POST", body: JSON.stringify(body) }),
  updateTest: (id: string, body: unknown) =>
    apiFetch(`/api/admin/ielts/tests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  duplicateTest: (id: string) =>
    apiFetch(`/api/admin/ielts/tests/${id}/duplicate`, { method: "POST" }),
  testAnalytics: (id: string) => apiFetch(`/api/admin/ielts/tests/${id}/analytics`),
  registerMedia: (body: unknown) =>
    apiFetch("/api/admin/ielts/media", { method: "POST", body: JSON.stringify(body) }),
  listStaff: () => apiFetch("/api/admin/ielts/staff"),
  addStaff: (body: unknown) =>
    apiFetch("/api/admin/ielts/staff", { method: "POST", body: JSON.stringify(body) }),
  removeStaff: (id: string) =>
    apiFetch(`/api/admin/ielts/staff/${id}`, { method: "DELETE" }),
};
