import { Navigation } from '@/components/Navigation';
import { AgentCard } from '@/components/AgentCard';
import { EditAgentDialog } from '@/components/EditAgentDialog';
import { useEffect, useState } from "react";
import { fetchAgents, deleteAgent, fetchAgent, type ApiAgent } from "@/api/agents";
import { Agent } from "@/content/agents";
import { mapApiAgentToUi } from "@/mappers/agentMapper";
import { toast } from "sonner";

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSystemPrompt, setEditingSystemPrompt] = useState<string>('');

  const loadAgents = () => {
    fetchAgents()
      .then((apiAgents) => {
        const uiAgents = apiAgents.map(mapApiAgentToUi);
        setAgents(uiAgents);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleEdit = async (agent: Agent) => {
    try {
      const apiAgent = await fetchAgent(agent.id);
      setEditingSystemPrompt(apiAgent.systemPrompt || '');
      setEditingAgent(agent);
      setEditDialogOpen(true);
    } catch (err) {
      console.error('Failed to fetch agent details:', err);
      toast.error('Failed to load agent details');
    }
  };

  const handleDelete = async (agentId: string) => {
    try {
      await deleteAgent(agentId);
      toast.success('Agent deleted successfully');
      loadAgents(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete agent:', err);
      toast.error('Failed to delete agent');
    }
  };


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
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                variant="list"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>

      <EditAgentDialog
        agent={editingAgent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={loadAgents}
        systemPrompt={editingSystemPrompt}
      />
    </div>
  );
};

export default Agents;