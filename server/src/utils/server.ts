import express from "express";
import cors from "cors";
import requestIp from "request-ip";
import { router } from "../router";

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URI,
      credentials: true,
    })
  );

  app.use(requestIp.mw())

  app.use(express.json({ limit: "1mb" }));

  app.use(express.json());

  router(app);

  return app;
}
