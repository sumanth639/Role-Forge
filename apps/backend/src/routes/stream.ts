import express, { Router } from "express";
import { db } from "../db/client.js";
import { chats, agents, messages, tokenUsage } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { buildSystemPrompt } from "../ai/prompt.js";
import { streamGemini } from "../ai/geminiStream.js";
import { verifyJwt } from "../auth/jwt.js";
import { checkRateLimit } from "../limits/rates.js";
import { estimateTokens } from "../limits/usage.js";

export const streamRouter: Router = express.Router();
streamRouter.get("/chat/:chatId", async (req, res) => {
  try {

    const origin = process.env.FRONTEND_URL || "http://localhost:3000";
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    const token = req.query.token as string;
    if (!token) {
      res.write(`event: error\ndata: Unauthorized\n\n`);
      res.end();
      return;
    }

    const payload = verifyJwt(token);
    const userId = payload.userId;
    const chatId = req.params.chatId;
    const userMessage = req.query.message as string;

    if (!userMessage) {
      res.write(`event: error\ndata: Missing message\n\n`);
      res.end();
      return;
    }

    const chatData = await db
      .select({
        systemPrompt: agents.systemPrompt,
        mode: agents.mode,
      })
      .from(chats)
      .innerJoin(agents, eq(chats.agentId, agents.id))
      .where(
        and(
          eq(chats.id, chatId),
          eq(chats.userId, userId)
        )
      )
      .limit(1);

    const chatRow = chatData[0];
    if (!chatRow) {
      res.write(`event: error\ndata: Chat not found\n\n`);
      res.end();
      return;
    }

    if (!checkRateLimit(userId)) {
      res.write(`event: error\ndata: Rate limit exceeded\n\n`);
      res.end();
      return;
    }

    await db.insert(messages).values({
      chatId,
      role: "USER",
      content: userMessage,
    });

    const history = await db
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    const finalPrompt = buildSystemPrompt(
      chatRow.systemPrompt,
      chatRow.mode
    );

    let finalAnswer = "";

    await streamGemini({
      systemPrompt: finalPrompt,
      messages: history.map((m) => ({
        role: m.role === "USER" ? "user" : "model",
        content: m.content,
      })),
      onToken(token) {
        finalAnswer += token;
        res.write(`data: ${token}\n\n`);
      },
    });

    await db.insert(messages).values({
      chatId,
      role: "ASSISTANT",
      content: finalAnswer,
    });

    const totalTokens = estimateTokens(userMessage) + estimateTokens(finalAnswer);

    await db.insert(tokenUsage).values({
      userId: userId,
      chatId,
      tokens: totalTokens.toString(),
      model: "gemini-2.5-flash-lite",
    });

    res.write(`event: done\ndata: end\n\n`);
    res.end();
  } catch (error) {
    console.error("Stream route error:", error);
    if (!res.headersSent) {
      res.write(`event: error\ndata: Internal server error\n\n`);
      res.end();
    }
  }
});