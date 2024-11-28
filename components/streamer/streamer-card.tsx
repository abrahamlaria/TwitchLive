import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Streamer } from '@/lib/types';

interface StreamerCardProps {
  streamer: Streamer;
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  return (
    <div className={cn(
      'group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent cursor-pointer transition-colors',
      streamer.isLive && 'bg-accent/50'
    )}>
      <div className="relative flex-shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={streamer.avatarUrl} alt={streamer.username} />
          <AvatarFallback>{streamer.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        {streamer.isLive && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-none truncate">{streamer.username}</div>
        {streamer.isLive && (
          <div className="mt-1.5 text-xs text-muted-foreground truncate">
            {streamer.currentGame}
          </div>
        )}
      </div>
      {streamer.isLive && (
        <Badge variant="secondary" className="ml-auto flex-shrink-0">
          {streamer.viewerCount.toLocaleString()}
        </Badge>
      )}
    </div>
  );
}