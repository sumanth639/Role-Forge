
export type AgentMode = "STRICT" | "FLEXIBLE";

export function buildSystemPrompt(
  basePrompt: string,
  mode: AgentMode
) {
  if (mode === "STRICT") {
    return `
You must strictly follow the instructions below.
Do not deviate from the role.
Do not add assumptions.
Do not change tone unless explicitly instructed.

${basePrompt}
`.trim();
  }

  return `
You may adapt your tone slightly if it helps the user,
but you must stay aligned with the role and intent.

${basePrompt}
`.trim();
}
