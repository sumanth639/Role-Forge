import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from '@/components/MessageBubble';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { useAgents } from "@/contexts/AgentContext";
import { useChatStream } from '@/hooks/useChatStream'; // Use the context!

export default function Chat() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agents } = useAgents(); // Get agents from global state

  const [agent, setAgent] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { isLoading: chatLoading, sendMessage } = useChatStream(agentId, chatId, setChatId, setMessages);

  // Effect: Immediate Agent Setup (No loading needed for this part)
  useEffect(() => {
    if (!agentId || agents.length === 0) return;
    const found = agents.find(a => a.id === agentId);
    if (found) {
      setAgent(found);
    }
  }, [agentId, agents]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;
    const userText = inputValue;
    setInputValue("");
    sendMessage(userText, setIsSending);
  };

  // If agent isn't in context yet and we're loading, show loader
  if ((isLoading || chatLoading) && !agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Connecting to neural link...</div>
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
              placeholder={isSending ? "AI is thinking..." : `Message ${agent?.name || 'Agent'}...`}
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