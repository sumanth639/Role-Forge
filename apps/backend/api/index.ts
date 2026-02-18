import type { IncomingMessage, ServerResponse } from "http";
import type { Express } from "express";

let appPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = import("../dist/server.js").then((mod) => mod.createServer());
  }
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await getApp();
    return app(req as any, res as any);
  } catch (error) {
    console.error("Backend startup failed:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Backend startup failed. Check function logs." }));
  }
}
