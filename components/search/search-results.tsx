'use client';

import { Card } from '@/components/ui/card';
import { FollowButton } from '@/components/streamer/follow-button';
import type { Stream } from '@/types/streamer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
  results: Stream[];
  onClose: () => void;
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  const router = useRouter();

  return (
    <div className="grid gap-2 p-2">
      {results.map((stream) => (
        <Card
          key={stream.id}
          className="overflow-hidden cursor-pointer hover:bg-accent transition-colors"
          onClick={() => {
            router.push(`/stream/${stream.username}`);
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
                  sizes="160px"
                />
              )}
              <div className="absolute bottom-1 left-1 bg-red-600 px-1 py-0.5 rounded text-[10px] font-medium text-white">
                LIVE
              </div>
              {typeof stream.viewerCount === 'number' && (
                <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[10px] font-medium text-white">
                  {stream.viewerCount.toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium leading-none truncate mb-1">
                {stream.title}
              </h3>
              {stream.game && (
                <p className="text-sm text-muted-foreground truncate">
                  {stream.game}
                </p>
              )}
              {stream.tags && stream.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {stream.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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