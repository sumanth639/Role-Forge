import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agent } from '@/content/agents';
import { updateAgent } from '@/api/agents';
import { toast } from 'sonner';
import { EditAgentForm } from './edit-agent/EditAgentForm';

interface EditAgentDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  systemPrompt?: string;
}

export function EditAgentDialog({ agent, open, onOpenChange, onSuccess, systemPrompt }: EditAgentDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'strict' | 'flexible'>('flexible');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setDescription(agent.description || '');
      setPrompt(systemPrompt || '');
      setMode(agent.mode);
    }
  }, [agent, systemPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !name.trim()) return;

    setIsLoading(true);
    try {
      await updateAgent(agent.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        systemPrompt: prompt.trim() || undefined,
        mode: mode.toUpperCase() as "STRICT" | "FLEXIBLE",
      });
      toast.success('Agent updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update agent:', err);
      toast.error('Failed to update agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update your agent's details. Changes will be saved to your workspace.
          </DialogDescription>
        </DialogHeader>
        <EditAgentForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

