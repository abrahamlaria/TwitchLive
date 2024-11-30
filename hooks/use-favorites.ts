'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { getStreamerInfo, getStreamStatus } from '@/lib/twitch/api';
import type { StreamerInfo } from '@/types/streamer';

// Cache for streamer data
const streamerCache = new Map<string, { data: StreamerInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFavorites() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [favorites, setFavorites] = useState<StreamerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchStreamerData = useCallback(async (streamerId: string): Promise<StreamerInfo | null> => {
    try {
      // Check cache first
      const cached = streamerCache.get(streamerId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const [info, status] = await Promise.all([
        getStreamerInfo(streamerId),
        getStreamStatus(streamerId)
      ]);

      if (!info.data?.[0]) return null;

      const streamerInfo: StreamerInfo = {
        id: streamerId,
        username: info.data[0].display_name,
        avatarUrl: info.data[0].profile_image_url,
        isLive: status.data?.length > 0,
        currentGame: status.data?.[0]?.game_name ?? null,
        viewerCount: status.data?.[0]?.viewer_count ?? null,
      };

      // Update cache
      streamerCache.set(streamerId, {
        data: streamerInfo,
        timestamp: Date.now()
      });

      return streamerInfo;
    } catch (error) {
      console.error(`Error fetching data for streamer ${streamerId}:`, error);
      return null;
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: favoriteStreamers, error } = await supabase
        .from('favorite_streamers')
        .select('streamer_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const streamersData = await Promise.all(
        favoriteStreamers.map(({ streamer_id }) => fetchStreamerData(streamer_id))
      );

      if (mountedRef.current) {
        const validStreamers = streamersData.filter((data): data is StreamerInfo => data !== null);
        setFavorites(validStreamers);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, supabase, fetchStreamerData]);

  const toggleFavorite = useCallback(async (streamerId: string) => {
    if (!user) return;

    const isCurrentlyFollowing = favorites.some(f => f.id === streamerId);

    try {
      if (isCurrentlyFollowing) {
        // Immediate optimistic update for removal
        setFavorites(prev => prev.filter(f => f.id !== streamerId));
        streamerCache.delete(streamerId);

        await supabase
          .from('favorite_streamers')
          .delete()
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId);
      } else {
        const streamerData = await fetchStreamerData(streamerId);
        if (!streamerData) throw new Error('Failed to fetch streamer data');

        // Immediate optimistic update for addition
        setFavorites(prev => [...prev, streamerData]);

        await supabase
          .from('favorite_streamers')
          .insert({
            user_id: user.id,
            streamer_id: streamerId
          });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      fetchFavorites();
    }
  }, [user, supabase, fetchStreamerData, favorites, fetchFavorites]);

  useEffect(() => {
    mountedRef.current = true;

    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchFavorites();

    // Set up real-time subscription
    const channel = supabase
      .channel(`favorites_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_streamers',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Immediate update on database changes
          fetchFavorites();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, supabase, fetchFavorites]);

  // Refresh streamer statuses periodically
  useEffect(() => {
    if (favorites.length === 0) return;

    const interval = setInterval(() => {
      if (mountedRef.current) {
        fetchFavorites();
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [favorites.length, fetchFavorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFollowing: useCallback(
      (streamerId: string) => favorites.some(f => f.id === streamerId),
      [favorites]
    ),
  };
}