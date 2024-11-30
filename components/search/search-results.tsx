'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import type { Stream } from '@/types/streamer';
import Image from 'next/image';

interface SearchResultsProps {
  results: Stream[];
  onClose: () => void;
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No streams found
      </div>
    );
  }

  return (
    <div className="grid gap-2 p-2">
      {results.map((stream) => (
        <Card
          key={stream.id}
          className="overflow-hidden cursor-pointer hover:bg-accent"
          onClick={() => {
            window.open(`https://twitch.tv/${stream.title}`, '_blank');
            onClose();
          }}
        >
          <div className="flex items-center gap-4 p-3">
            <div className="relative aspect-video w-40 rounded-sm overflow-hidden flex-shrink-0">
              {stream.thumbnailUrl && (
                <Image
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-1 left-1 bg-red-600 px-1 py-0.5 rounded text-[10px] font-medium text-white">
                LIVE
              </div>
              <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[10px] font-medium text-white">
                {stream.viewerCount.toLocaleString()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium leading-none truncate mb-1">
                {stream.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {stream.game}
              </p>
            </div>
            {stream.userId && (
              <div className="flex-shrink-0">
                <FollowButton streamerId={stream.userId} />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}