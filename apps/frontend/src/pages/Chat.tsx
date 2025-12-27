import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { Send, ArrowDown } from 'lucide-react';
import { useAgents } from "@/contexts/AgentContext";
import { useChatStream } from '@/hooks/useChatStream';
import { cn } from '@/lib/utils';

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
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { sendMessage } = useChatStream(agentId, chatId, setChatId, setMessages);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
  };

  useEffect(() => {
    if (scrollRef.current && !showScrollButton) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (!agentId || agents.length === 0) return;
    const found = agents.find(a => a.id === agentId);
    if (found) setAgent(found);
  }, [agentId, agents]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;
    const text = inputValue;
    setInputValue("");
    textareaRef.current && (textareaRef.current.style.height = 'auto');
    sendMessage(text, setIsSending);
  };

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background overflow-x-hidden">
        <div className="rounded-md bg-[#0d1117] px-4 py-2 font-mono text-[13px] text-foreground border border-border/40">
          <span className="text-primary mr-2">{'>'}</span> Getting Agent...
        </div>
      </div>
    );
  }

  const showTypingIndicator =
    isSending && !messages.some(m => m.id.toString().startsWith("streaming-"));

  return (
    <div className="h-screen bg-background flex flex-col font-sans overflow-hidden overflow-x-hidden">
      <Navigation />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth pb-32 overflow-x-hidden"
      >
        <div className="mx-auto max-w-[54rem] px-4 md:px-6 py-10 space-y-10">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={msg.id.toString().startsWith("streaming-")}
            />
          ))}

          {showTypingIndicator && (
            <div className="flex justify-start pl-2">
              <TypingIndicator />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom */}
      <div
        className={cn(
          "fixed bottom-36 left-1/2 -translate-x-1/2 transition-all duration-300 z-50",
          showScrollButton
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollToBottom}
          className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 w-10 h-10"
        >
          <ArrowDown size={18} className="text-primary animate-bounce-slow" />
        </Button>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-4">
        <div className="mx-auto max-w-[50rem]">
          <div className="flex items-end gap-2 bg-card/80 backdrop-blur-2xl border border-border/60 rounded-[1.5rem] p-1.5">
            <Textarea
              ref={textareaRef}
              placeholder={`Message ${agent?.name || 'Agent'}...`}
              value={inputValue}
              disabled={isSending}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[44px] resize-none bg-transparent border-none focus-visible:ring-0 px-4 py-2.5 overflow-y-auto"
              rows={1}
            />
            <Button
              size="icon"
              disabled={!inputValue.trim() || isSending}
              onClick={handleSendMessage}
              className="h-9 w-9 rounded-full bg-primary"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
