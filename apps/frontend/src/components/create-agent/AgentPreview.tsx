import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicIcon } from '@/components/DynamicIcon';
import { IconName } from '@/content/icons';
import { cn, colorClasses, iconColorClasses } from '@/lib/utils';

interface AgentPreviewProps {
  name: string;
  description: string;
  mode: 'strict' | 'flexible';
  selectedColor: string;
  selectedIcon: IconName;
}

export function AgentPreview({
  name,
  description,
  mode,
  selectedColor,
  selectedIcon,
}: AgentPreviewProps) {
  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: '150ms' }}>
      <div className="sticky top-28">
        <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Live Blueprint Preview</p>
        <Card className="shadow-elevated border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className={cn('h-1.5 w-full', `bg-${selectedColor}`)} />
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner', colorClasses[selectedColor])}>
                <DynamicIcon
                  name={selectedIcon}
                  className={iconColorClasses[selectedColor]}
                  size={26}
                />
              </div>
              <Badge variant={mode === 'strict' ? 'strict' : 'flexible'}>
                {mode === 'strict' ? 'Strict' : 'Flexible'}
              </Badge>
            </div>
            <CardTitle className="mt-5 text-xl font-bold">
              {name || 'Untitled Agent'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm leading-relaxed line-clamp-3">
              {description || 'Your agent\'s purpose will appear here as you craft its persona...'}
            </CardDescription>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Note:</strong> Forging creates a permanent entity in your workspace. You can refine the behavior later via the Armory.
          </p>
        </div>
      </div>
    </div>
  );
}