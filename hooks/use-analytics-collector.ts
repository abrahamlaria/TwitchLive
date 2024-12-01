'use client';

import { useEffect, useRef } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { getStreamerInfo } from '@/lib/twitch';

interface WatchSession {
  startTime: number;
  metadata: {
    streamer_name?: string;
    category_name?: string;
    category_id?: string;
  };
}

export function useAnalyticsCollector() {
  const supabase = useSupabase();
  const { user } = useAuth();
  const watchStartTime = useRef<Record<string, WatchSession>>({});

  const startWatching = async (streamerId: string, categoryId?: string) => {
    if (!user) return;
    
    try {
      // Get streamer info to include in metadata
      const streamerInfo = await getStreamerInfo(streamerId);
      
      watchStartTime.current[streamerId] = {
        startTime: Date.now(),
        metadata: {
          streamer_name: streamerInfo.username,
          category_name: streamerInfo.currentGame || 'Unknown',
          category_id: categoryId || 'unknown'
        }
      };
    } catch (error) {
      console.error('Error getting streamer info:', error);
      watchStartTime.current[streamerId] = {
        startTime: Date.now(),
        metadata: {}
      };
    }
  };

  const stopWatching = async (streamerId: string) => {
    if (!user || !watchStartTime.current[streamerId]) return;

    const session = watchStartTime.current[streamerId];
    const duration = Math.floor((Date.now() - session.startTime) / 1000);

    try {
      await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: 'stream_watch',
        streamer_id: streamerId,
        category_id: session.metadata.category_id,
        duration,
        metadata: {
          ...session.metadata,
          ended_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error recording watch time:', error);
    }

    delete watchStartTime.current[streamerId];
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Record any ongoing watch sessions
      Object.keys(watchStartTime.current).forEach(streamerId => {
        void stopWatching(streamerId);
      });
    };
  }, []);

  return {
    startWatching,
    stopWatching
  };
}