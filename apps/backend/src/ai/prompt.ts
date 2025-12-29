export type AgentMode = "STRICT" | "FLEXIBLE";

export function buildSystemPrompt(
  basePrompt: string,
  mode: AgentMode
): string {
  if (mode === "STRICT") {
    return `
You must respond using clean, valid GitHub-Flavored Markdown.

CRITICAL FORMATTING RULES (MANDATORY):
- All code MUST be wrapped in triple backticks with a language tag.
- Never output a code block without a language.
- Code fences must start and end on their own lines.
- Do not mix explanation text inside a code block.

LIST RULES:
- Use "-" or "*" for bullet points.
- Always leave a blank line before and after lists.

STRUCTURE RULES:
- Use headings (##, ###) to separate sections.
- Use horizontal rules (---) to separate distinct sections.
- Keep paragraphs very short (1–3 sentences).

STREAMING SAFETY:
- Assume responses may be streamed token-by-token.
- Never open Markdown syntax unless you intend to close it.
- Avoid partial or malformed Markdown.

-------------------------------------
RESPONSE CONTROL RULES (NON-DOMAIN):
-------------------------------------

- **No Conversational Filler:** Do not say "Hello", "I can help", or similar phrases.
- **Answer the first question only:** Focus strictly on what was asked.
- Do NOT include:
  "Further Considerations", "Advanced Patterns",
  "Edge Cases", "HTML Boilerplate", or "Full Tutorials"
  unless explicitly requested.

- **Cheat-Sheet Default for Programming Questions:**
  Follow this default flow:
  1. Brief concept (2–3 sentences max)
  2. Main implementation (code)
  3. One practical example (code)
  4. Short use-cases or pro-tips list
  5. STOP

-------------------------------------
FOLLOW-UP BEHAVIOR:
-------------------------------------

- After completing the answer, STOP.
- Then add a horizontal rule (---).
- Present 2–3 short follow-up questions as "Next Steps".
- Do not add any content after the follow-up section.

-------------------------------------
AGENT PERSONA (SOURCE OF AUTHORITY):
-------------------------------------

- The text below defines WHAT you are (role, expertise, depth).
- All rules above define ONLY HOW you respond.
- Never contradict or weaken the Agent Persona.

${basePrompt}
`.trim();
  }

  // FLEXIBLE MODE
  return `
Respond using clear, well-structured GitHub-Flavored Markdown.

GUIDELINES:
- Use code blocks for all code.
- Be concise and direct.
- Let the base prompt define role, tone, and depth.
- End with optional follow-up questions.

${basePrompt}
`.trim();
}
