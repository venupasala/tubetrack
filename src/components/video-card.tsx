import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { Eye, ThumbsUp, PlayCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { YouTubeVideo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: () => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const publishedDate = new Date(video.snippet.publishedAt);
  const thumbnailUrl = video.snippet.thumbnails?.high?.url || `https://placehold.co/480x360.png`;

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden group cursor-pointer"
      onClick={onPlay}
    >
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={video.snippet.title}
            fill
            className="object-cover bg-muted group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint="youtube video"
          />
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="w-16 h-16 text-white/80" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
          {video.snippet.title}
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{video.statistics ? formatNumber(video.statistics.viewCount) : 'N/A'}</span>
            </div>
             <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4" />
                <span>{video.statistics ? formatNumber(video.statistics.likeCount) : 'N/A'}</span>
            </div>
        </div>
        <div title={format(publishedDate, "PPP")}>
          {formatDistanceToNow(publishedDate, { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
}

    