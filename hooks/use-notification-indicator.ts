'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { useFavorites } from './use-favorites';

export function useNotificationIndicator() {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [hasNotification, setHasNotification] = useState(false);
  const [lastChecked, setLastChecked] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!isAuthenticated) {
      setHasNotification(false);
      return;
    }

    // Check for new live streams
    favorites.forEach((streamer) => {
      const wasLive = lastChecked.get(streamer.id);
      if (wasLive === undefined) {
        // First time seeing this streamer
        lastChecked.set(streamer.id, streamer.isLive);
      } else if (!wasLive && streamer.isLive) {
        // Streamer just went live
        setHasNotification(true);
      }
      // Update last checked status
      lastChecked.set(streamer.id, streamer.isLive);
    });

    // Cleanup removed streamers
    const currentIds = new Set(favorites.map(s => s.id));
    Array.from(lastChecked.keys()).forEach(id => {
      if (!currentIds.has(id)) {
        lastChecked.delete(id);
      }
    });
  }, [isAuthenticated, favorites]);

  return {
    hasNotification,
    clearNotification: () => setHasNotification(false)
  };
}