# TubeTrack

This is a Next.js application, TubeTrack, which allows you to track YouTube channel analytics.

## Getting Started

First, you'll need to get a YouTube Data API v3 key. You can get one from the [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com).

Next, create a local environment file by copying the example:

```bash
cp .env.local.example .env.local
```

Now, open `.env.local` and add your YouTube API key:

```
YOUTUBE_API_KEY=your_api_key_here
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
