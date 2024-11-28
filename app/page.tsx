import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FeaturedStreams } from '@/components/featured-streams';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Sidebar />
        <main className="flex-1 ml-60 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <FeaturedStreams />
          </div>
        </main>
      </div>
    </div>
  );
}