export function LoadingAgent() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono animate-fade-in">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <span>Loading agent…</span>
    </div>
  );
}
