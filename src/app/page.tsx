"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { getChannelData } from "@/app/actions";
import { type ChannelData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChannelStats from "@/components/channel-stats";
import VideoCard from "@/components/video-card";
import AiGuidance from "@/components/ai-guidance";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [channelId, setChannelId] = useState("");
  const [data, setData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channelId.trim()) {
      setError("Please enter a YouTube Channel ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getChannelData(channelId);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            TubeTrack
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Enter a YouTube Channel ID to get its latest stats and top videos.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex w-full gap-2 mb-8">
          <Input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Enter YouTube Channel ID (e.g., UC_x5XG1OV2P6uZZ5FSM9Ttw)"
            className="flex-grow text-base"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search />
            )}
            <span className="hidden sm:inline ml-2">Analyze</span>
          </Button>
        </form>

        {loading && <LoadingSkeleton />}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="flex flex-col gap-8">
            <section className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border bg-card p-6 shadow-md">
              <Image
                src={data.channel.snippet.thumbnails.high.url}
                alt={`${data.channel.snippet.title} profile picture`}
                width={128}
                height={128}
                className="rounded-full border-4 border-primary"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold font-headline">{data.channel.snippet.title}</h2>
                <p className="text-muted-foreground mt-2 line-clamp-2">{data.channel.snippet.description}</p>
              </div>
            </section>
            
            <ChannelStats 
              stats={data.channel.statistics} 
              publishedAt={data.channel.snippet.publishedAt}
            />

            {data.aiGuidance && <AiGuidance guidance={data.aiGuidance} />}

            <section>
              <h3 className="text-2xl font-bold font-headline mb-4">Most Viewed Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-8">
    <section className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border bg-card p-6 shadow-md">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </section>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
    <div>
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  </div>
);
