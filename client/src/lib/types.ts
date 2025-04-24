export interface Message {
  id: string;
  sender: 'user' | 'luna';
  content: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  achieved: boolean;
}

export interface Conversation {
  id?: number;
  userId: number;
  messages: Message[];
  mood: string;
  affection: number;
  milestones: Milestone[];
}

export interface MoodData {
  emoji: string;
  description: string;
  effects: string[];
}
