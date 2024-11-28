import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FeaturedStreams } from '@/components/featured-streams';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-60">
          <div className="container max-w-7xl mx-auto px-6 py-6">
            <FeaturedStreams />
          </div>
        </main>
      </div>
    </div>
  );
}