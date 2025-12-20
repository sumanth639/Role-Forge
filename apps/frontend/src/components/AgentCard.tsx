import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Agent } from '@/content/agents';
import { IconName } from '@/content/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Trash2, Plus, MoreVertical, Edit } from 'lucide-react';
import { createChat } from "@/api/chats";
import { createAgent } from "@/api/agents";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { graphqlRequest } from '@/api/graphql';
import { useAgents } from "@/contexts/AgentContext";

interface AgentCardProps {
  agent: Agent;
  onDelete?: (agentId: string) => void;
  onEdit?: (agent: Agent) => void;
  variant?: 'home' | 'list';
}

function buildSystemPrompt(name: string, description: string, mode: string) {
  return `You are an AI agent named "${name}".\n\nRole:\n${description}\n\nStrictness: ${mode}.`.trim();
}

export function AgentCard({ agent, onDelete, onEdit, variant = 'list' }: AgentCardProps) {
  const navigate = useNavigate();
  const { refreshAgents } = useAgents();
  const [isAdding, setIsAdding] = useState(false);
  const isHomePage = variant === 'home';

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

  async function handleOpenChat() {
    if (isHomePage) return;
    
    try {
      // 1. First, check if a chat already exists for this agent
      const existing = await graphqlRequest<{ chatByAgent: { id: string } | null }>(
        `query ChatByAgent($agentId: ID!) { 
          chatByAgent(agentId: $agentId) { id } 
        }`,
        { agentId: agent.id }
      );
  
      let chatIdToUse = existing.chatByAgent?.id;
  
      // 2. If no chat exists, then create it
      if (!chatIdToUse) {
        const chat = await createChat(agent.id);
        chatIdToUse = chat.id;
      }
  
      // 3. Navigate using the chat ID or agent ID (depending on your Chat page logic)
      navigate(`/chat/${agent.id}`);
      
    } catch (err) {
      console.error("Chat Error:", err);
      toast.error("Failed to start session");
    }
  }

  async function handleAddAgent(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await createAgent({
        name: agent.name,
        description: agent.description || "",
        systemPrompt: buildSystemPrompt(agent.name, agent.description || "", agent.mode),
        mode: agent.mode.toUpperCase() as "STRICT" | "FLEXIBLE",
      });

      await refreshAgents();
      
      toast.success(`${agent.name} added to your Armory`);
      navigate("/agents");
    } catch (err) {
      toast.error("Error during the forging process.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Card
      onClick={!isHomePage ? handleOpenChat : undefined}
      className={`group relative overflow-hidden transition-all duration-300 ${
        !isHomePage ? 'cursor-pointer hover:shadow-elevated hover:-translate-y-1 border-border' : 'border-dashed border-border/60'
      }`}
    >
      <div className={`absolute inset-0 opacity-[0.03] ${colorClasses[agent.color]?.replace('/15', '')}`} />
      
      {isHomePage && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all z-20">
          <Button
            variant="pill"
            size="sm"
            className="w-[80%] shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform"
            onClick={handleAddAgent}
            disabled={isAdding}
          >
            {isAdding ? "Forging your assistant..." : <><Plus size={16} className="mr-2" /> Add Agent</>}
          </Button>
        </div>
      )}

      {!isHomePage && (onDelete || onEdit) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(agent); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${agent.name}"?`)) {
                    onDelete(agent.id);
                  }
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="p-0">
        <CardHeader className="pb-4 relative">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClasses[agent.color]} transition-transform duration-300 group-hover:scale-105`}>
            <DynamicIcon name={agent.icon as IconName} className={iconColorClasses[agent.color]} size={26} />
          </div>
          <CardTitle className="mt-5 text-lg flex items-center justify-between">
            <span className="flex gap-2 items-center">
              {agent.name}
              {!isHomePage && <ArrowUpRight size={16} className="text-primary" />}
            </span>
            <Badge variant={agent.mode === 'strict' ? 'strict' : 'flexible'}>
              {agent.mode === 'strict' ? 'Strict' : 'Flexible'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="line-clamp-2">
            {agent.description}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}