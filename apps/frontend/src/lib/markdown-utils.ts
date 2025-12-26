export function fixMarkdownStreaming(content: string) {
  if (!content) return "";

  // Ensure code fences start on a new line
  let text = content.replace(/([^\n])```/g, "$1\n```");

  // Close unclosed code blocks temporarily
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) {
    text += "\n```";
  }

  return text;
}

export function fixMarkdownFinal(content: string) {
  if (!content) return "";

  let text = content.trim();

  // Ensure code fences start on a new line
  text = text.replace(/([^\n])```/g, "$1\n```");

  // 🔥 FIX: Normalize list indentation
  text = text.replace(/^\s+([*-])\s+/gm, "$1 ");

  // Close unclosed code blocks
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) {
    text += "\n```";
  }

  return text;
}
