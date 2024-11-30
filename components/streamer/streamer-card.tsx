'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useStreamStatus } from '@/hooks/use-stream-status';
import { Loader2 } from 'lucide-react';
import type { StreamerInfo } from '@/types/streamer';
import { useRouter } from 'next/navigation';
import { FollowButton } from './follow-button';

interface StreamerCardProps {
  streamer: StreamerInfo;
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  const router = useRouter();
  const { isLive, viewerCount, currentGame, loading } = useStreamStatus(streamer.id);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent cursor-pointer transition-colors',
        isLive && 'bg-accent/50'
      )}
      onClick={() => router.push(`/stream/${streamer.username}`)}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={streamer.avatarUrl} alt={streamer.username} />
          <AvatarFallback>{streamer.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        {loading ? (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background">
            <Loader2 className="h-2 w-2 animate-spin" />
          </div>
        ) : isLive && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-none truncate">{streamer.username}</div>
        {isLive && currentGame && (
          <div className="mt-1.5 text-sm text-muted-foreground truncate">
            {currentGame}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        {isLive && viewerCount !== null && (
          <Badge variant="secondary">
            {viewerCount.toLocaleString()}
          </Badge>
        )}
        <FollowButton streamerId={streamer.id} />
      </div>
    </div>
  );
}