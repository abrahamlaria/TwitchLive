'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

export function useAnalytics(dateRange: { from: Date; to: Date }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch aggregated data for the date range
        const { data: aggregates } = await supabase
          .from('analytics_aggregates')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', dateRange.from.toISOString())
          .lte('date', dateRange.to.toISOString())
          .order('date', { ascending: true });

        if (!aggregates) return;

        // Process the data for charts
        const overviewData = aggregates.map(day => ({
          date: day.date,
          watchTime: Math.round(day.total_watch_time / 3600), // Convert seconds to hours
          viewers: day.peak_concurrent_viewers
        }));

        // Calculate category distribution
        const categoryData = aggregates.reduce((acc: any[], day) => {
          const categories = day.categories_watched || [];
          categories.forEach((cat: any) => {
            const existing = acc.find(c => c.name === cat.name);
            if (existing) {
              existing.value += cat.duration;
            } else {
              acc.push({ name: cat.name, value: cat.duration });
            }
          });
          return acc;
        }, []);

        // Calculate totals and averages
        const totalWatchTime = aggregates.reduce((sum, day) => sum + day.total_watch_time, 0);
        const averageViewers = aggregates.reduce((sum, day) => sum + day.peak_concurrent_viewers, 0) / aggregates.length;
        const uniqueStreamers = new Set(aggregates.flatMap(day => 
          (day.streamers_watched || []).map((s: any) => s.id)
        )).size;

        setData({
          totalWatchTime: Math.round(totalWatchTime / 3600), // Convert to hours
          activeStreamers: uniqueStreamers,
          averageViewers: Math.round(averageViewers),
          peakViewers: Math.max(...aggregates.map(day => day.peak_concurrent_viewers)),
          categoriesExplored: categoryData.length,
          topCategory: categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'None',
          overviewData,
          categoryData: categoryData.slice(0, 5), // Top 5 categories
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, supabase, dateRange]);

  return { data, loading };
}