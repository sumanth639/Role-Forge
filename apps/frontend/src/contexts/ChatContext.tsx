import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useChatStream } from '@/hooks/useChatStream';
import { fetchAgent } from '@/api/agents';
import { mapApiAgentToUi } from '@/mappers/agentMapper';
import { Agent } from '@/content/agents';

interface ChatContextType {
  agent: Agent | null;
  chatId: string | null;
  messages: any[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isSending: boolean;
  sendMessage: (text: string) => void;
  isLoading: boolean;
  isAgentLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ agentId, children }: { agentId: string | undefined; children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAgentLoading, setIsAgentLoading] = useState(true);

  const { isLoading, sendMessage: streamSendMessage } = useChatStream(agentId, chatId, setChatId, setMessages);

  useEffect(() => {
    if (!agentId) {
      setIsAgentLoading(false);
      return;
    }
    setIsAgentLoading(true);
    fetchAgent(agentId)
      .then(apiAgent => {
        setAgent(mapApiAgentToUi(apiAgent));
        setIsAgentLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch agent:', err);
        setAgent(null);
        setIsAgentLoading(false);
      });
  }, [agentId]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isSending) return;
    setInputValue("");
    streamSendMessage(text, setIsSending);
  };

  return (
    <ChatContext.Provider value={{
      agent,
      chatId,
      messages,
      inputValue,
      setInputValue,
      isSending,
      sendMessage,
      isLoading,
      isAgentLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};