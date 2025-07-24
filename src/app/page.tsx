"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Search, X, Youtube } from "lucide-react";
import { searchChannelsByName, getChannelDataById, getTrendingVideos } from "@/app/actions";
import { type ChannelData, type YouTubeChannel, type YouTubeVideo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChannelStats from "@/components/channel-stats";
import VideoCard from "@/components/video-card";
import AiGuidance from "@/components/ai-guidance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import ChannelGrowthChart from "@/components/channel-growth-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YouTubeChannel[]>([]);
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      const result = await getTrendingVideos();
      if (result.error) {
        setError(result.error);
      } else {
        setTrendingVideos(result.videos || []);
      }
      setLoadingTrending(false);
    };
    fetchTrending();
  }, []);

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
    setTrendingVideos([]);

    try {
      const result = await searchChannelsByName(query);
      if (result.error) {
        setError(result.error);
      } else if (result.channels) {
        if (result.channels.length === 1) {
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

  const renderContent = () => {
    if (loading) return <LoadingSkeleton />;
    
    if (error) {
      return (
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    if (searchResults.length > 0) {
      return (
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
      );
    }
    
    if (loadingChannel && !selectedChannelData) return <LoadingSkeleton />;

    if (selectedChannelData) {
      return (
        <div className="flex flex-col gap-8 animate-in fade-in-0 duration-500">
          <section className="flex flex-col sm:flex-row items-center gap-6 rounded-xl p-4">
            <Image
              src={selectedChannelData.channel.snippet.thumbnails.high.url}
              alt={`${selectedChannelData.channel.snippet.title} profile picture`}
              width={128}
              height={128}
              className="rounded-full border-4 border-primary/50"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold font-headline">{selectedChannelData.channel.snippet.title}</h2>
              <p className="text-muted-foreground mt-2 line-clamp-3">{selectedChannelData.channel.snippet.description}</p>
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
            <h3 className="text-2xl font-bold font-headline mb-4">Most Popular Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {selectedChannelData.videos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={() => setPlayingVideo(video)} channelThumbnail={selectedChannelData.channel.snippet.thumbnails.default.url}/>
              ))}
            </div>
          </section>
        </div>
      );
    }
    
    if (hasSearched && !loading && searchResults.length === 0) {
      return (
          <Alert className="max-w-xl mx-auto">
              <AlertTitle>No Results Found</AlertTitle>
              <AlertDescription>Your search for "{query}" did not return any channels. Please try a different name.</AlertDescription>
          </Alert>
      );
    }

    if (loadingTrending) return <LoadingSkeleton />;

    if (trendingVideos.length > 0) {
      return (
        <section>
          <h3 className="text-2xl font-bold font-headline mb-4">Trending Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {trendingVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={() => setPlayingVideo(video)} channelThumbnail={(video.snippet.thumbnails as any).channelThumbnailUrl} />
            ))}
          </div>
        </section>
      );
    }

    return (
      <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
        <Youtube size={80} className="mb-4" />
        <h2 className="text-2xl font-bold">Welcome to TubeTrack</h2>
        <p>Search for a YouTube channel to get started.</p>
      </div>
    );
  };


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <section className="mb-8">
                <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto flex items-center">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by channel name, handle (@handle), or ID..."
                        className="rounded-r-none focus:ring-0 text-base border-r-0 h-12 text-lg"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading} className="rounded-l-none h-12 px-6" variant="default">
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                </form>
            </section>
            
            <div className="h-full">
              {renderContent()}
            </div>
            {playingVideo && (
              <Dialog open={!!playingVideo} onOpenChange={(isOpen) => !isOpen && setPlayingVideo(null)}>
                <DialogContent className="max-w-4xl p-0 bg-card border-none">
                  <DialogHeader className="p-4">
                    <DialogTitle>{playingVideo.snippet.title}</DialogTitle>
                  </DialogHeader>
                  <VideoPlayer videoId={playingVideo.id} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-8">
    <section className="flex flex-col sm:flex-row items-center gap-6 p-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  </div>
);
