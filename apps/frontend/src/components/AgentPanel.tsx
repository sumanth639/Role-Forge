import { useState } from 'react';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Agent } from '@/content/agents';
import { DynamicIcon } from '@/components/DynamicIcon';
import { IconName } from '@/content/icons';
import { cn } from '@/lib/utils';

interface AgentPanelProps {
  agents: Agent[];
  currentAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function AgentPanel({ agents, currentAgentId, onSelectAgent }: AgentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="fixed right-0 top-16 bottom-24 z-40">
      {/* Trigger Button */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            'rounded-l-xl rounded-r-none h-24 w-10 border border-r-0 shadow-card transition-all',
            isOpen && 'opacity-0'
          )}
        >
          <History size={18} />
        </Button>
      </div>

      {/* Panel */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-elevated transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold text-foreground">Agents</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl transition-all hover:bg-secondary flex items-center gap-3',
                currentAgentId === agent.id && 'bg-secondary border border-border'
              )}
            >
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', colorClasses[agent.color])}>
                <DynamicIcon
                  name={agent.icon as IconName}
                  className={iconColorClasses[agent.color]}
                  size={16}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{agent.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
