import express from "express";
import { db } from "../db/client.js";
import { chats, agents, messages } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { buildSystemPrompt } from "../ai/prompt.js";
import { streamGemini } from "../ai/geminiStream.js";
import { getAuthContext } from "../auth/context.js";

import { checkRateLimit } from "../limits/rates.js";
import { estimateTokens } from "../limits/usage.js";
import { tokenUsage } from "../db/schema.js";


export const streamRouter = express.Router();

streamRouter.get("/chat/:chatId", async (req, res) => {
  try {
    // 1️⃣ SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { user } = await getAuthContext(req);
    if (!user) {
      res.write(`event: error\ndata: Unauthorized\n\n`);
      res.end();
      return;
    }

    const chatId = req.params.chatId;
    const userMessage = req.query.message as string;

    if (!userMessage) {
      res.write(`event: error\ndata: Missing message\n\n`);
      res.end();
      return;
    }

    // 2️⃣ Load chat + agent
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
          eq(chats.userId, user.id)
        )
      )
      .limit(1);

    const chatRow = chatData[0];
    if (!chatRow) {
      res.write(`event: error\ndata: Chat not found\n\n`);
      res.end();
      return;
    }

    // 3️⃣ Fetch history
    const history = await db
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    const fullHistory = [
      ...history,
      { role: "USER", content: userMessage },
    ];

    const finalPrompt = buildSystemPrompt(
      chatRow.systemPrompt,
      chatRow.mode
    );

    // 4️⃣ Check rate limit BEFORE streaming Gemini
    if (!checkRateLimit(user.id)) {
      res.write(`event: error\ndata: Rate limit exceeded\n\n`);
      res.end();
      return;
    }

    // 5️⃣ Persist USER message
    await db.insert(messages).values({
      chatId,
      role: "USER",
      content: userMessage,
    });

    // 6️⃣ Stream Gemini tokens
    let finalAnswer = "";

    await streamGemini({
      systemPrompt: finalPrompt,
      messages: fullHistory.map((m) => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content,
      })),
      onToken(token) {
        finalAnswer += token;
        res.write(`data: ${token}\n\n`);
      },
    });

    // 7️⃣ Persist ASSISTANT message (once)
    await db.insert(messages).values({
      chatId,
      role: "ASSISTANT",
      content: finalAnswer,
    });

    // 8️⃣ Track token usage AFTER streaming completes
    const totalTokens =
      estimateTokens(userMessage) + estimateTokens(finalAnswer);

    await db.insert(tokenUsage).values({
      userId: user.id,
      chatId,
      tokens: totalTokens.toString(),
      model: "gemini-1.5-flash",
    });

    res.write(`event: done\ndata: end\n\n`);
    res.end();
  } catch (error) {
    console.error("Stream route error:", error);
    if (!res.headersSent) {
      res.write(`event: error\ndata: ${error instanceof Error ? error.message : "Internal server error"}\n\n`);
      res.end();
    }
  }
});
