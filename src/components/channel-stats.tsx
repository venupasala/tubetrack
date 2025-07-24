import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Users, Eye, Video, CalendarDays } from "lucide-react";
import type { YouTubeChannel } from "@/lib/types";

interface ChannelStatsProps {
  stats: YouTubeChannel["statistics"];
  publishedAt: string;
}

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <Card className="flex flex-col items-center justify-center p-4 text-center bg-card hover:bg-muted/80 transition-colors duration-200">
    <Icon className="w-8 h-8 mb-2 text-primary" />
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
);

export default function ChannelStats({ stats, publishedAt }: ChannelStatsProps) {
  const joinDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem
        icon={Users}
        label="Subscribers"
        value={stats.hiddenSubscriberCount ? "Hidden" : formatNumber(stats.subscriberCount)}
      />
      <StatItem icon={Eye} label="Total Views" value={formatNumber(stats.viewCount)} />
      <StatItem icon={Video} label="Total Videos" value={formatNumber(stats.videoCount)} />
      <StatItem icon={CalendarDays} label="Joined" value={joinDate} />
    </section>
  );
}
