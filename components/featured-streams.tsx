'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import { Loader2 } from 'lucide-react';
import { getTopStreams } from '@/lib/twitch/api';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import type { Stream } from '@/types/streamer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const STREAMS_PER_PAGE = 20;

export function FeaturedStreams() {
  const router = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadMoreStreams = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const data = await getTopStreams(STREAMS_PER_PAGE, cursor);
      
      if (!data.streams.length || data.streams.length < STREAMS_PER_PAGE) {
        setHasMore(false);
      }
      
      setStreams(prev => [...prev, ...data.streams]);
      setCursor(data.cursor);
    } catch (error) {
      console.error('Failed to fetch more streams:', error);
      setError('Failed to load more streams');
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, hasMore, loadingMore]);

  const loadingRef = useInfiniteScroll(loadMoreStreams, {
    threshold: 0.5,
    rootMargin: '100px',
    throttleMs: 500,
    disabled: !hasMore || loadingMore || loading,
  });

  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLoading(true);
        const data = await getTopStreams(STREAMS_PER_PAGE);
        setStreams(data.streams);
        setCursor(data.cursor);
        setHasMore(data.streams.length === STREAMS_PER_PAGE);
      } catch (error) {
        console.error('Failed to fetch initial streams:', error);
        setError('Failed to load streams');
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  if (loading && streams.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && streams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Featured Streams</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream, index) => (
          <Card 
            key={`${stream.id}-${index}`} 
            className="overflow-hidden cursor-pointer"
            onClick={() => router.push(`/stream/${stream.username}`)}
          >
            <div className="aspect-video relative">
              {stream.thumbnailUrl && (
                <Image
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={streams.indexOf(stream) < STREAMS_PER_PAGE}
                />
              )}
              <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                LIVE
              </div>
              <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                {stream.viewerCount.toLocaleString()} viewers
              </div>
              {stream.userId && (
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
                  {stream.tags.map((tag, tagIndex) => (
                    <span
                      key={`${stream.id}-${tag}-${tagIndex}`}
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
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-6">
          {loadingMore ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
    </div>
  );
}