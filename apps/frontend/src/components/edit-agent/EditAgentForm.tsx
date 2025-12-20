import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditAgentFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: 'strict' | 'flexible';
  setMode: (mode: 'strict' | 'flexible') => void;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditAgentForm({
  name,
  setName,
  description,
  setDescription,
  prompt,
  setPrompt,
  mode,
  setMode,
  isLoading,
  onCancel,
  onSubmit,
}: EditAgentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Forging...' : 'Forge Changes'}
        </Button>
      </div>
    </form>
  );
}