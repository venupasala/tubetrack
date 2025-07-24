"use server";

import { type ChannelData, type YouTubeChannel, type YouTubeVideo } from "@/lib/types";
import { channelGuidance } from "@/ai/flows/channelGuidance";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  if (!API_KEY) return null;
  const handleWithoutAt = handle.startsWith('@') ? handle.substring(1) : handle;
  const response = await fetch(`${BASE_URL}/channels?part=id&forHandle=${handleWithoutAt}&key=${API_KEY}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.items?.[0]?.id || null;
}

export async function searchChannelsByName(query: string): Promise<{ channels?: YouTubeChannel[], error?: string }> {
  if (!API_KEY) {
    return { error: "YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable." };
  }

  // If it's a handle, get the ID and fetch the single channel
  if (query.startsWith('@')) {
    const channelId = await getChannelIdFromHandle(query);
    if (channelId) {
      const channelResponse = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
       if (!channelResponse.ok) {
        const errorData = await channelResponse.json();
        return { error: `Failed to fetch channel data: ${errorData.error.message}` };
      }
      const channelData = await channelResponse.json();
      return { channels: channelData.items };
    }
  }

  // If it's a channel ID, fetch the single channel
  if (query.startsWith('UC') && query.length === 24) {
      const channelResponse = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${query}&key=${API_KEY}`);
       if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        if(channelData.items && channelData.items.length > 0) {
            return { channels: channelData.items };
        }
      }
  }
  
  // Otherwise, search by query text
  try {
    const searchResponse = await fetch(`${BASE_URL}/search?part=snippet&q=${query}&type=channel&maxResults=10&key=${API_KEY}`);
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      return { error: `Failed to search for channels: ${errorData.error.message}` };
    }
    const searchData = await searchResponse.json();
    const channels: YouTubeChannel[] = searchData.items.map((item: any) => ({
        id: item.id.channelId,
        snippet: item.snippet
    }));

    return { channels };
  } catch (error) {
    console.error("YouTube API request failed:", error);
    return { error: "An unexpected error occurred while searching for channels." };
  }
}

export async function getChannelDataById(channelId: string): Promise<{ data?: ChannelData, error?: string }> {
  if (!API_KEY) {
    return { error: "YouTube API key is not configured. Please set the YOUTUBE_API_KEY environment variable." };
  }
  
  try {
    // 1. Fetch Channel Details and Statistics
    const channelResponse = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
    if (!channelResponse.ok) {
        const errorData = await channelResponse.json();
        return { error: `Failed to fetch channel data: ${errorData.error.message}` };
    }
    const channelData = await channelResponse.json();
    if (!channelData.items || channelData.items.length === 0) {
      return { error: "YouTube channel not found." };
    }
    const channel: YouTubeChannel = channelData.items[0];

    // 2. Fetch Top 5 Most Recent Videos
    const searchResponse = await fetch(`${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=5&key=${API_KEY}`);
     if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        return { error: `Failed to fetch videos: ${errorData.error.message}` };
    }
    const searchData = await searchResponse.json();
    const videoSnippets = searchData.items;

    // 3. Get detailed statistics for each video
    const videoIds = videoSnippets.map((item: any) => item.id.videoId).join(',');
    let videos: YouTubeVideo[] = [];
    if(videoIds){
        const videosResponse = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
        if (!videosResponse.ok) {
            const errorData = await videosResponse.json();
            return { error: `Failed to fetch video statistics: ${errorData.error.message}` };
        }
        const videosData = await videosResponse.json();
        videos = videosData.items;
    }

    // 4. Get AI Guidance
    let aiGuidanceText = '';
    try {
        aiGuidanceText = await channelGuidance({
            title: channel.snippet.title,
            description: channel.snippet.description,
            subscriberCount: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
            viewCount: channel.statistics.viewCount,
        });
    } catch (aiError) {
        console.warn("AI Guidance feature failed:", aiError);
        // Do not block response if AI fails
        aiGuidanceText = "AI guidance is currently unavailable.";
    }

    return { 
      data: {
        channel,
        videos,
        aiGuidance: aiGuidanceText
      }
    };
  } catch (error) {
    console.error("YouTube API request failed:", error);
    return { error: "An unexpected error occurred while fetching data from YouTube." };
  }
}
