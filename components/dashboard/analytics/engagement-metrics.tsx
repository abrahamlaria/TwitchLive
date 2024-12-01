'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { ViewershipTrends } from './charts/viewership-trends';

interface EngagementMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function EngagementMetrics({ dateRange }: EngagementMetricsProps) {
  const { data } = useAnalytics(dateRange);

  return (
    <div className="grid gap-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Viewer Engagement</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ViewershipTrends data={data.viewershipData} />
        </CardContent>
      </Card>
    </div>
  );
}