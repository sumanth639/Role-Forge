import { useState, useEffect } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { agents as initialAgents } from '@/content/agents';
import { Agent } from '@/content/agents';

export function AgentsSection() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const handleDelete = (agentId: string) => {
    setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-foreground opacity-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
          Your Agents
        </h2>
        <p className="text-sm text-muted-foreground opacity-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
          {agents.length} agents available
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent, index) => (
          <div 
            key={agent.id} 
            className="opacity-0 animate-fade-up" 
            style={{ animationDelay: `${350 + index * 75}ms` }}
          >
            <AgentCard agent={agent} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </section>
  );
}

