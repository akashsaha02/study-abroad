import type { Request, Response } from "express";
import { getUser } from "@/modules/identity";
import { studentProfileSchema } from "@abroadly/shared/validations/student-profile";
import { AppError, UnauthorizedError, ValidationError } from "@/shared/http/errors";
import { updateStudentProfile } from "@/modules/students/update-profile";
import { updateAvatar } from "@/modules/students/students.service";

export async function updateProfile(req: Request, res: Response) {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();

  const parsed = studentProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const result = await updateStudentProfile(user, parsed.data);
  if (!result.ok) {
    throw new AppError(result.error, result.status);
  }

  res.status(200).json({ success: true });
}

export async function updateProfileAvatar(req: Request, res: Response) {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();

  const body = (req.body ?? {}) as { avatar_url?: unknown };
  const avatarUrl = await updateAvatar(user.id, body.avatar_url);
  res.status(200).json({ success: true, avatar_url: avatarUrl });
}
