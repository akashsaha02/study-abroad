import type { Request } from "express";
import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import { routeParam } from "@/shared/http/request";
import { ValidationError } from "@/shared/http/errors";
import { ADMIN_ROLES, assertApiRole } from "@/modules/identity/api-auth";
import { createClient } from "@/infrastructure/supabase/client";
import { ieltsStaffSchema } from "@abroadly/shared/validations/ielts";
import { assertIeltsPermission, requireStudent } from "./ielts.auth";
import * as questions from "./questions.service";
import * as tests from "./tests.service";
import * as attempts from "./attempts.service";
import * as analytics from "./analytics.service";
import * as imports from "./import.service";
import { registerMedia, signedMediaUrl } from "./media.service";

export function createIeltsRouter() {
  const router = Router();

  router.get(
    "/api/ielts/catalog",
    asyncHandler(async (_req, res) => {
      const published = await tests.listTests({}, true);
      res.json({ tests: published });
    })
  );

  router.get(
    "/api/ielts/me",
    asyncHandler(async (_req, res) => {
      const user = await requireStudent();
      res.json(await analytics.studentDashboard(user.id));
    })
  );

  router.patch(
    "/api/ielts/me/target",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(await attempts.saveTargetBand(user.id, req.body));
    })
  );

  router.get(
    "/api/ielts/attempts",
    asyncHandler(async (_req, res) => {
      const user = await requireStudent();
      res.json(await attempts.listMyAttempts(user.id));
    })
  );

  router.post(
    "/api/ielts/practice",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(await attempts.startPractice(user.id, req.body));
    })
  );

  router.post(
    "/api/ielts/tests/:id/start",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(await attempts.startTest(user.id, routeParam(req.params.id)));
    })
  );

  router.get(
    "/api/ielts/attempts/:id",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(
        await attempts.loadAttemptPayload(routeParam(req.params.id), user.id)
      );
    })
  );

  router.patch(
    "/api/ielts/attempts/:id/answers",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(
        await attempts.saveAnswers(routeParam(req.params.id), user.id, req.body)
      );
    })
  );

  router.post(
    "/api/ielts/attempts/:id/submit",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(await attempts.submitAttempt(routeParam(req.params.id), user.id));
    })
  );

  router.post(
    "/api/ielts/questions/:id/bookmark",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(await attempts.toggleBookmark(user.id, routeParam(req.params.id)));
    })
  );

  router.post(
    "/api/ielts/questions/:id/report",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(
        await attempts.reportQuestion(user.id, routeParam(req.params.id), req.body)
      );
    })
  );

  router.post(
    "/api/ielts/attempts/:id/speaking/:questionId",
    asyncHandler(async (req, res) => {
      const user = await requireStudent();
      res.json(
        await attempts.saveSpeakingRecording(
          user.id,
          routeParam(req.params.id),
          routeParam(req.params.questionId),
          String(req.body?.path ?? ""),
          Number(req.body?.duration_ms) || undefined
        )
      );
    })
  );

  router.get(
    "/api/admin/ielts/overview",
    asyncHandler(async (_req, res) => {
      await assertIeltsPermission("ielts.analytics.view");
      res.json(await analytics.adminAnalytics());
    })
  );

  router.get(
    "/api/admin/ielts/questions",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.view");
      res.json(await questions.listQuestions(req.query as Record<string, unknown>, staff));
    })
  );

  router.post(
    "/api/admin/ielts/questions",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.create");
      res.status(201).json(await questions.createQuestion(req.body, staff));
    })
  );

  router.post(
    "/api/admin/ielts/questions/bulk",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.edit");
      res.json(
        await questions.bulkQuestionStatus(
          Array.isArray(req.body?.ids) ? req.body.ids : [],
          req.body?.status,
          staff
        )
      );
    })
  );

  router.post(
    "/api/admin/ielts/questions/import/preview",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.questions.create");
      const { filename, content } = parseUpload(req);
      res.json(await imports.previewImport(content, filename));
    })
  );

  router.post(
    "/api/admin/ielts/questions/import",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.create");
      const { filename, content } = parseUpload(req);
      res.json(await imports.commitImport(content, filename, staff));
    })
  );

  router.get(
    "/api/admin/ielts/questions/import/template.csv",
    asyncHandler(async (_req, res) => {
      await assertIeltsPermission("ielts.view");
      res.setHeader("Content-Type", "text/csv");
      res.send(`${imports.IMPORT_TEMPLATE_HEADER}\n`);
    })
  );

  router.get(
    "/api/admin/ielts/questions/:id",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.view");
      res.json(await questions.getQuestion(routeParam(req.params.id)));
    })
  );

  router.patch(
    "/api/admin/ielts/questions/:id",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.edit");
      res.json(
        await questions.updateQuestion(routeParam(req.params.id), req.body, staff)
      );
    })
  );

  router.post(
    "/api/admin/ielts/questions/:id/duplicate",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.create");
      res.json(await questions.duplicateQuestion(routeParam(req.params.id), staff));
    })
  );

  router.post(
    "/api/admin/ielts/questions/:id/archive",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.delete");
      res.json(await questions.archiveQuestion(routeParam(req.params.id), staff));
    })
  );

  router.get(
    "/api/admin/ielts/tests",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.view");
      res.json(await tests.listTests(req.query as Record<string, unknown>));
    })
  );

  router.post(
    "/api/admin/ielts/tests",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.tests.create");
      res.status(201).json(await tests.createTest(req.body, staff));
    })
  );

  router.get(
    "/api/admin/ielts/tests/:id",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.view");
      res.json(await tests.getTest(routeParam(req.params.id)));
    })
  );

  router.patch(
    "/api/admin/ielts/tests/:id",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.tests.edit");
      res.json(await tests.updateTest(routeParam(req.params.id), req.body, staff));
    })
  );

  router.post(
    "/api/admin/ielts/tests/:id/duplicate",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.tests.create");
      res.json(await tests.duplicateTest(routeParam(req.params.id), staff));
    })
  );

  router.get(
    "/api/admin/ielts/tests/:id/analytics",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.analytics.view");
      res.json(await analytics.testAnalytics(routeParam(req.params.id)));
    })
  );

  router.post(
    "/api/admin/ielts/media",
    asyncHandler(async (req, res) => {
      const staff = await assertIeltsPermission("ielts.questions.create");
      res.json(
        await registerMedia({
          path: String(req.body?.path ?? ""),
          kind: req.body?.kind,
          mime_type: req.body?.mime_type,
          duration_ms: req.body?.duration_ms,
          created_by: staff.user.id,
        })
      );
    })
  );

  router.get(
    "/api/admin/ielts/media/:id",
    asyncHandler(async (req, res) => {
      await assertIeltsPermission("ielts.view");
      res.json(await signedMediaUrl(routeParam(req.params.id)));
    })
  );

  router.get(
    "/api/admin/ielts/staff",
    asyncHandler(async (_req, res) => {
      await assertIeltsPermission("ielts.staff.manage");
      const supabase = createClient();
      const { data } = await supabase
        .from("ielts_staff")
        .select("*, profiles(full_name, email, role)");
      res.json(data ?? []);
    })
  );

  router.post(
    "/api/admin/ielts/staff",
    asyncHandler(async (req, res) => {
      await assertApiRole([...ADMIN_ROLES]);
      const parsed = ieltsStaffSchema.safeParse(req.body);
      if (!parsed.success) throw new ValidationError(parsed.error);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ielts_staff")
        .upsert({
          profile_id: parsed.data.profile_id,
          staff_role: parsed.data.staff_role,
        })
        .select("*")
        .single();
      if (error) throw new ValidationError(error.message);
      res.json(data);
    })
  );

  router.delete(
    "/api/admin/ielts/staff/:id",
    asyncHandler(async (req, res) => {
      await assertApiRole([...ADMIN_ROLES]);
      const supabase = createClient();
      await supabase.from("ielts_staff").delete().eq("profile_id", routeParam(req.params.id));
      res.json({ success: true });
    })
  );

  return router;
}

function parseUpload(req: Request): { filename: string; content: Buffer } {
  const filename = String(req.body?.filename ?? "upload.csv");
  const content = req.body?.content;
  if (typeof content !== "string" || !content) {
    throw new ValidationError("Missing file content");
  }
  return { filename, content: Buffer.from(content, "base64") };
}
