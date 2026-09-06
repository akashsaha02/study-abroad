import type { Request, Response } from "express";
import { getUser } from "@/modules/identity";
import { ADMIN_ROLES, STAFF_ROLES, assertApiRole } from "@/modules/identity/api-auth";
import { UnauthorizedError } from "@/shared/http/errors";
import { routeParam } from "@/shared/http/request";
import * as documentsService from "@/modules/documents/documents.service";

export async function createStudentDocument(req: Request, res: Response) {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();

  await documentsService.createStudentDocument(user.id, req.body ?? {});
  res.status(200).json({ success: true });
}

export async function reviewDocument(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  await documentsService.reviewDocument(routeParam(req.params.id), req.body);
  res.status(200).json({ success: true });
}

export async function previewDocument(req: Request, res: Response) {
  await assertApiRole([...STAFF_ROLES]);
  const preview = await documentsService.previewDocument(routeParam(req.params.id));
  res.status(200).json(preview);
}
