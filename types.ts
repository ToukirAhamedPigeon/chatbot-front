export type Role = 'user' | 'ai';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface ChatRequest {
  query: string;
  topic: string;
  difficulty: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

export const TOPICS = [
  { id: 'education', label: 'শিক্ষা', icon: 'BookOpen' },
  { id: 'health', label: 'স্বাস্থ্য', icon: 'HeartPulse' },
  { id: 'travel', label: 'ভ্রমণ', icon: 'Plane' },
  { id: 'technology', label: 'প্রযুক্তি', icon: 'Cpu' },
  { id: 'sports', label: 'খেলাধুলা', icon: 'Trophy' },
  { id: 'general', label: 'সাধারণ', icon: 'MessageCircle' },
] as const;

export type TopicId = typeof TOPICS[number]['id'];
