'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import { Loader2 } from 'lucide-react';
import { getTopStreams } from '@/lib/twitch/api';
import { getStreamsByCategory } from '@/lib/twitch/categories';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { CategorySelector } from '@/components/categories/category-selector';
import type { Stream } from '@/types/streamer';
import type { CategoryType } from '@/types/category';
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
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryType>('games');

  const loadStreams = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setCursor(undefined);
      } else {
        setLoadingMore(true);
      }

      const { streams: newStreams, cursor: newCursor } = selectedCategory
        ? await getStreamsByCategory(selectedCategory, STREAMS_PER_PAGE, isInitial ? undefined : cursor)
        : await getTopStreams(STREAMS_PER_PAGE, isInitial ? undefined : cursor);

      if (!Array.isArray(newStreams)) {
        throw new Error('Invalid stream data received');
      }

      const formattedStreams = newStreams
        .filter(stream => stream && stream.thumbnail_url && stream.user_login)
        .map(stream => ({
          id: stream.id,
          userId: stream.user_id,
          username: stream.user_login,
          title: stream.title,
          thumbnailUrl: stream.thumbnail_url.replace('{width}', '800').replace('{height}', '450'),
          game: stream.game_name || 'Unknown Game',
          viewerCount: stream.viewer_count || 0,
          tags: stream.tags || []
        }));

      if (isInitial) {
        setStreams(formattedStreams);
      } else {
        setStreams(prev => [...prev, ...formattedStreams]);
      }

      setCursor(newCursor);
      setHasMore(!!newCursor && formattedStreams.length === STREAMS_PER_PAGE);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      setError('Failed to load streams');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [cursor, selectedCategory]);

  const loadMoreStreams = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await loadStreams();
  }, [loadingMore, hasMore, loadStreams]);

  const loadingRef = useInfiniteScroll(loadMoreStreams, {
    threshold: 0.5,
    disabled: !hasMore || loadingMore || loading
  });

  useEffect(() => {
    loadStreams(true);
  }, [selectedCategory]);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleTabChange = useCallback((tab: CategoryType) => {
    setActiveTab(tab);
    // Only clear category selection if changing tabs
    if (selectedCategory) {
      setSelectedCategory(null);
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategorySelector
        onSelect={handleCategorySelect}
        selectedCategoryId={selectedCategory}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream) => (
          <Card 
            key={stream.id}
            className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(`/stream/${stream.username}`)}
          >
            <div className="aspect-video relative">
              <Image
                src={stream.thumbnailUrl}
                alt={stream.title}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 right-3 bg-black/75 px-2 py-1 rounded text-sm font-medium text-white truncate max-w-[200px]">
                {stream.username}
              </div>
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
            <CardContent className="p-3 md:p-4">
              <h3 className="font-semibold truncate">{stream.title}</h3>
              {stream.game && (
                <p className="text-sm text-muted-foreground mt-1">{stream.game}</p>
              )}
              {stream.tags && stream.tags.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-2 mt-3">
                  {stream.tags.slice(0, 3).map((tag) => (
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
      {hasMore && !loading && (
        <div ref={loadingRef} className="flex justify-center py-4 md:py-6">
          {loadingMore && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
}