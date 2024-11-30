'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface StreamPageProps {
  params: {
    username: string;
  };
}

export default function StreamPage({ params }: StreamPageProps) {
  const router = useRouter();
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
        <Sidebar />
        <main className="flex-1 ml-60 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-6 space-y-4">
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
          </div>
        </main>
      </div>
    </div>
  );
}