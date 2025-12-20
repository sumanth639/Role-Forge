import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicIcon } from '@/components/DynamicIcon';
import { availableIcons, IconName } from '@/content/icons';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createAgent } from "@/api/agents";
import { useAgents } from "@/contexts/AgentContext";
import { toast } from "sonner";

function buildSystemPrompt(
  name: string,
  description: string,
  mode: "strict" | "flexible"
) {
  return `
You are an AI agent named "${name}".

Your role:
${description}

Behavior rules:
${
  mode === "strict"
    ? "Be precise, follow instructions strictly, avoid assumptions."
    : "Be helpful, flexible, and explain clearly with examples when useful."
}
`.trim();
}

export default function CreateAgent() {
  const navigate = useNavigate();
  const { refreshAgents } = useAgents();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>('Brain');
  const [mode, setMode] = useState<'strict' | 'flexible'>('flexible');
  const [selectedColor, setSelectedColor] = useState<string>('mint');
  const [isForging, setIsForging] = useState(false);

  const colors = [
    { name: 'lavender', class: 'bg-lavender' },
    { name: 'mint', class: 'bg-mint' },
    { name: 'peach', class: 'bg-peach' },
    { name: 'sky', class: 'bg-sky' },
    { name: 'rose', class: 'bg-rose' },
    { name: 'amber', class: 'bg-amber' },
  ];

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

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please provide a name for your agent");
      return;
    }

    setIsForging(true);
    try {
      await createAgent({
        name,
        description,
        systemPrompt: buildSystemPrompt(name, description, mode),
        mode: mode === "strict" ? "STRICT" : "FLEXIBLE",
      });

      // Update the global context so the list is fresh when we arrive
      await refreshAgents();

      toast.success(`${name} has been successfully forged!`);
      navigate("/agents");
    } catch (err) {
      console.error(err);
      toast.error("The forge has cooled. Failed to create agent.");
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link
          to="/agents"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back to agents</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
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
                size="lg"
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

          {/* Preview Section */}
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="sticky top-28">
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Live Blueprint Preview</p>
              <Card className="shadow-elevated border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className={cn('h-1.5 w-full', `bg-${selectedColor}`)} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner', colorClasses[selectedColor])}>
                      <DynamicIcon
                        name={selectedIcon}
                        className={iconColorClasses[selectedColor]}
                        size={26}
                      />
                    </div>
                    <Badge variant={mode === 'strict' ? 'strict' : 'flexible'}>
                      {mode === 'strict' ? 'Strict' : 'Flexible'}
                    </Badge>
                  </div>
                  <CardTitle className="mt-5 text-xl font-bold">
                    {name || 'Untitled Agent'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {description || 'Your agent\'s purpose will appear here as you craft its persona...'}
                  </CardDescription>
                </CardContent>
              </Card>
              
              <div className="mt-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> Forging creates a permanent entity in your workspace. You can refine the behavior later via the Armory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}