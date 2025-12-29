export function AgentError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="rounded-md bg-destructive/10 px-4 py-2 font-mono text-[13px] text-destructive border border-destructive/20">
        <span className="text-destructive mr-2">!</span> Failed to load agent
      </div>
    </div>
  );
}