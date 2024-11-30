'use client';

import { useFavorites } from '@/hooks/use-favorites';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FollowButton } from '@/components/streamer/follow-button';

export function LiveStreams() {
  const { favorites, loading } = useFavorites();
  const router = useRouter();
  const liveStreams = favorites.filter(streamer => streamer.isLive);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (liveStreams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">None of your followed streamers are live</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {liveStreams.map((streamer) => (
        <Card 
          key={streamer.id}
          className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => router.push(`/stream/${streamer.username}`)}
        >
          <CardContent className="p-0">
            <div className="aspect-video relative">
              <Image
                src={streamer.avatarUrl}
                alt={streamer.username}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                LIVE
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <div className="bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                  {streamer.viewerCount?.toLocaleString()} viewers
                </div>
                <FollowButton streamerId={streamer.id} />
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold truncate">{streamer.username}</h3>
              {streamer.currentGame && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {streamer.currentGame}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}