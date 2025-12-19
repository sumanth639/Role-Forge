import { Navigation } from '@/components/Navigation';
import { AgentCard } from '@/components/AgentCard';
import { agents } from '@/content/agents';

const Agents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance leading-tight">
            All Agents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our collection of specialized AI agents designed to assist with various tasks and challenges.
          </p>
        </header>

        {/* Agents Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              Available Agents
            </h2>
            <p className="text-sm text-muted-foreground">
              {agents.length} agents available
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Agents;