'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getTopStreams } from '@/lib/twitch';
import type { Stream } from '@/types/streamer';
import Image from 'next/image';

export function FeaturedStreams() {
  const { isAuthenticated } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTopStreams() {
      try {
        const data = await getTopStreams();
        if (mounted) {
          setStreams(data);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to fetch top streams:', error);
        if (mounted) {
          setError('Failed to load streams');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTopStreams();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!streams.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No streams available</p>
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
              {stream.thumbnailUrl && (
                <Image
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={true}
                />
              )}
              <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                LIVE
              </div>
              {typeof stream.viewerCount === 'number' && (
                <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                  {stream.viewerCount.toLocaleString()} viewers
                </div>
              )}
              {isAuthenticated && stream.userId && (
                <div className="absolute top-3 right-3">
                  <FollowButton streamerId={stream.userId} />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{stream.title}</h3>
              {stream.game && (
                <p className="text-sm text-muted-foreground mt-1">{stream.game}</p>
              )}
              {stream.tags && stream.tags.length > 0 && (
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}