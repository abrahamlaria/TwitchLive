'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { LoginButton } from '@/components/auth/login-button';

interface FollowButtonProps {
  streamerId: string;
}

export function FollowButton({ streamerId }: FollowButtonProps) {
  const { toggleFavorite, isFollowing } = useFavorites();
  const { isAuthenticated } = useAuth();
  const following = isFollowing(streamerId);

  if (!isAuthenticated) {
    return (
      <LoginButton>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </LoginButton>
    );
  }

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