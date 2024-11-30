'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveStreams } from '@/components/dashboard/live-streams';
import { Recommendations } from '@/components/dashboard/recommendations';
import { RecentStreams } from '@/components/dashboard/recent-streams';
import { FeaturedStreams } from '@/components/featured-streams';
import { 
  Sparkles, 
  Radio, 
  Compass, 
  History 
} from 'lucide-react';

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState('featured');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">
          Keep track of your favorite streams and discover new content
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Featured Streams</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span>Following Live</span>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            <span>Recommended</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Offline Channels</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="featured" className="space-y-4">
          <FeaturedStreams />
        </TabsContent>
        <TabsContent value="live" className="space-y-4">
          <LiveStreams />
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <Recommendations />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentStreams />
        </TabsContent>
      </Tabs>
    </div>
  );
}
