// src/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const agentModeEnum = pgEnum("agent_mode", [
  "STRICT",
  "FLEXIBLE",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "USER",
  "ASSISTANT",
]);

export const users = pgTable("users", {
   id: uuid("id").defaultRandom().primaryKey(),

  email: text("email").notNull().unique(),
  name: text("name"),

  passwordHash: text("password_hash"), 
  avatarUrl: text("avatar_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  provider: text("provider").notNull(), // google | github
  providerUserId: text("provider_user_id").notNull(),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").notNull(),
  description: text("description"),

  systemPrompt: text("system_prompt").notNull(),

  mode: agentModeEnum("mode").default("STRICT").notNull(),

  icon: text("icon").default("Brain").notNull(),
  color: text("color").default("mint").notNull(),

  isArchived: boolean("is_archived").default(false).notNull(),
  archivedAt: timestamp("archived_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { uniqueIndex } from "drizzle-orm/pg-core";

export const chats = pgTable(
  "chats",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    agentId: uuid("agent_id")
      .references(() => agents.id)
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userAgentUnique: uniqueIndex("chats_user_agent_unique").on(
      table.userId,
      table.agentId
    ),
  })
);


export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),

  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const tokenUsage = pgTable("token_usage", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),

  tokens: text("tokens").notNull(), 
  model: text("model").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================
// RELATIONS
// =========================

export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
  chats: many(chats),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [chats.agentId],
    references: [agents.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
