'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamerCard } from '@/components/streamer/streamer-card';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';
import { LoginButton } from '@/components/auth/login-button';
import { Users } from 'lucide-react';

export function Sidebar() {
  const { favorites, loading } = useFavorites();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="fixed left-0 flex h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">Following</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center gap-4">
          <Users className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            Sign in to follow your favorite streamers
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">Following</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Loading followed streamers...
              </div>
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