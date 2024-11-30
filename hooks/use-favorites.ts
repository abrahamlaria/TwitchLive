'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { getStreamerInfo, getStreamStatus } from '@/lib/twitch';
import type { StreamerInfo } from '@/types/streamer';

// Cache streamer data to reduce API calls
const streamerCache = new Map<string, { data: StreamerInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFavorites() {
  const [favorites, setFavorites] = useState<StreamerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();
  const { user, isAuthenticated } = useAuth();

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

      const streamerInfo: StreamerInfo = {
        id: streamerId,
        username: info.username,
        avatarUrl: info.avatarUrl,
        isLive: status.isLive,
        currentGame: status.currentGame,
        viewerCount: status.viewerCount,
        tags: info.tags || [],
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

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const { data: favoriteStreamers, error } = await supabase
        .from('favorite_streamers')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const streamerPromises = favoriteStreamers.map(f => fetchStreamerData(f.streamer_id));
      const streamersData = await Promise.all(streamerPromises);
      
      setFavorites(streamersData.filter((data): data is StreamerInfo => data !== null));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, fetchStreamerData]);

  const toggleFavorite = useCallback(async (streamerId: string) => {
    if (!user) return;

    try {
      const isCurrentlyFollowing = favorites.some(f => f.id === streamerId);

      if (isCurrentlyFollowing) {
        // Remove from database
        await supabase
          .from('favorite_streamers')
          .delete()
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId);

        // Update state
        setFavorites(prev => prev.filter(f => f.id !== streamerId));
      } else {
        // Add to database
        await supabase
          .from('favorite_streamers')
          .insert({ user_id: user.id, streamer_id: streamerId });

        // Fetch and add new streamer
        const streamerInfo = await fetchStreamerData(streamerId);
        if (streamerInfo) {
          setFavorites(prev => [...prev, streamerInfo]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [user, supabase, favorites, fetchStreamerData]);

  const isFollowing = useCallback((streamerId: string) => {
    return favorites.some(f => f.id === streamerId);
  }, [favorites]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, loadFavorites]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('favorite_streamers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorite_streamers',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, loadFavorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFollowing,
    refresh: loadFavorites,
  };
}