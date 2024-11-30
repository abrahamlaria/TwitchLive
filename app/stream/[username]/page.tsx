'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoginButton } from '@/components/auth/login-button';

interface StreamPageProps {
  params: {
    username: string;
  };
}

export default function StreamPage({ params }: StreamPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parentDomain, setParentDomain] = useState<string>('');
  const { username } = params;

  useEffect(() => {
    // Get the parent domain for the Twitch player
    const domain = window.location.hostname === 'localhost' 
      ? 'localhost' 
      : window.location.hostname.replace('www.', '');
    setParentDomain(domain);

    // Add a small delay to ensure smooth loading transition
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Hide sidebar on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Remove left margin on mobile */}
        <main className="flex-1 md:ml-60 w-full overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold truncate">
                {username}&apos;s Stream
              </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
              {/* Video Player */}
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                {loading || !parentDomain ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <iframe
                    src={`https://player.twitch.tv/?channel=${username}&parent=${parentDomain}`}
                    height="100%"
                    width="100%"
                    allowFullScreen
                    title={`${username}'s stream`}
                    className="border-0"
                  />
                )}
              </div>
              {/* Chat */}
              <div className="hidden lg:block h-[calc(100vh-16rem)] bg-black rounded-lg overflow-hidden">
                {loading || !parentDomain ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-sm text-muted-foreground">
                      Sign in to participate in chat
                    </p>
                    <LoginButton />
                  </div>
                ) : (
                  <iframe
                    src={`https://www.twitch.tv/embed/${username}/chat?parent=${parentDomain}&darkpopout`}
                    height="100%"
                    width="100%"
                    title={`${username}'s chat`}
                    className="border-0"
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}