'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  streamerId: string;
  preventNavigation?: boolean;
}

export function FollowButton({ streamerId, preventNavigation = false }: FollowButtonProps) {
  const { toggleFavorite, isFollowing } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const following = isFollowing(streamerId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to follow streamers",
        variant: "default",
      });
      return;
    }

    toggleFavorite(streamerId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
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