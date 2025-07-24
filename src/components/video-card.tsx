import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { Eye, ThumbsUp, Dot } from "lucide-react";
import type { YouTubeVideo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface VideoCardProps {
  video: YouTubeVideo;
  channelThumbnail: string;
  onPlay: () => void;
}

export default function VideoCard({ video, onPlay, channelThumbnail }: VideoCardProps) {
  const publishedDate = new Date(video.snippet.publishedAt);
  const thumbnailUrl = video.snippet.thumbnails?.high?.url || `https://placehold.co/480x360.png`;

  // For trending videos, the channel thumbnail is fetched separately and attached.
  const finalChannelThumbnail = channelThumbnail || (video.snippet.thumbnails as any).channelThumbnailUrl;

  return (
    <div 
      className="flex flex-col group cursor-pointer"
      onClick={onPlay}
    >
      <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
        <Image
          src={thumbnailUrl}
          alt={video.snippet.title}
          fill
          className="object-cover bg-muted group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          data-ai-hint="youtube video"
        />
      </div>
      <div className="flex items-start gap-3">
        <Avatar className="mt-1">
            <AvatarImage src={finalChannelThumbnail} alt={video.snippet.channelTitle} />
            <AvatarFallback>{video.snippet.channelTitle.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <h3 className="text-base font-medium line-clamp-2 leading-snug group-hover:text-primary/90 transition-colors">
              {video.snippet.title}
            </h3>
            <div className="text-sm text-muted-foreground mt-1">
                <p className="">{video.snippet.channelTitle}</p>
                <div className="flex items-center">
                    <span>{video.statistics ? formatNumber(video.statistics.viewCount) : 'N/A'} views</span>
                    <Dot />
                    <span title={format(publishedDate, "PPP")}>
                      {formatDistanceToNow(publishedDate, { addSuffix: true })}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
