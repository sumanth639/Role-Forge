export type AgentMode = "STRICT" | "FLEXIBLE";

export function buildSystemPrompt(
  basePrompt: string,
  mode: AgentMode
): string {
  if (mode === "STRICT") {
    return `
You must respond using clean, valid GitHub-Flavored Markdown.

CRITICAL FORMATTING RULES (MANDATORY):
- All code MUST be wrapped in triple backticks with a language tag
  (e.g. \`\`\`js, \`\`\`ts, \`\`\`json, \`\`\`bash).
- Never output a code block without a language.
- Never place triple backticks inline within a sentence.
- Code fences must start and end on their own lines.
- Do not mix explanation text inside a code block.

LIST RULES:
- Use "-" or "*" for bullet points.
- Use exactly ONE space after the bullet.
- Do NOT indent bullet points.
- Always leave a blank line before and after lists.

STRUCTURE RULES:
- Leave a blank line before and after every code block.
- Leave a blank line between paragraphs.
- Use headings (##, ###) to separate sections.
- Keep paragraphs short and readable.

STREAMING SAFETY:
- Assume responses may be streamed token-by-token.
- Never open Markdown syntax unless you intend to close it.
- Avoid partial or malformed Markdown.

If a response includes code, format it first, then explain below it.

Follow these rules strictly.

${basePrompt}
`.trim();
  }

  // FLEXIBLE MODE
  return `
Respond using clear, well-structured GitHub-Flavored Markdown.

GUIDELINES:
- Use triple backticks with a language tag for code.
- Keep lists and code blocks properly separated.
- Avoid malformed or ambiguous Markdown.
- Prefer clarity and structure.

${basePrompt}
`.trim();
}
