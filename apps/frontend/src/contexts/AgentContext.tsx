import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAgents } from "@/api/agents";
import { mapApiAgentToUi } from "@/mappers/agentMapper";
import { Agent } from "@/content/agents";

interface AgentContextType {
  agents: Agent[];
  loading: boolean;
  refreshAgents: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAgents = async () => {
    // We only set loading to true if we don't have agents yet 
    // This prevents the "flicker" when updating or returning to the page
    if (agents.length === 0) setLoading(true); 
    
    try {
      const apiAgents = await fetchAgents();
      const uiAgents = apiAgents.map(mapApiAgentToUi);
      setAgents(uiAgents);
    } catch (error) {
      console.error("Failed to load agents into context:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshAgents();
    }
  }, []);

  return (
    <AgentContext.Provider value={{ agents, loading, refreshAgents }}>
      {children}
    </AgentContext.Provider>
  );
}

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgents must be used within AgentProvider");
  return context;
};