'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { getStreamerInfo, getStreamStatus } from '@/lib/twitch/api';
import type { StreamerInfo } from '@/types/streamer';

export function useFavorites() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [favorites, setFavorites] = useState<StreamerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchStreamerData = useCallback(async (streamerId: string): Promise<StreamerInfo | null> => {
    try {
      const [info, status] = await Promise.all([
        getStreamerInfo(streamerId),
        getStreamStatus(streamerId)
      ]);

      if (!info.data?.[0]) return null;

      return {
        id: streamerId,
        username: info.data[0].display_name,
        avatarUrl: info.data[0].profile_image_url,
        isLive: status.data?.length > 0,
        currentGame: status.data?.[0]?.game_name ?? null,
        viewerCount: status.data?.[0]?.viewer_count ?? null,
      };
    } catch (error) {
      console.error(`Error fetching data for streamer ${streamerId}:`, error);
      return null;
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: favoriteStreamers, error } = await supabase
        .from('favorite_streamers')
        .select('streamer_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const streamersData = await Promise.all(
        favoriteStreamers.map(({ streamer_id }) => fetchStreamerData(streamer_id))
      );

      const validStreamers = streamersData.filter((data): data is StreamerInfo => data !== null);
      setFavorites(validStreamers);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, fetchStreamerData]);

  const toggleFavorite = useCallback(async (streamerId: string) => {
    if (!user) return;

    try {
      const isCurrentlyFollowing = favorites.some(f => f.id === streamerId);

      if (isCurrentlyFollowing) {
        await supabase
          .from('favorite_streamers')
          .delete()
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId);

        setFavorites(prev => prev.filter(f => f.id !== streamerId));
      } else {
        const streamerData = await fetchStreamerData(streamerId);
        if (streamerData) {
          await supabase
            .from('favorite_streamers')
            .insert({
              user_id: user.id,
              streamer_id: streamerId
            });

          setFavorites(prev => [...prev, streamerData]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [user, supabase, fetchStreamerData, favorites]);

  useEffect(() => {
    fetchFavorites();

    // Set up real-time subscription
    if (user) {
      channelRef.current = supabase
        .channel(`favorites_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorite_streamers',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            console.log('Received real-time update:', payload);
            await fetchFavorites(); // Refresh the entire list when changes occur
          }
        )
        .subscribe();

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [user, supabase, fetchFavorites]);

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