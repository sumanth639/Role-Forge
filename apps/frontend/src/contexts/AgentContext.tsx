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

const AGENTS_CACHE_KEY = 'agents_cache';

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAgents = async () => {
    setLoading(true);
    try {
      const apiAgents = await fetchAgents();
      const uiAgents = apiAgents.map(mapApiAgentToUi);
      setAgents(uiAgents);
      localStorage.setItem(AGENTS_CACHE_KEY, JSON.stringify(uiAgents));
    } catch (error) {
      console.error("Failed to load agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Load from cache first
      const cached = localStorage.getItem(AGENTS_CACHE_KEY);
      if (cached) {
        try {
          const cachedAgents = JSON.parse(cached);
          setAgents(cachedAgents);
        } catch (e) {
          console.error('Failed to parse cached agents:', e);
        }
      }
      // Then refresh from server
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