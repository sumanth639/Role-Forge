import { Navigation } from '@/components/Navigation';
import { AgentCard } from '@/components/AgentCard';
import { EditAgentDialog } from '@/components/EditAgentDialog';
import { useState } from "react";
import { deleteAgent, fetchAgent } from "@/api/agents";
import { Agent } from "@/content/agents";
import { toast } from "sonner";
import { useAgents } from "@/contexts/AgentContext"; // Custom Hook from Step 1

const Agents = () => {
  // 1. Consume the Global Agent State
  const { agents, loading, refreshAgents } = useAgents();

  // 2. Local UI state for the Edit Dialog
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSystemPrompt, setEditingSystemPrompt] = useState<string>('');

  const handleEdit = async (agent: Agent) => {
    try {
      // Fetch full details including system prompt for the editor
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
      
      // 3. Trigger a global refresh to sync the list across the app
      await refreshAgents(); 
    } catch (err) {
      console.error('Failed to delete agent:', err);
      toast.error('Failed to delete agent');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header Section */}
        <header className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance leading-tight">
            All Agents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage your specialized AI assistants. Edit their behavior or start a new conversation.
          </p>
        </header>

        {/* Agents Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              Your Armory
            </h2>
            <p className="text-sm text-muted-foreground">
              {loading && agents.length === 0 ? "Syncing..." : `${agents.length} agents active`}
            </p>
          </div>
          
          {/* 4. Conditional Rendering based on Global State */}
          {loading && agents.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 w-full bg-muted/20 animate-pulse rounded-3xl border border-border/50" />
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">No agents found. Visit the home page to forge your first one!</p>
            </div>
          ) : (
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
          )}
        </section>
      </main>

      {/* Shared Edit Dialog */}
      <EditAgentDialog
        agent={editingAgent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={refreshAgents} 
        systemPrompt={editingSystemPrompt}
      />
    </div>
  );
};

export default Agents;