'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { getTopStreams } from '@/lib/twitch/api';
import { useFavorites } from '@/hooks/use-favorites';
import { sortStreamsByRelevance } from '@/lib/recommendations/scoring';
import type { Stream } from '@/types/streamer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FollowButton } from '@/components/streamer/follow-button';
import { Button } from '@/components/ui/button';

const POOL_SIZE = 50;
const RECOMMENDATIONS_COUNT = 6;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function Recommendations() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { favorites } = useFavorites();
  const router = useRouter();

  const loadRecommendations = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get a larger pool of streams
      const { streams: allStreams } = await getTopStreams(POOL_SIZE);
      
      // Filter out already followed streams
      const followedIds = new Set(favorites.map(f => f.id));
      const availableStreams = allStreams.filter(
        (stream: Stream) => !followedIds.has(stream.userId)
      );

      // Prepare followed games and tags for scoring
      const followedGames = new Set(
        favorites
          .filter(f => f.currentGame)
          .map(f => f.currentGame!.toLowerCase())
      );

      const followedTags = new Set(
        favorites
          .flatMap(f => f.tags || [])
          .map(tag => tag.toLowerCase())
      );

      // Sort streams by relevance score
      const sortedStreams = sortStreamsByRelevance(
        availableStreams,
        followedGames,
        followedTags
      );

      // Take top recommendations
      setStreams(sortedStreams.slice(0, RECOMMENDATIONS_COUNT));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [favorites]);

  useEffect(() => {
    loadRecommendations();

    const interval = setInterval(() => {
      loadRecommendations(true);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadRecommendations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadRecommendations(true)}
          disabled={refreshing}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <Card 
            key={stream.id}
            className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(`/stream/${stream.username}`)}
          >
            <CardContent className="p-0">
              <div className="aspect-video relative">
                <Image
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                  LIVE
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className="bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                    {stream.viewerCount.toLocaleString()} viewers
                  </div>
                  {stream.userId && (
                    <FollowButton streamerId={stream.userId} />
                  )}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold truncate">{stream.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {stream.game}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}