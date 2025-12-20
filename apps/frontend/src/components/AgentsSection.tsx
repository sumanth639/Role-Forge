import { useState } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { agents as initialAgents } from '@/content/agents';
import { Agent } from '@/content/agents';
import { Badge } from './ui/badge';

export function AgentsSection() {
  const [agents] = useState<Agent[]>(initialAgents);

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground opacity-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
            Add these agents to your agent list
          </h2>
          <p className="text-muted-foreground opacity-0 animate-fade-up" style={{ animationDelay: '350ms' }}>
            Choose a specialized template to begin your workflow
          </p>
        </div>
        <Badge variant="secondary" className="w-fit h-7 opacity-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
          {agents.length} Templates Available
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <div 
            key={agent.id} 
            className="opacity-0 animate-fade-up" 
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <AgentCard agent={agent} variant="home" />
          </div>
        ))}
      </div>
    </section>
  );
}