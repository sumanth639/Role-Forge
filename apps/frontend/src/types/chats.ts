export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
}
