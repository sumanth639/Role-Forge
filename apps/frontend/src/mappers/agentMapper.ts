import { ApiAgent } from "@/api/agents";
import { Agent } from "@/content/agents";
import { availableIcons } from "@/content/icons";

const COLORS = [
  "lavender",
  "mint",
  "peach",
  "sky",
  "rose",
  "amber",
] as const;

export function mapApiAgentToUi(
  agent: ApiAgent,
  index: number
): Agent {
  return {
    id: agent.id,
    name: agent.name,
    description: agent.description ?? "No description provided.",
    mode: agent.mode === "STRICT" ? "strict" : "flexible",
    icon: availableIcons[index % availableIcons.length],
    color: COLORS[index % COLORS.length],
  };
}
