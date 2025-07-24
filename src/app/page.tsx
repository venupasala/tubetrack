"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Search, X } from "lucide-react";
import { searchChannelsByName, getChannelDataById } from "@/app/actions";
import { type ChannelData, type YouTubeChannel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChannelStats from "@/components/channel-stats";
import VideoCard from "@/components/video-card";
import AiGuidance from "@/components/ai-guidance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import ChannelGrowthChart from "@/components/channel-growth-chart";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeChannel[]>([]);
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a channel name, handle, or ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedChannelData(null);
    setSearchResults([]);
    setHasSearched(true);

    try {
      const result = await searchChannelsByName(query);
      if (result.error) {
        setError(result.error);
      } else if (result.channels) {
        if (result.channels.length === 1) {
          // If only one result, fetch its data directly
          await handleChannelSelect(result.channels[0].id);
        } else {
          setSearchResults(result.channels);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred during search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChannelSelect = async (channelId: string) => {
    setLoadingChannel(channelId);
    setError(null);
    setSearchResults([]);
    setSelectedChannelData(null);

    try {
      const result = await getChannelDataById(channelId);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setSelectedChannelData(result.data);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching channel data. Please try again.");
    } finally {
      setLoadingChannel(null);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setSelectedChannelData(null);
    setError(null);
    setHasSearched(false);
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            TubeTrack
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Enter a channel name, handle, or ID to get its latest stats.
          </p>
        </header>

        <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 mb-8">
           <div className="relative flex-grow">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., MrBeast, @mkbhd, or a channel ID"
              className="pr-10 text-base"
              disabled={loading}
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" disabled={loading} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="hidden sm:inline ml-2">Search</span>
          </Button>
        </form>

        {loading && <LoadingSkeleton />}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {searchResults.length > 0 && (
          <section className="flex flex-col gap-4">
             <h3 className="text-2xl font-bold font-headline">Select a Channel</h3>
             {searchResults.map((channel) => (
                <Card 
                  key={channel.id} 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => !loadingChannel && handleChannelSelect(channel.id)}
                >
                  <Image
                    src={channel.snippet.thumbnails.default.url}
                    alt={`${channel.snippet.title} profile picture`}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-grow">
                     <p className="font-semibold text-lg">{channel.snippet.title}</p>
                     <p className="text-sm text-muted-foreground line-clamp-1">{channel.snippet.description}</p>
                  </div>
                  {loadingChannel === channel.id && <Loader2 className="animate-spin text-primary" />}
                </Card>
             ))}
          </section>
        )}
        
        {loadingChannel && !selectedChannelData && <LoadingSkeleton />}

        {selectedChannelData && (
          <div className="flex flex-col gap-8 animate-in fade-in-0 duration-500">
            <section className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border bg-card p-6 shadow-md">
              <Image
                src={selectedChannelData.channel.snippet.thumbnails.high.url}
                alt={`${selectedChannelData.channel.snippet.title} profile picture`}
                width={128}
                height={128}
                className="rounded-full border-4 border-primary"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold font-headline">{selectedChannelData.channel.snippet.title}</h2>
                <p className="text-muted-foreground mt-2 line-clamp-2">{selectedChannelData.channel.snippet.description}</p>
              </div>
            </section>
            
            <ChannelStats 
              stats={selectedChannelData.channel.statistics} 
              publishedAt={selectedChannelData.channel.snippet.publishedAt}
            />

            {selectedChannelData.aiGuidance && <AiGuidance guidance={selectedChannelData.aiGuidance} />}

            {selectedChannelData.videos && selectedChannelData.videos.length > 0 && (
              <ChannelGrowthChart videos={selectedChannelData.videos} />
            )}

            <section>
              <h3 className="text-2xl font-bold font-headline mb-4">Most Recent Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedChannelData.videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          </div>
        )}

        {hasSearched && !loading && !error && searchResults.length === 0 && !selectedChannelData && (
            <Alert>
                <AlertTitle>No Results Found</AlertTitle>
                <AlertDescription>Your search for "{query}" did not return any channels. Please try a different name.</AlertDescription>
            </Alert>
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
      <Skeleton className="h-64 rounded-xl" />
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
