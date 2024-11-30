'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveStreams } from '@/components/dashboard/live-streams';
import { Recommendations } from '@/components/dashboard/recommendations';
import { RecentStreams } from '@/components/dashboard/recent-streams';

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your favorite streams and discover new content
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
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