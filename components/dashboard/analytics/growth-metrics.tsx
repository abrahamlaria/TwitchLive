'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { CategoryDistribution } from './charts/category-distribution';
import { Loader2 } from 'lucide-react';

interface GrowthMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function GrowthMetrics({ dateRange }: GrowthMetricsProps) {
  const { data, loading } = useAnalytics(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Ensure we have valid data
  const categoryData = data?.categoryData || [];

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        No category data available for this period
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Category Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryDistribution data={categoryData} />
        </CardContent>
      </Card>
    </div>
  );
}