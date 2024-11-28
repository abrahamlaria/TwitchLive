'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { getStreamerInfo, getStreamStatus } from '@/lib/twitch';
import type { StreamerInfo } from '@/types/streamer';

export function useFavorites() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [favorites, setFavorites] = useState<StreamerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data: favoriteStreamers } = await supabase
        .from('favorite_streamers')
        .select('streamer_id')
        .eq('user_id', user.id);

      if (!favoriteStreamers) return;

      const streamersData = await Promise.all(
        favoriteStreamers.map(async ({ streamer_id }) => {
          const [info, status] = await Promise.all([
            getStreamerInfo(streamer_id),
            getStreamStatus(streamer_id)
          ]);

          return {
            id: streamer_id,
            username: info.data[0].display_name,
            avatarUrl: info.data[0].profile_image_url,
            isLive: status.data.length > 0,
            currentGame: status.data[0]?.game_name,
            viewerCount: status.data[0]?.viewer_count,
          };
        })
      );

      setFavorites(streamersData);
      setLoading(false);
    };

    fetchFavorites();

    // Subscribe to changes
    const channel = supabase
      .channel('favorite_streamers')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorite_streamers',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchFavorites();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, user]);

  const toggleFavorite = async (streamerId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('favorite_streamers')
      .select('*')
      .eq('user_id', user.id)
      .eq('streamer_id', streamerId)
      .single();

    if (data) {
      await supabase
        .from('favorite_streamers')
        .delete()
        .eq('user_id', user.id)
        .eq('streamer_id', streamerId);
    } else {
      await supabase
        .from('favorite_streamers')
        .insert({ user_id: user.id, streamer_id: streamerId });
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite
  };
}