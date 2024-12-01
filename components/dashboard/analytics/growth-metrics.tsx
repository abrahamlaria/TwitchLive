'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { CategoryDistribution } from './charts/category-distribution';

interface GrowthMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function GrowthMetrics({ dateRange }: GrowthMetricsProps) {
  const { data } = useAnalytics(dateRange);

  return (
    <div className="grid gap-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Category Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryDistribution data={data.categoryData} />
        </CardContent>
      </Card>
    </div>
  );
}