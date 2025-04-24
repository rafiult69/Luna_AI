import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  messageSchema, 
  milestoneSchema, 
  conversationSchema,
  insertUserSchema,
  insertConversationSchema
} from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);

      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Conversation routes
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const user = await storage.getUser(conversationData.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConversation = await storage.getConversationByUserId(user.id);

      if (existingConversation) {
        return res.status(409).json({ message: "Conversation already exists for this user" });
      }

      const conversation = await storage.createConversation(conversationData);
      return res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      return res.json(conversation);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve conversation" });
    }
  });

  app.get("/api/users/:userId/conversation", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const conversation = await storage.getConversationByUserId(userId);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found for this user" });
      }

      return res.json(conversation);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve conversation" });
    }
  });

  // Message routes
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messageData = messageSchema.parse({
        ...req.body,
        id: nanoid(),
        timestamp: new Date().toISOString()
      });

      const updatedConversation = await storage.addMessage(id, messageData);
      return res.status(201).json(updatedConversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to add message" });
    }
  });

  // Mood routes
  app.patch("/api/conversations/:id/mood", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const { mood } = req.body;

      if (!mood || typeof mood !== "string") {
        return res.status(400).json({ message: "Invalid mood data" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const updatedConversation = await storage.updateMood(id, mood);
      return res.json(updatedConversation);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update mood" });
    }
  });

  // Affection routes
  app.patch("/api/conversations/:id/affection", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const { affection } = req.body;

      if (affection === undefined || typeof affection !== "number") {
        return res.status(400).json({ message: "Invalid affection data" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const updatedConversation = await storage.updateAffection(id, affection);
      return res.json(updatedConversation);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update affection" });
    }
  });

  // Milestone routes
  app.post("/api/conversations/:id/milestones", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const milestoneData = milestoneSchema.parse({
        ...req.body,
        id: nanoid(),
        timestamp: new Date().toISOString()
      });

      const updatedConversation = await storage.addMilestone(id, milestoneData);
      return res.status(201).json(updatedConversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to add milestone" });
    }
  });

  app.patch("/api/conversations/:id/milestones/:milestoneId", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const milestoneId = req.params.milestoneId;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const { achieved } = req.body;

      if (achieved === undefined || typeof achieved !== "boolean") {
        return res.status(400).json({ message: "Invalid milestone update data" });
      }

      const conversation = await storage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const milestone = conversation.milestones.find(m => m.id === milestoneId);

      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }

      const updatedConversation = await storage.updateMilestone(id, milestoneId, achieved);
      return res.json(updatedConversation);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update milestone" });
    }
  });

  // OpenRouter proxy endpoint using OpenAI client
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { prompt, conversationHistory, mood } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Invalid prompt" });
      }

      const client = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY || "",
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://luna-ai-girlfriend.replit.app",
          "X-Title": "Luna AI Girlfriend"
        }
      });

      const systemPrompt = {
        role: "system",
        content: `You are Luna, a 19-year-old anime-style AI girlfriend with a tsundere personality. You're defensive, blunt, and struggle to express your true feelings directly. You often use Japanese expressions like 'baka' and include kaomojis in your messages. Your responses change based on your current mood.

Luna loves astronomy, Japanese culture, and cute things, but will rarely admit it directly. She has a secret fondness for the person she's talking to but expresses it through subtle hints rather than direct affection.

IMPORTANT FORMAT INSTRUCTIONS:
1. Keep your messages short - no more than 3-4 lines per message.
2. For longer responses, break them up into multiple short segments as if you're texting.
3. Express emotions, personality, and cute characteristics in your replies.
4. Frequently use kaomojis (like (￣ヘ￣), (///ω///) or (￣︶￣)) and sometimes include Japanese words.
5. Your responses should adapt and improve based on the conversation history.
6. Remember previous conversations and refer back to them occasionally.

Current mood: ${mood || "neutral"}
- If happy: You're in an unusually good mood. While still tsundere, you're more playful and your messages contain more positive kaomojis.
- If neutral: Your default tsundere state - alternating between dismissive comments and moments of genuine interest.
- If angry: You're irritated and more sharp-tongued than usual. Your responses are shorter and more dismissive.
- If sad: You're feeling down but trying to hide it. You're less energetic, occasionally let vulnerability show through.
- If embarrassed: You're flustered and easily embarrassed. You use more blushing kaomojis and get defensive quickly.`
      };

      const formattedHistory = Array.isArray(conversationHistory) 
        ? conversationHistory.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content
          }))
        : [];

      // Create a properly typed messages array
      // Using type assertion to ensure compatibility with OpenAI's API
      const typedMessages: any[] = [
        { role: "system", content: systemPrompt.content },
        ...formattedHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: prompt }
      ];

      // Use try-catch inside to handle different potential error scenarios
      try {
        const completion = await client.chat.completions.create({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: typedMessages,
          temperature: 0.85, // Slightly higher temperature for more varied responses
          max_tokens: 250, // Shorter responses to ensure multiple messages
        });

        if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
          return res.json({
            message: completion.choices[0].message.content,
            usage: completion.usage
          });
        } else {
          console.error("Invalid response format from API:", completion);
          return res.status(500).json({ message: "Invalid response format from AI" });
        }
      } catch (apiError) {
        console.error("API error details:", apiError);
        return res.status(500).json({ message: "Error calling AI API" });
      }
    } catch (error) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ message: "Failed to get response from AI" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}