// Create a new component or add to MessageBubble.tsx
export function TypingIndicator() {
  return (
    <div className="flex justify-start w-full">
      <div className="bg-card border border-border/60 rounded-2xl rounded-bl-lg px-4 py-3 shadow-soft">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}