import type { IncomingMessage, ServerResponse } from "http";
import type { Express } from "express";

let appPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = import("../dist/server.js").then((mod) => mod.createServer());
  }
  return appPromise;
}

function getOrigin(req: IncomingMessage): string | null {
  const originHeader = req.headers.origin;
  if (!originHeader) return null;
  return Array.isArray(originHeader) ? originHeader[0] ?? null : originHeader;
}

function setCorsHeaders(req: IncomingMessage, res: ServerResponse) {
  const origin = getOrigin(req);
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

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
