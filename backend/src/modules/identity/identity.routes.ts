import { Router } from "express";
import { asyncHandler } from "@/shared/http/async-handler";
import * as identityController from "@/modules/identity/identity.controller";

export function createIdentityRouter() {
  const router = Router();
  router.post("/api/auth/signout", asyncHandler(identityController.signOut));
  return router;
}
