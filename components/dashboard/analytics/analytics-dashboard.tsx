'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EngagementMetrics } from './engagement-metrics';
import { GrowthMetrics } from './growth-metrics';
import { StreamingStats } from './streaming-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDateRangePicker } from './date-range-picker';
import { Overview } from './overview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AnalyticsDashboard() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Overview dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <GrowthMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="streaming" className="space-y-4">
          <StreamingStats dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}