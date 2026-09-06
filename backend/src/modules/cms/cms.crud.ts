import type { Router } from "express";
import type { ZodError } from "zod";
import type { AuthUser, UserRole } from "@abroadly/shared/types";
import { ADMIN_ROLES, assertApiRole } from "@/modules/identity/api-auth";
import { createClient } from "@/infrastructure/supabase/client";
import { asyncHandler } from "@/shared/http/async-handler";
import { AppError, NotFoundError, ValidationError } from "@/shared/http/errors";
import { routeParam } from "@/shared/http/request";

type ParseResult =
  | { success: true; data: unknown }
  | { success: false; error: ZodError };

type ParseableSchema = {
  safeParse: (data: unknown) => ParseResult;
  partial?: () => ParseableSchema;
};

type CrudContext = {
  user: AuthUser;
  supabase: ReturnType<typeof createClient>;
  id?: string;
};

export type CrudResource = {
  table: string;
  schema: ParseableSchema;
  notFoundMessage: string;
  roles?: readonly UserRole[];
  createRoles?: readonly UserRole[];
  create?: boolean;
  update?: boolean;
  remove?: boolean;
  updateMode?: "partial" | "full";
  timestamps?: "none" | "create" | "update" | "both";
  returning?: boolean;
  mapCreate?: (
    data: Record<string, unknown>,
    ctx: CrudContext
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
  mapUpdate?: (
    data: Record<string, unknown>,
    ctx: CrudContext
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
};

function now() {
  return new Date().toISOString();
}

function withTimestamp(
  data: Record<string, unknown>,
  action: "create" | "update",
  timestamps: CrudResource["timestamps"]
) {
  if (timestamps === "none" || !timestamps) return data;
  if (action === "create" && (timestamps === "create" || timestamps === "both")) {
    return { ...data, updated_at: now() };
  }
  if (action === "update" && (timestamps === "update" || timestamps === "both")) {
    return { ...data, updated_at: now() };
  }
  return data;
}

function parse(schema: ParseableSchema, data: unknown) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }
  return parsed.data as Record<string, unknown>;
}

export function registerCrud(router: Router, path: string, resource: CrudResource) {
  const roles = resource.roles ?? ADMIN_ROLES;
  const createRoles = resource.createRoles ?? roles;
  const timestamps = resource.timestamps ?? "none";
  const returning = resource.returning ?? true;
  const updateMode = resource.updateMode ?? "partial";

  if (resource.create !== false) {
    router.post(
      `/api/admin/${path}`,
      asyncHandler(async (req, res) => {
        const user = await assertApiRole([...createRoles]);
        let payload = parse(resource.schema, req.body);
        const supabase = createClient();
        if (resource.mapCreate) {
          payload = await resource.mapCreate(payload, { user, supabase });
        }
        payload = withTimestamp(payload, "create", timestamps);

        const query = supabase.from(resource.table).insert(payload);
        if (!returning) {
          const { error } = await query;
          if (error) throw new AppError(error.message, 500);
          res.status(200).json({ data: { ok: true } });
          return;
        }

        const { data, error } = await query.select("id").single();
        if (error) throw new AppError(error.message, 500);
        res.status(200).json({ data });
      })
    );
  }

  if (resource.update !== false) {
    router.patch(
      `/api/admin/${path}/:id`,
      asyncHandler(async (req, res) => {
        const user = await assertApiRole([...roles]);
        const updateSchema =
          updateMode === "partial" && resource.schema.partial
            ? resource.schema.partial()
            : resource.schema;
        let payload = parse(updateSchema, req.body);
        const supabase = createClient();
        if (resource.mapUpdate) {
          payload = await resource.mapUpdate(payload, {
            user,
            supabase,
            id: routeParam(req.params.id),
          });
        }
        payload = withTimestamp(payload, "update", timestamps);

        const { data, error } = await supabase
          .from(resource.table)
          .update(payload)
          .eq("id", routeParam(req.params.id))
          .select("id")
          .single();

        if (error) throw new AppError(error.message, 500);
        if (!data) throw new NotFoundError(resource.notFoundMessage);
        res.status(200).json({ data });
      })
    );
  }

  if (resource.remove !== false) {
    router.delete(
      `/api/admin/${path}/:id`,
      asyncHandler(async (req, res) => {
        await assertApiRole([...roles]);
        const supabase = createClient();
        const { data, error } = await supabase
          .from(resource.table)
          .delete()
          .eq("id", routeParam(req.params.id))
          .select("id")
          .maybeSingle();

        if (error) throw new AppError("Failed to delete", 500);
        if (!data) throw new NotFoundError(resource.notFoundMessage);
        res.status(200).json({ success: true });
      })
    );
  }
}
