import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { fixMarkdownFinal } from "@/lib/markdown-utils";

type ChatMessage = {
  id: string;
  role: "USER" | "model";
  content: string;
};

export function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "USER";

  // SAFETY: Don't render an empty bubble if content is missing
  if (!isUser && !message.content?.trim() && isStreaming) {
    return null;
  }

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(isUser ? "max-w-[80%]" : "w-full min-w-0")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-card border border-border/60"
              : "bg-transparent"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : isStreaming ? (
            <MarkdownRenderer content={message.content} isStreaming />
          ) : (
            <MarkdownRenderer content={fixMarkdownFinal(message.content)} />
          )}
        </div>
      </div>
    </div>
  );
}