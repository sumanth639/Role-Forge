import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { CreateAgentForm } from '@/components/create-agent/CreateAgentForm';
import { AgentPreview } from '@/components/create-agent/AgentPreview';
import { availableIcons, IconName } from '@/content/icons';
import { buildSystemPrompt } from '@/lib/utils';
import { createAgent } from "@/api/agents";
import { useAgents } from "@/contexts/AgentContext";
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

export default function CreateAgent() {
  const navigate = useNavigate();
  const { refreshAgents } = useAgents();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>('Brain');
  const [mode, setMode] = useState<'strict' | 'flexible'>('flexible');
  const [selectedColor, setSelectedColor] = useState<string>('mint');
  const [isForging, setIsForging] = useState(false);

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
        icon: selectedIcon,
        color: selectedColor,
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
          <CreateAgentForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            mode={mode}
            setMode={setMode}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            isForging={isForging}
            onSubmit={onSubmit}
          />

          <AgentPreview
            name={name}
            description={description}
            mode={mode}
            selectedColor={selectedColor}
            selectedIcon={selectedIcon}
          />
        </div>
      </main>
    </div>
  );
}