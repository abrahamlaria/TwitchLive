'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/providers/supabase-provider';
import { useAuth } from './use-auth';
import { subDays, isWithinInterval } from 'date-fns';

interface AnalyticsData {
  totalWatchTime: number;
  watchTimeGrowth: number;
  activeStreamers: number;
  newStreamers: number;
  peakViewers: number;
  averageViewers: number;
  categoriesExplored: number;
  topCategory: string;
  overviewData: {
    date: string;
    watchTime: number;
    viewers: number;
  }[];
  categoryData: {
    name: string;
    value: number;
  }[];
  viewershipData: {
    time: string;
    viewers: number;
  }[];
}

export function useAnalytics(dateRange: { from: Date; to: Date }) {
  const [data, setData] = useState<AnalyticsData>({
    totalWatchTime: 0,
    watchTimeGrowth: 0,
    activeStreamers: 0,
    newStreamers: 0,
    peakViewers: 0,
    averageViewers: 0,
    categoriesExplored: 0,
    topCategory: '',
    overviewData: [],
    categoryData: [],
    viewershipData: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch favorite streamers
        const { data: favorites } = await supabase
          .from('favorite_streamers')
          .select('*')
          .eq('user_id', user.id);

        if (!favorites) return;

        // Calculate previous period for comparison
        const periodLength = dateRange.to.getTime() - dateRange.from.getTime();
        const previousPeriodStart = new Date(dateRange.from.getTime() - periodLength);

        // Simulate analytics data based on favorites
        const totalWatchTime = Math.floor(Math.random() * 100) + 50;
        const previousWatchTime = Math.floor(Math.random() * 100) + 50;
        const watchTimeGrowth = Math.round(((totalWatchTime - previousWatchTime) / previousWatchTime) * 100);

        // Generate overview data
        const overviewData = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i).toISOString().split('T')[0];
          return {
            date,
            watchTime: Math.floor(Math.random() * 8) + 1,
            viewers: Math.floor(Math.random() * 10000) + 1000,
          };
        }).reverse();

        // Generate category data
        const categories = ['Games', 'Just Chatting', 'Music', 'Sports', 'Creative'];
        const categoryData = categories.map(name => ({
          name,
          value: Math.floor(Math.random() * 100) + 20,
        }));

        // Generate viewership data
        const viewershipData = Array.from({ length: 24 }, (_, i) => ({
          time: `${i.toString().padStart(2, '0')}:00`,
          viewers: Math.floor(Math.random() * 50000) + 10000,
        }));

        setData({
          totalWatchTime,
          watchTimeGrowth,
          activeStreamers: favorites.length,
          newStreamers: Math.floor(Math.random() * 5),
          peakViewers: Math.max(...viewershipData.map(d => d.viewers)),
          averageViewers: Math.floor(
            viewershipData.reduce((acc, curr) => acc + curr.viewers, 0) / viewershipData.length
          ),
          categoriesExplored: categories.length,
          topCategory: categories[0],
          overviewData,
          categoryData,
          viewershipData,
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