import express from "express";
import cors from "cors";
import { env } from "./env.js";
import landingRouter from "./pages/landing/landingRouter.js";
import filmRouter from "./pages/films/filmRouter.js";
import actorRouter from "./pages/actors/actorRouter.js";
import customerRouter from "./pages/customers/customerRouter.js";

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: env.cors }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api/landing", landingRouter);
  app.use("/api/films", filmRouter);
  app.use("/api/actors", actorRouter);
  app.use("/api/customers", customerRouter);

  return app;
}

