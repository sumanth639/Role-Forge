import { db } from "../db/client.js";
import { eq, and, desc } from "drizzle-orm";

import { agents, chats, messages } from "../db/schema.js";
import { buildSystemPrompt } from "../ai/prompt.js";
import { runGemini } from "../ai/gemini.js";

import { checkRateLimit } from "../limits/rates.js";
import { estimateTokens } from "../limits/usage.js";
import { tokenUsage } from "../db/schema.js";


export const resolvers = {
  Query: {
    health: () => "Roleforge backend running 🚀",

    // --------------------
    // AGENTS
    // --------------------
    agents: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      return db
        .select({
          id: agents.id,
          name: agents.name,
          description: agents.description,
          mode: agents.mode,
          createdAt: agents.createdAt,
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.user.id),
            eq(agents.isArchived, false)
          )
        );
    },

    agent: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const result = await db
        .select({
          id: agents.id,
          name: agents.name,
          description: agents.description,
          mode: agents.mode,
          createdAt: agents.createdAt,
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, id),
            eq(agents.userId, ctx.user.id)
          )
        )
        .limit(1);

      return result[0] ?? null;
    },

    // --------------------
    // CHATS
    // --------------------
    chats: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      return db
        .select({
          id: chats.id,
          createdAt: chats.createdAt,
          agent: {
            id: agents.id,
            name: agents.name,
            description: agents.description,
            mode: agents.mode,
            createdAt: agents.createdAt,
          },
        })
        .from(chats)
        .innerJoin(agents, eq(chats.agentId, agents.id))
        .where(eq(chats.userId, ctx.user.id));
    },

    chat: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const result = await db
        .select({
          id: chats.id,
          createdAt: chats.createdAt,
          agent: {
            id: agents.id,
            name: agents.name,
            description: agents.description,
            mode: agents.mode,
            createdAt: agents.createdAt,
          },
        })
        .from(chats)
        .innerJoin(agents, eq(chats.agentId, agents.id))
        .where(
          and(
            eq(chats.id, id),
            eq(chats.userId, ctx.user.id)
          )
        )
        .limit(1);

      return result[0] ?? null;
    },

    // --------------------
    // MESSAGES
    // --------------------
    messages: async (_: any, { chatId }: { chatId: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      return db
        .select({
          id: messages.id,
          role: messages.role,
          content: messages.content,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(messages.createdAt);
    },
  },

  Mutation: {
    // --------------------
    // AGENTS
    // --------------------
    createAgent: async (_: any, { input }: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const [agent] = await db
        .insert(agents)
        .values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          systemPrompt: input.systemPrompt,
          mode: input.mode,
        })
        .returning({
          id: agents.id,
          name: agents.name,
          description: agents.description,
          mode: agents.mode,
          createdAt: agents.createdAt,
        });

      return agent;
    },

    deleteAgent: async (_: any, { id }: { id: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      await db
        .update(agents)
        .set({
          isArchived: true,
          archivedAt: new Date(),
        })
        .where(
          and(
            eq(agents.id, id),
            eq(agents.userId, ctx.user.id)
          )
        );

      return true;
    },

    // --------------------
    // CHATS
    // --------------------
    createChat: async (_: any, { agentId }: { agentId: string }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const agent = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.id, agentId),
            eq(agents.userId, ctx.user.id),
            eq(agents.isArchived, false)
          )
        )
        .limit(1);

      if (!agent.length) {
        throw new Error("Agent not found or archived");
      }

      const [chat] = await db
        .insert(chats)
        .values({
          userId: ctx.user.id,
          agentId,
        })
        .returning({
          id: chats.id,
          createdAt: chats.createdAt,
        });

      return {
        ...chat,
        agent: agent[0],
      };
    },

    // --------------------
    // SEND MESSAGE (GEMINI)
    // --------------------
    sendMessage: async (
      _: any,
      { chatId, content }: { chatId: string; content: string },
      ctx: any
    ) => {
      if (!ctx.user) throw new Error("Unauthorized");

      // 1️⃣ Load chat + agent
      const chatData = await db
        .select({
          agentId: agents.id,
          systemPrompt: agents.systemPrompt,
          mode: agents.mode,
        })
        .from(chats)
        .innerJoin(agents, eq(chats.agentId, agents.id))
        .where(
          and(
            eq(chats.id, chatId),
            eq(chats.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!chatData.length) {
        throw new Error("Chat not found");
      }

      const chat = chatData[0];
      if (!chat) {
        throw new Error("Chat not found");
      }

      const { systemPrompt, mode } = chat;

      // 2️⃣ Check for duplicate message (prevent retries from creating duplicates)
      const recentMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const lastMessage = recentMessages[0];
      const isDuplicate =
        lastMessage &&
        lastMessage.role === "USER" &&
        lastMessage.content === content &&
        lastMessage.createdAt &&
        new Date().getTime() - new Date(lastMessage.createdAt).getTime() < 5000; // Within 5 seconds

      // 3️⃣ Save user message (only if not duplicate)
      if (!isDuplicate) {
        await db.insert(messages).values({
          chatId,
          role: "USER",
          content,
        });
      }

      // 4️⃣ Fetch full history
      const history = await db
        .select({
          role: messages.role,
          content: messages.content,
        })
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(messages.createdAt);

      // 5️⃣ Build system prompt
      const finalSystemPrompt = buildSystemPrompt(systemPrompt, mode);

      // 6️⃣ Check rate limit BEFORE calling Gemini
      if (!checkRateLimit(ctx.user.id)) {
        throw new Error("Rate limit exceeded. Please slow down.");
      }

      // 7️⃣ Call Gemini
      const aiResponse = await runGemini({
        systemPrompt: finalSystemPrompt,
        messages: history.map((m) => ({
          role: m.role.toLowerCase() as "user" | "assistant",
          content: m.content,
        })),
      });

      // 8️⃣ Track token usage AFTER Gemini response
      const totalTokens =
        estimateTokens(content) + estimateTokens(aiResponse);

      await db.insert(tokenUsage).values({
        userId: ctx.user.id,
        chatId,
        tokens: totalTokens.toString(),
        model: "gemini-1.5-flash",
      });

      // 9️⃣ Save assistant message
      const [assistantMessage] = await db
        .insert(messages)
        .values({
          chatId,
          role: "ASSISTANT",
          content: aiResponse,
        })
        .returning();

      return assistantMessage;
    },
  },
};
