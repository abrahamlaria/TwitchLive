'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamerCard } from '@/components/streamer/streamer-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Loader2 } from 'lucide-react';

export function Sidebar() {
  const { favorites, loading } = useFavorites();

  return (
    <div className="fixed left-0 flex h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Following</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : favorites.length > 0 ? (
            favorites.map((streamer) => (
              <StreamerCard key={streamer.id} streamer={streamer} />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No followed streamers yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}