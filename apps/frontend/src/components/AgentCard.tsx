import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Agent } from '@/content/agents';
import { IconName } from '@/content/icons';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Trash2, Plus, MoreVertical, Edit } from 'lucide-react';
import { createChat } from "@/api/chats";
import { createAgent } from "@/api/agents";
import { useState } from "react";
import { toast } from "sonner";
import { cn, buildSystemPrompt, colorClasses, iconColorClasses } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { graphqlRequest } from '@/api/graphql';
import { useAgents } from "@/contexts/AgentContext";

interface AgentCardProps {
  agent: Agent;
  onDelete?: (agentId: string) => void;
  onEdit?: (agent: Agent) => void;
  variant?: 'home' | 'list';
}

export function AgentCard({ agent, onDelete, onEdit, variant = 'list' }: AgentCardProps) {
  const navigate = useNavigate();
  const { refreshAgents } = useAgents();
  
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const isHomePage = variant === 'home';

  async function handleOpenChat() {
    if (isHomePage) return;
    
    try {
      const existing = await graphqlRequest<{ chatByAgent: { id: string } | null }>(
        `query ChatByAgent($agentId: ID!) { 
          chatByAgent(agentId: $agentId) { id } 
        }`,
        { agentId: agent.id }
      );
  
      let chatIdToUse = existing.chatByAgent?.id;
  
      if (!chatIdToUse) {
        const chat = await createChat(agent.id);
        chatIdToUse = chat.id;
      }
  
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
    // This is the function in src/api/agents.ts you just showed me
    await createAgent({
      name: agent.name,
      description: agent.description || "",
      systemPrompt: buildSystemPrompt(agent.name, agent.description || "", agent.mode),
      mode: agent.mode.toUpperCase() as "STRICT" | "FLEXIBLE",
      // CRITICAL FIX: Pass these from the template (agent object)
      icon: agent.icon,   
      color: agent.color, 
    });

    // Refresh global context so the list updates
    await refreshAgents();
    
    toast.success(`${agent.name} added to your Armory`);
    navigate("/agents");
  } catch (err) {
    console.error("Forging Error:", err);
    toast.error("Error during the forging process.");
  } finally {
    setIsAdding(false);
  }
}

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(agent.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
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
              {isAdding ? "Forging..." : <><Plus size={16} className="mr-2" /> Add Agent</>}
            </Button>
          </div>
        )}

        {!isHomePage && (onDelete || onEdit) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
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
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowDeleteDialog(true);
                  }}
                  className="text-destructive  focus:bg-destructive"
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
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClasses[agent.color]} transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
              <DynamicIcon name={agent.icon as IconName} className={iconColorClasses[agent.color]} size={26} />
            </div>
            <CardTitle className="mt-5 text-lg flex items-center justify-between">
              <span className="flex gap-2 items-center">
                {agent.name}
                {!isHomePage && <ArrowUpRight size={16} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />}
              </span>
              <Badge variant={agent.mode === 'strict' ? 'strict' : 'flexible'}>
                {agent.mode === 'strict' ? 'Strict' : 'Flexible'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <CardDescription className="line-clamp-2 leading-relaxed">
              {agent.description}
            </CardDescription>
          </CardContent>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this Agent?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">"{agent.name}"</span>? 
              This will remove all associated chat history and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}