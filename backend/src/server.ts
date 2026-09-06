import cors from "cors";
import express from "express";
import { registerModuleRoutes } from "@/modules";
import { requestContextMiddleware } from "@/infrastructure/http/request-context";
import { errorHandler } from "@/shared/http/error-handler";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(requestContextMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(registerModuleRoutes());

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`API server listening on port ${port}`);
});
