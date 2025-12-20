import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Agent } from '@/content/agents';
import { updateAgent } from '@/api/agents';
import { toast } from 'sonner';

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this agent do?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="System instructions for the agent"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="strict"
                  checked={mode === 'strict'}
                  onChange={() => setMode('strict')}
                  className="accent-primary"
                />
                <span>Strict</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="flexible"
                  checked={mode === 'flexible'}
                  onChange={() => setMode('flexible')}
                  className="accent-primary"
                />
                <span>Flexible</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Forging...' : 'Forge Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

