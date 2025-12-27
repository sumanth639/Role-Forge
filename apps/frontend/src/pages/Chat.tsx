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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { sendMessage } = useChatStream(agentId, chatId, setChatId, setMessages);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // 1. Handle Visual Viewport (Keyboard) Logic
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleVisualUpdate = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      const offset = window.innerHeight - vv.height;
      setKeyboardHeight(offset > 0 ? offset : 0);

      if (offset > 0) {
        setTimeout(scrollToBottom, 100);
      }
    };

    window.visualViewport.addEventListener('resize', handleVisualUpdate);
    window.visualViewport.addEventListener('scroll', handleVisualUpdate);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualUpdate);
      window.visualViewport?.removeEventListener('scroll', handleVisualUpdate);
    };
  }, []);

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
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    sendMessage(text, setIsSending);
  };

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="rounded-md bg-[#0d1117] px-4 py-2 font-mono text-[13px] text-foreground border border-border/40">
          <span className="text-primary mr-2">{'>'}</span> Getting Agent...
        </div>
      </div>
    );
  }

  const showTypingIndicator = isSending && !messages.some(m => m.id.toString().startsWith("streaming-"));

  return (
    // Change h-screen to h-[100dvh] to better handle dynamic mobile heights
    <div className="h-[100dvh] bg-background flex flex-col font-sans overflow-hidden">
      <Navigation />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth pb-32"
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

      {/* Scroll to bottom Button - adjusted for keyboard height */}
      <div className={cn(
          "fixed left-1/2 -translate-x-1/2 transition-all duration-300 z-50",
          showScrollButton ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        )}
        style={{ bottom: `calc(${keyboardHeight}px + 9rem)` }}
      >
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollToBottom}
          className="rounded-full bg-card/90 backdrop-blur-md border border-border/50 w-10 h-10 shadow-float"
        >
          <ArrowDown size={18} className="text-primary animate-bounce-slow" />
        </Button>
      </div>

      {/* 2. Updated Input Container Logic */}
      <div 
        className="fixed left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent transition-[bottom] duration-100 ease-out"
        style={{ 
          bottom: keyboardHeight,
          paddingBottom: keyboardHeight > 0 ? '1rem' : 'calc(1rem + env(safe-area-inset-bottom))'
        }}
      >
        <div className="mx-auto max-w-[50rem]">
          <div className="flex items-end gap-2 bg-card/80 backdrop-blur-2xl border border-border/60 rounded-[1.5rem] p-1.5 shadow-soft">
            <Textarea
              ref={textareaRef}
              placeholder={`Message ${agent?.name}...`}
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
              className="min-h-[44px] resize-none bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2.5 overflow-y-auto text-[15px]"
              rows={1}
            />
            <Button
              size="icon"
              disabled={!inputValue.trim() || isSending}
              onClick={handleSendMessage}
              className="h-9 w-9 rounded-full bg-primary flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}