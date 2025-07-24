'use server';

import { ai } from '../genkit';
import { z } from 'zod';
import {defineFlow, run} from 'genkit';

// This AI flow provides channel recommendations. It is designed to be contextually
// aware, policy-compliant, and helpful for creators looking to improve their content.
export const channelGuidance = ai.defineFlow(
  {
    name: 'channelGuidance',
    inputSchema: z.object({
      title: z.string(),
      description: z.string(),
      subscriberCount: z.string(),
      videoCount: z.string(),
      viewCount: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (channelData) => {
    const prompt = `Based on the following YouTube channel data, provide a single, concise, actionable recommendation for content improvement, SEO, or user engagement. The recommendation must be a maximum of 100 characters and must strictly comply with YouTube's community guidelines and platform policies. The tone should be encouraging and helpful.

Channel Data:
- Title: ${channelData.title}
- Description: ${channelData.description}
- Subscribers: ${channelData.subscriberCount}
- Videos: ${channelData.videoCount}
- Views: ${channelData.viewCount}

Recommendation (max 100 characters):`;

    try {
      const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-1.5-flash',
        config: {
          maxOutputTokens: 50,
          temperature: 0.5,
        },
      });

      return llmResponse.text();
    } catch (error) {
      console.error('Error generating AI guidance:', error);
      return "Could not generate guidance at this time. Please try again later.";
    }
  }
);
