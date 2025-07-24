import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { YouTubeVideo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const publishedDate = new Date(video.snippet.publishedAt);

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={video.snippet.thumbnails.high.url}
            alt={video.snippet.title}
            fill
            className="object-cover bg-muted"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint="youtube video"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-base line-clamp-2">
          {video.snippet.title}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>{video.statistics ? formatNumber(video.statistics.viewCount) : 'N/A'} views</span>
        </div>
        <div title={format(publishedDate, "PPP")}>
          {formatDistanceToNow(publishedDate, { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}
