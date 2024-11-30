'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStreamStatus } from '@/lib/twitch/api';

export function useStreamStatus(streamerId: string) {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateStatus = useCallback(async () => {
    try {
      const { data } = await getStreamStatus(streamerId);
      const stream = data[0];
      
      setIsLive(!!stream);
      setViewerCount(stream?.viewer_count ?? null);
      setCurrentGame(stream?.game_name ?? null);
    } catch (error) {
      console.error('Error fetching stream status:', error);
    } finally {
      setLoading(false);
    }
  }, [streamerId]);

  useEffect(() => {
    updateStatus();
    
    // Update status every minute
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, [updateStatus]);

  return {
    isLive,
    viewerCount,
    currentGame,
    loading,
    refresh: updateStatus
  };
}