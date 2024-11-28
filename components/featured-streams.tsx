'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getTopStreams } from '@/lib/twitch';
import type { Stream } from '@/types/streamer';

export function FeaturedStreams() {
  const { isAuthenticated } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopStreams() {
      try {
        const data = await getTopStreams();
        setStreams(data);
      } catch (error) {
        console.error('Failed to fetch top streams:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopStreams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Featured Streams</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                LIVE
              </div>
              <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                {stream.viewerCount.toLocaleString()} viewers
              </div>
              {isAuthenticated && (
                <div className="absolute top-3 right-3">
                  <FollowButton streamerId={stream.userId} />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{stream.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stream.game}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {stream.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}