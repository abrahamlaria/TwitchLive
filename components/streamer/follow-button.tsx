'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  streamerId: string;
}

export function FollowButton({ streamerId }: FollowButtonProps) {
  const { toggleFavorite, isFollowing } = useFavorites();
  const following = isFollowing(streamerId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(streamerId);
      }}
      className={cn(
        'transition-colors duration-200',
        following ? 'text-red-500 hover:text-red-600' : 'text-white/70 hover:text-white'
      )}
    >
      <Heart className={cn(
        'h-5 w-5 transition-all duration-200',
        following && 'fill-current scale-110'
      )} />
    </Button>
  );
}