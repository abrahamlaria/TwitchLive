'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './use-auth';
import { useFavorites } from './use-favorites';
import { useToast } from './use-toast';

export function useNotifications() {
  const { isAuthenticated, user } = useAuth();
  const { favorites } = useFavorites();
  const { toast } = useToast();
  const previousStatusRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Initialize previous status on first load
    favorites.forEach((streamer) => {
      if (!previousStatusRef.current.has(streamer.id)) {
        previousStatusRef.current.set(streamer.id, streamer.isLive);
      }
    });

    // Check for status changes
    favorites.forEach(async (streamer) => {
      const wasLive = previousStatusRef.current.get(streamer.id);
      
      // Only notify if we have a previous state and it changed
      if (wasLive !== undefined) {
        if (!wasLive && streamer.isLive) {
          // Streamer went live
          const title = `${streamer.username} is now live!`;
          const message = streamer.currentGame 
            ? `Playing ${streamer.currentGame}`
            : 'Started streaming';

          // Show toast notification
          toast({
            title,
            description: message,
            variant: 'default',
            className: 'bg-background border-yellow-500 dark:border-yellow-500',
          });

          // Store notification in database
          try {
            await fetch('/api/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title,
                message,
                type: 'stream_live',
                streamerId: streamer.id,
                streamerUsername: streamer.username,
              }),
            });
          } catch (error) {
            console.error('Error storing notification:', error);
          }
        } else if (wasLive && !streamer.isLive) {
          // Streamer went offline
          try {
            await fetch('/api/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: `${streamer.username} went offline`,
                message: 'Stream ended',
                type: 'stream_offline',
                streamerId: streamer.id,
                streamerUsername: streamer.username,
              }),
            });
          } catch (error) {
            console.error('Error storing notification:', error);
          }
        }
      }

      // Update previous status
      previousStatusRef.current.set(streamer.id, streamer.isLive);
    });

    // Cleanup old streamers that are no longer in favorites
    const currentIds = new Set(favorites.map(s => s.id));
    Array.from(previousStatusRef.current.keys()).forEach(id => {
        if (!currentIds.has(id)) {
          previousStatusRef.current.delete(id);
        }
      });
  }, [isAuthenticated, user, favorites, toast]);
}