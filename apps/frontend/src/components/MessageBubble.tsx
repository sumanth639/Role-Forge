import { ChatMessage } from '@/content/chats';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role.toUpperCase() === 'USER';


  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-lg'
              : 'bg-card border border-border/60 text-card-foreground rounded-bl-lg'
          )}
        >
          {message.content}
        </div>
        <span className="mt-1.5 block text-xs text-muted-foreground px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}