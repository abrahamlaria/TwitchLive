'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  streamerId: string;
}

export function FollowButton({ streamerId }: FollowButtonProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFollowing = favorites.some(f => f.id === streamerId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleFavorite(streamerId)}
      className={cn(
        'transition-colors',
        isFollowing && 'text-red-500 hover:text-red-600'
      )}
    >
      <Heart className={cn(
        'h-5 w-5',
        isFollowing && 'fill-current'
      )} />
    </Button>
  );
}