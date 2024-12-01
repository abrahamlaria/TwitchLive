'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview as OverviewChart } from './charts/overview-chart';
import { CategoryDistribution } from './charts/category-distribution';
import { ViewershipTrends } from './charts/viewership-trends';
import { useAnalytics } from '@/hooks/use-analytics';
import { Loader2, Users, Clock, Activity } from 'lucide-react';

interface OverviewProps {
  dateRange: { from: Date; to: Date };
}

export function Overview({ dateRange }: OverviewProps) {
  const { data, loading } = useAnalytics(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalWatchTime}h</div>
          <p className="text-xs text-muted-foreground">
            +{data.watchTimeGrowth}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Streamers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeStreamers}</div>
          <p className="text-xs text-muted-foreground">
            {data.newStreamers} new this period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peak Viewers</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.peakViewers}</div>
          <p className="text-xs text-muted-foreground">
            Average: {data.averageViewers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories Explored</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.categoriesExplored}</div>
          <p className="text-xs text-muted-foreground">
            {data.topCategory} most watched
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <OverviewChart data={data.overviewData} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryDistribution data={data.categoryData} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Viewership Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewershipTrends data={data.viewershipData} />
        </CardContent>
      </Card>
    </div>
  );
}