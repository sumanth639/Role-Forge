export interface ChatMessage {
  id: string;
  role: 'USER' | 'model';
  content: string;
  timestamp: string;
}
