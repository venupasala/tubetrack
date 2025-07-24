"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { YouTubeVideo } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { format } from "date-fns"

interface ChannelGrowthChartProps {
  videos: YouTubeVideo[]
}

export default function ChannelGrowthChart({ videos }: ChannelGrowthChartProps) {
  const chartData = videos
    .map(video => ({
      name: format(new Date(video.snippet.publishedAt), "MMM d"),
      "Views": parseInt(video.statistics.viewCount, 10),
      tooltip: video.snippet.title,
    }))
    .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Video Performance</CardTitle>
        <CardDescription>View counts for the top 5 most popular videos, showing audience engagement.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickFormatter={(value) => formatNumber(value as number)} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
              labelFormatter={(label, payload) => {
                const video = payload?.[0]?.payload;
                if(video) {
                    return `${video.tooltip} (${label})`
                }
                return label
              }}
              formatter={(value) => [formatNumber(value as number), "Views"]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Views" fill="#8884d8" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
