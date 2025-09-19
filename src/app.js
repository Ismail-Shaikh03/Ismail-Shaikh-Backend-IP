import express from "express";
import cors from "cors";
import { env } from "./env.js";
import landingRouter from "./pages/landing/landingRouter.js";

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: env.cors }));
  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/landing", landingRouter);
  return app;
}