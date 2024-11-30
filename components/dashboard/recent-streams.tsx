'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FollowButton } from '@/components/streamer/follow-button';

export function RecentStreams() {
  const { favorites } = useFavorites();
  const router = useRouter();
  const offlineStreams = favorites.filter(streamer => !streamer.isLive);

  if (offlineStreams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent streams</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offlineStreams.map((streamer) => (
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
              <div className="absolute bottom-3 right-3">
                <FollowButton streamerId={streamer.id} />
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold truncate">{streamer.username}</h3>
              <p className="text-sm text-muted-foreground mt-1">Offline</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}