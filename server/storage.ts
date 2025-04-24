import {
  users,
  conversations,
  type User,
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type Milestone,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByUserId(userId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Message operations
  addMessage(conversationId: number, message: Message): Promise<Conversation | undefined>;
  
  // Mood and affection operations
  updateMood(conversationId: number, mood: string): Promise<Conversation | undefined>;
  updateAffection(conversationId: number, affection: number): Promise<Conversation | undefined>;
  
  // Milestone operations
  addMilestone(conversationId: number, milestone: Milestone): Promise<Conversation | undefined>;
  updateMilestone(conversationId: number, milestoneId: string, achieved: boolean): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  currentUserId: number;
  currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getConversationByUserId(userId: number): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.userId === userId,
    );
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date().toISOString();
    
    const conversation: Conversation = {
      ...insertConversation,
      id,
      updatedAt: now,
      createdAt: now,
    };
    
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  async addMessage(conversationId: number, message: Message): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }
  
  async updateMood(conversationId: number, mood: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      mood,
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }
  
  async updateAffection(conversationId: number, affection: number): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      affection,
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }
  
  async addMilestone(conversationId: number, milestone: Milestone): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      milestones: [...conversation.milestones, milestone],
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }
  
  async updateMilestone(conversationId: number, milestoneId: string, achieved: boolean): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      return undefined;
    }
    
    const updatedMilestones = conversation.milestones.map(milestone => 
      milestone.id === milestoneId ? { ...milestone, achieved } : milestone
    );
    
    const updatedConversation: Conversation = {
      ...conversation,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString(),
    };
    
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
