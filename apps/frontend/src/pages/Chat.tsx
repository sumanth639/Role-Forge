import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from '@/components/MessageBubble';
import { fetchAgents } from "@/api/agents";
import { fetchMessages } from "@/api/messages";
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { graphqlRequest } from '@/api/graphql';
import { TypingIndicator } from '@/components/ui/TypingIndicator';

export default function Chat() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const [agent, setAgent] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!agentId) return;

    async function initChat() {
      setIsLoading(true);
      try {
        const agents = await fetchAgents();
        const found = agents.find(a => a.id === agentId);
        if (!found) return;
        setAgent(found);

        const existing = await graphqlRequest<{ chatByAgent: { id: string } | null }>(
          `query ChatByAgent($agentId: ID!) { chatByAgent(agentId: $agentId) { id } }`,
          { agentId }
        );

        let chatIdToUse = existing.chatByAgent?.id;

        if (!chatIdToUse) {
          const created = await graphqlRequest<{ createChat: { id: string } }>(
            `mutation CreateChat($agentId: ID!) { createChat(agentId: $agentId) { id } }`,
            { agentId }
          );
          chatIdToUse = created.createChat.id;
        }

        setChatId(chatIdToUse);
        const msgs = await fetchMessages(chatIdToUse);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setIsLoading(false);
      }
    }

    initChat();
  }, [agentId]);

  const handleSendMessage = () => {
    if (!chatId || !inputValue.trim() || isSending) return;

    const userText = inputValue;
    const token = localStorage.getItem('token');
    setInputValue("");
    setIsSending(true);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "USER",
      content: userText,
      timestamp: "Just now",
    };
    setMessages((m) => [...m, userMsg]);

    const streamingId = `streaming-${Date.now()}`;
    const backendURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const eventSource = new EventSource(
      `${backendURL}/stream/chat/${chatId}?message=${encodeURIComponent(userText)}&token=${token}`
    );

    eventSource.onmessage = (e) => {
      if (e.data === "end") return;

      setMessages((m) => {
        const existingAiMsg = m.find((msg) => msg.id === streamingId);

        if (!existingAiMsg) {
          return [
            ...m,
            {
              id: streamingId,
              role: "ASSISTANT",
              content: e.data,
            },
          ];
        }

        return m.map((msg) =>
          msg.id === streamingId
            ? { ...msg, content: msg.content + e.data }
            : msg
        );
      });
    };

    eventSource.addEventListener("done", () => {
      eventSource.close();
      setIsSending(false);
    });

    eventSource.onerror = () => {
      eventSource.close();
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading encrypted chat...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="space-y-8"> 
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isSending && !messages.find(m => m.id.startsWith('streaming-')) && <TypingIndicator />}
          </div>
          <div className="h-32" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="mx-auto max-w-3xl px-6 pb-8">
          <div className="relative flex items-center group">
            <Input
              placeholder={isSending ? "AI is thinking..." : `Message ${agent.name}...`}
              value={inputValue}
              disabled={isSending}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12 py-6 rounded-2xl border-border/50 bg-card/50 backdrop-blur-md focus-visible:ring-primary/20 shadow-soft transition-all disabled:opacity-50"
            />
            <Button
              size="icon"
              className="absolute right-2"
              disabled={!inputValue.trim() || isSending}
              onClick={handleSendMessage}
            >
              <Send size={16} className={cn(isSending && "animate-pulse")} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}