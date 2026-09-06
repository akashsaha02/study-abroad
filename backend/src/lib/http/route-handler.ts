import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { runWithRequestContext } from "@/lib/request-context";
import type { ApiResponse } from "@/lib/http/response";

export type RouteContext = {
  params: Promise<Record<string, string>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteHandler = (request: Request, context?: any) => Promise<ApiResponse | void>;

function createWebRequest(req: ExpressRequest): Request {
  const url = `${req.protocol}://${req.get("host") ?? "localhost"}${req.originalUrl}`;
  return {
    json: async () => req.body,
    url,
  } as Request;
}

function sendApiResponse(res: ExpressResponse, response: ApiResponse) {
  res.status(response.status).json(response.body);
}

export function adaptRoute(handler: RouteHandler) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    await runWithRequestContext(req, res, async () => {
      try {
        const result = await handler(createWebRequest(req), {
          params: Promise.resolve(req.params as Record<string, string>),
        });

        if (result) {
          sendApiResponse(res, result);
        }
      } catch (error) {
        console.error("API route error:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    });
  };
}
