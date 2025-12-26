// src/pages/Chat.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { Send } from 'lucide-react';
import { useAgents } from "@/contexts/AgentContext";
import { useChatStream } from '@/hooks/useChatStream';

export default function Chat() {
  const { agentId } = useParams<{ agentId: string }>();
  const { agents } = useAgents();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [agent, setAgent] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { isLoading: chatLoading, sendMessage } = useChatStream(agentId, chatId, setChatId, setMessages);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!agentId || agents.length === 0) return;
    const found = agents.find(a => a.id === agentId);
    if (found) setAgent(found);
  }, [agentId, agents]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;
    const text = inputValue;
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    sendMessage(text, setIsSending);
  };

  if (!agent) {
    return <div className="min-h-screen flex items-center justify-center">Connecting...</div>;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden overflow-x-hidden">
      <Navigation />
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-32">
        <div className="mx-auto max-w-3xl px-6 py-10 space-y-8 min-w-0">
          {messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isStreaming={msg.id.toString().startsWith("streaming-")} 
            />
          ))}
          {messages.some(m => m.id.startsWith("streaming-")) && <TypingIndicator />}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-3xl relative flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            placeholder={`Message ${agent?.name || 'Agent'}...`}
            value={inputValue}
            disabled={isSending}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-10 max-h-32 resize-none rounded-2xl bg-card/50 backdrop-blur-md border-border/50 pr-12 overflow-y-auto"
            rows={1}
          />
          <Button 
            size="icon" 
            className="h-10 w-10 flex-shrink-0" 
            disabled={!inputValue.trim() || isSending}
            onClick={handleSendMessage}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}