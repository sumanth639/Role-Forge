import { db } from "../db/client.js";
import { eq, and, desc } from "drizzle-orm";

import { agents, chats, messages } from "../db/schema.js";
import { buildSystemPrompt } from "../ai/prompt.js";
import { runGemini } from "../ai/gemini.js";

import { checkRateLimit } from "../limits/rates.js";
import { estimateTokens } from "../limits/usage.js";
import { tokenUsage } from "../db/schema.js";

import bcrypt from "bcryptjs";
import { users } from "../db/schema.js";
import { signJwt } from "../auth/jwt.js";


export const resolvers = {
  Query: {
    health: () => "Roleforge backend running 🚀",

      me: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) return null;

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      return user ?? null;
    },

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
          systemPrompt: agents.systemPrompt,
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
          systemPrompt: agents.systemPrompt,
          mode: agents.mode,
          createdAt: agents.createdAt,
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, id),
            eq(agents.userId, ctx.user.id),
            eq(agents.isArchived, false)
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
            systemPrompt: agents.systemPrompt,
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
            systemPrompt: agents.systemPrompt,
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
    .innerJoin(chats, eq(messages.chatId, chats.id))
    .where(
      and(
        eq(messages.chatId, chatId),
        eq(chats.userId, ctx.user.id)
      )
    )
    .orderBy(messages.createdAt);
},

//----------------------
// Chatby agent
//----------------------
chatByAgent: async (_: any, { agentId }: { agentId: string }, ctx: any) => {
  if (!ctx.user) throw new Error("Unauthorized");

  const chat = await db
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
        eq(chats.userId, ctx.user.id),
        eq(chats.agentId, agentId)
      )
    )
    .limit(1);

  return chat[0] ?? null;
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
          systemPrompt: agents.systemPrompt,
          mode: agents.mode,
          createdAt: agents.createdAt,
        });

      return agent;
    },

    updateAgent: async (_: any, { id, input }: { id: string; input: any }, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.systemPrompt !== undefined) updateData.systemPrompt = input.systemPrompt;
      if (input.mode !== undefined) updateData.mode = input.mode;

      const [agent] = await db
        .update(agents)
        .set(updateData)
        .where(
          and(
            eq(agents.id, id),
            eq(agents.userId, ctx.user.id),
            eq(agents.isArchived, false)
          )
        )
        .returning({
          id: agents.id,
          name: agents.name,
          description: agents.description,
          systemPrompt: agents.systemPrompt,
          mode: agents.mode,
          createdAt: agents.createdAt,
        });

      if (!agent) throw new Error("Agent not found");

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

  // 1. Check if chat already exists
  const [existingChat] = await db
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.userId, ctx.user.id),
        eq(chats.agentId, agentId)
      )
    )
    .limit(1);

  if (existingChat) {
    // Fetch the agent info to return the full object
    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
    return { ...existingChat, agent };
  }

  // 2. If it doesn't exist, proceed with insertion
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
    .returning();

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
    role: m.role === "USER" ? "user" : "assistant",
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

const [assistantMessage] = await db
  .insert(messages)
  .values({
    chatId,
    role: "ASSISTANT",
    content: aiResponse,
  })
  .returning();

// 🔟 Return BOTH messages (user + assistant)
return [
  {
    id: "temp-user",
    role: "USER",
    content,
    createdAt: new Date().toISOString(),
  },
  assistantMessage,]

    },

    // --------------------
    // SignUp
    // --------------------
    signup: async (
      _: unknown,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      // 1️⃣ Validate input
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // 2️⃣ Check if user already exists
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing.length) {
        throw new Error("User already exists with this email");
      }

      // 3️⃣ Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // 4️⃣ Insert user
      const inserted = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
        });

      if (!inserted.length) {
        throw new Error("Failed to create user");
      }

     const [user] = inserted;

if (!user) {
  throw new Error("Failed to create user");
}

      // 5️⃣ Issue JWT
      const token = signJwt({ userId: user.id });

      // 6️⃣ Return auth payload
      return {
        token,
        user,
      };},


    // --------------------
    // Login
    // --------------------
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      // 1️⃣ Validate input
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // 2️⃣ Find user
      const result = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!result.length) {
        throw new Error("Invalid credentials");
      }

      const [user] = await db
  .select({
    id: users.id,
    email: users.email,
    name: users.name,
    passwordHash: users.passwordHash,
  })
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

if (!user || !user.passwordHash) {
  throw new Error("Invalid credentials");
}

const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      // 4️⃣ Issue JWT
      const token = signJwt({ userId: user.id });

      // 5️⃣ Return auth payload
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    },
     

  },
};
