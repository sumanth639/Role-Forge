import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { fixMarkdownFinal } from "@/lib/markdown-utils";
import { ChevronDown } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "USER" | "model";
  content: string;
};

const COLLAPSED_HEIGHT = 96; // px (~4 lines)

export function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "USER";

  // Safety
  if (!isUser && !message.content?.trim() && isStreaming) return null;

  // Accordion state (ONLY for user messages)
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect overflow
  useEffect(() => {
    if (!isUser || !contentRef.current) return;

    const el = contentRef.current;
    setIsOverflowing(el.scrollHeight > COLLAPSED_HEIGHT + 4);
  }, [message.content, isUser]);

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(isUser ? "max-w-[80%]" : "w-full min-w-0")}>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 relative",
            isUser
              ? "bg-card border border-border/60"
              : "bg-transparent"
          )}
        >
          {/* USER MESSAGE (Accordion) */}
          {isUser ? (
            <>
              <div
                ref={contentRef}
                className={cn(
                  "whitespace-pre-wrap text-sm leading-relaxed transition-all overflow-hidden",
                  !expanded && isOverflowing && "max-h-[96px]"
                )}
              >
                {message.content}
              </div>

              {/* Chevron toggle */}
              {isOverflowing && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
                >
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      expanded && "rotate-180"
                    )}
                  />
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </>
          ) : (
            /* MODEL MESSAGE */
            isStreaming ? (
              <MarkdownRenderer content={message.content} isStreaming />
            ) : (
              <MarkdownRenderer content={fixMarkdownFinal(message.content)} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
