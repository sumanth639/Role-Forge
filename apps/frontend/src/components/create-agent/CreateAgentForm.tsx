import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicIcon } from '@/components/DynamicIcon';
import { availableIcons, IconName } from '@/content/icons';
import { Check, Sparkles } from 'lucide-react';
import { cn, colorClasses, iconColorClasses } from '@/lib/utils';

interface CreateAgentFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  mode: 'strict' | 'flexible';
  setMode: (mode: 'strict' | 'flexible') => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedIcon: IconName;
  setSelectedIcon: (icon: IconName) => void;
  isForging: boolean;
  onSubmit: () => void;
}

const colors = [
  { name: 'lavender', class: 'bg-lavender' },
  { name: 'mint', class: 'bg-mint' },
  { name: 'peach', class: 'bg-peach' },
  { name: 'sky', class: 'bg-sky' },
  { name: 'rose', class: 'bg-rose' },
  { name: 'amber', class: 'bg-amber' },
];

export function CreateAgentForm({
  name,
  setName,
  description,
  setDescription,
  mode,
  setMode,
  selectedColor,
  setSelectedColor,
  selectedIcon,
  setSelectedIcon,
  isForging,
  onSubmit,
}: CreateAgentFormProps) {
  return (
    <div className="space-y-8 opacity-0 animate-fade-up" style={{ animationDelay: '0ms' }}>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Forge New Agent</h1>
        <p className="text-muted-foreground">
          Design a custom AI agent tailored to your specific needs.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Agent Name</label>
          <Input
            placeholder="e.g., Python Architect"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isForging}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description & Role</label>
          <textarea
            className="flex min-h-[120px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="What is this agent's specialty?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isForging}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Behavior Mode</label>
          <div className="flex gap-3">
            {(['flexible', 'strict'] as const).map((m) => (
              <button
                key={m}
                disabled={isForging}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 p-4 rounded-2xl border text-left transition-all duration-200',
                  mode === m
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground capitalize">{m}</span>
                  {mode === m && <Check size={16} className="text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {m === 'flexible' ? 'Creative & adaptive' : 'Precise & instruction-led'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Theme Color</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                disabled={isForging}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  'h-10 w-10 rounded-full transition-all duration-200',
                  color.class,
                  selectedColor === color.name
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                    : 'hover:scale-110'
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Identity Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {availableIcons.slice(0, 10).map((icon) => (
              <button
                key={icon}
                disabled={isForging}
                onClick={() => setSelectedIcon(icon)}
                className={cn(
                  'h-12 w-full rounded-xl border flex items-center justify-center transition-all duration-200',
                  selectedIcon === icon
                    ? 'border-primary bg-primary/10 shadow-soft'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                )}
              >
                <DynamicIcon
                  name={icon}
                  size={20}
                  className={selectedIcon === icon ? 'text-primary' : 'text-muted-foreground'}
                />
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="pill" size="lg"
          className="w-full relative overflow-hidden group"
          onClick={onSubmit}
          disabled={isForging || !name.trim()}
        >
          {isForging ? (
            <span className="flex items-center gap-2">
              <Sparkles size={18} className="animate-spin" />
              Striking the iron...
            </span>
          ) : (
            "Forge Agent"
          )}
        </Button>
      </div>
    </div>
  );
}