import type { Request, Response } from "express";
import { ADMIN_ROLES, assertApiRole } from "@/modules/identity/api-auth";
import { routeParam } from "@/shared/http/request";
import * as applicationsService from "@/modules/applications/applications.service";

export async function updateApplication(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  await applicationsService.updateApplication(routeParam(req.params.id), req.body);
  res.status(200).json({ success: true });
}

export async function createApplicationStep(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  const data = await applicationsService.createApplicationStep(req.body);
  res.status(200).json({ data });
}

export async function updateApplicationStep(req: Request, res: Response) {
  await assertApiRole([...ADMIN_ROLES]);
  const data = await applicationsService.updateApplicationStep(
    routeParam(req.params.id),
    req.body
  );
  res.status(200).json({ data });
}
