'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ViewershipTrendsProps {
  data: {
    time: string;
    viewers: number;
  }[];
}

export function ViewershipTrends({ data }: ViewershipTrendsProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="viewers"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2))"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}