'use client';

import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FeaturedStreams } from '@/components/featured-streams';

export function PublicHome() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-60 w-full overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6">
            <FeaturedStreams />
          </div>
        </main>
      </div>
    </div>
  );
}