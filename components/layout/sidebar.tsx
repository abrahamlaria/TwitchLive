'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamerCard } from '@/components/streamer/streamer-card';
import { mockStreamers } from '@/lib/mock-data';

export function Sidebar() {
  return (
    <div className="fixed left-0 flex h-[calc(100vh-4rem)] w-60 flex-col border-r bg-background">
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Following</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {mockStreamers.map((streamer) => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}