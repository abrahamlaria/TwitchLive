'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { Overview } from './charts/overview-chart';

interface StreamingStatsProps {
  dateRange: { from: Date; to: Date };
}

export function StreamingStats({ dateRange }: StreamingStatsProps) {
  const { data } = useAnalytics(dateRange);

  return (
    <div className="grid gap-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Watch Time Trends</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={data.overviewData} />
        </CardContent>
      </Card>
    </div>
  );
}