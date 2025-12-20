import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildSystemPrompt(name: string, description: string, mode: string) {
  const strictness = mode === "strict" || mode === "STRICT"
    ? "Be precise, follow instructions strictly, avoid assumptions."
    : "Be helpful, flexible, and explain clearly with examples when useful.";

  return `
You are an AI agent named "${name}".

Your role:
${description}

Behavior rules:
${strictness}
`.trim();
}

export const colorClasses: Record<string, string> = {
  lavender: 'bg-lavender/15',
  mint: 'bg-mint/15',
  peach: 'bg-peach/15',
  sky: 'bg-sky/15',
  rose: 'bg-rose/15',
  amber: 'bg-amber/15',
};

export const iconColorClasses: Record<string, string> = {
  lavender: 'text-lavender',
  mint: 'text-mint',
  peach: 'text-peach',
  sky: 'text-sky',
  rose: 'text-rose',
  amber: 'text-amber',
};
