import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Agent } from '@/content/agents';
import { IconName } from '@/content/icons';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Trash2 } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onDelete?: (agentId: string) => void;
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(agent.id);
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-elevated hover:-translate-y-1 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 opacity-[0.03] ${colorClasses[agent.color]?.replace('/15', '')}`} />
      
      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
          title="Delete agent"
        >
          <Trash2 size={14} />
        </Button>
      )}
      
      <Link to={`/chat/${agent.id}`} className="block">
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClasses[agent.color]} transition-transform duration-300 group-hover:scale-105`}>
              <DynamicIcon 
                name={agent.icon as IconName} 
                className={iconColorClasses[agent.color]} 
                size={26} 
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={agent.mode === 'strict' ? 'strict' : 'flexible'}>
                {agent.mode === 'strict' ? 'Strict' : 'Flexible'}
              </Badge>
            </div>
          </div>
          <CardTitle className="mt-5 text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
            {agent.name}
            <ArrowUpRight size={16} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="line-clamp-2">
            {agent.description}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
}