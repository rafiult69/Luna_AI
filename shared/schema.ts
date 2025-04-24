import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messages: jsonb("messages").notNull().default([]),
  mood: text("mood").notNull().default("neutral"),
  affection: integer("affection").notNull().default(0),
  milestones: jsonb("milestones").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const messageSchema = z.object({
  id: z.string(),
  sender: z.enum(["user", "luna"]),
  content: z.string(),
  timestamp: z.string(),
});

export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  timestamp: z.string(),
  achieved: z.boolean().default(false),
});

export const conversationSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  messages: z.array(messageSchema).default([]),
  mood: z.string().default("neutral"),
  affection: z.number().default(0),
  milestones: z.array(milestoneSchema).default([]),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  messages: true,
  mood: true,
  affection: true,
  milestones: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Message = z.infer<typeof messageSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
