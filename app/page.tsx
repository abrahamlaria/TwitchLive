import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FeaturedStreams } from '@/components/featured-streams';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        {/* Hide sidebar by default on mobile, show on md breakpoint */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Remove left margin on mobile, add it only on md breakpoint */}
        <main className="flex-1 md:ml-60 w-full overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6">
            <FeaturedStreams />
          </div>
        </main>
      </div>
    </div>
  );
}