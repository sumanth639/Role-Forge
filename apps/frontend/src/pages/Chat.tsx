import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DynamicIcon } from '@/components/DynamicIcon';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatHistoryPanel } from '@/components/ChatHistoryPanel';
import { agents } from '@/content/agents';
import { chatSessions } from '@/content/chats';
import { IconName } from '@/content/icons';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Chat() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const agent = agents.find((a) => a.id === agentId);
  const sessions = chatSessions[agentId || ''] || [];
  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id || '');
  const [inputValue, setInputValue] = useState('');

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const handleSelectAgent = (selectedAgentId: string) => {
    navigate(`/chat/${selectedAgentId}`);
  };

  const colorClasses: Record<string, string> = {
    lavender: 'bg-lavender/15',
    mint: 'bg-mint/15',
    peach: 'bg-peach/15',
    sky: 'bg-sky/15',
    rose: 'bg-rose/15',
    amber: 'bg-amber/15',
  };

  const iconColorClasses: Record<string, string> = {
    lavender: 'text-lavender',
    mint: 'text-mint',
    peach: 'text-peach',
    sky: 'text-sky',
    rose: 'text-rose',
    amber: 'text-amber',
  };

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

      {/* Chat Header */}
      <div className="sticky top-20 z-40 backdrop-blur-xl ">
        <div className="mx-auto max-w-4xl px-6 py-4 ">
          <div className="flex items-center gap-4 ">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 hover:bg-secondary rounded-lg"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colorClasses[agent.color])}>
              <DynamicIcon
                name={agent.icon as IconName}
                className={iconColorClasses[agent.color]}
                size={20}
              />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{agent.name}</h2>
              <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>
            </div>

          </div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="space-y-8"> 
            {currentSession?.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <div className="h-32" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="mx-auto max-w-3xl px-6 pb-8">
          <div className="relative flex items-center group">
            <Input
              placeholder={`Message ${agent.name}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-12 py-6 rounded-2xl border-border/50 bg-card/50 backdrop-blur-md focus-visible:ring-primary/20 shadow-soft transition-all"
            />
            <Button
              size="icon"
              className={cn(
                "absolute right-1.5 h-9 w-9 rounded-xl transition-all",
                inputValue ? "bg-primary opacity-100" : "bg-muted opacity-50"
              )}
            >
              <Send size={16} />
            </Button>
          </div>

        </div>
      </div>

      <ChatHistoryPanel
        agents={agents}
        currentAgentId={agentId || ''}
        onSelectAgent={handleSelectAgent}
      />
    </div>
  );
}