'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './use-auth';
import { useFavorites } from './use-favorites';
import { useToast } from './use-toast';

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const { toast } = useToast();
  const previousStatusRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initialize previous status on first load
    favorites.forEach((streamer) => {
      if (!previousStatusRef.current.has(streamer.id)) {
        previousStatusRef.current.set(streamer.id, streamer.isLive);
      }
    });

    // Check for status changes
    favorites.forEach((streamer) => {
      const wasLive = previousStatusRef.current.get(streamer.id);
      
      // Only notify if we have a previous state and it changed to live
      if (wasLive !== undefined && !wasLive && streamer.isLive) {
        toast({
          title: `${streamer.username} is now live!`,
          description: streamer.currentGame 
            ? `Playing ${streamer.currentGame}`
            : 'Started streaming',
          variant: 'default',
          className: 'bg-background border-yellow-500 dark:border-yellow-500',
        });
      }

      // Update previous status
      previousStatusRef.current.set(streamer.id, streamer.isLive);
    });

    // Cleanup old streamers that are no longer in favorites
    const currentIds = new Set(favorites.map(s => s.id));
    // Convert Map keys to array before iterating
    Array.from(previousStatusRef.current.keys()).forEach(id => {
      if (!currentIds.has(id)) {
        previousStatusRef.current.delete(id);
      }
    });
  }, [isAuthenticated, favorites, toast]);
}