'use client';

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/player-store";

interface PlayerProps {
  videoId: string; // Cloudflare Stream video ID
}

export function Player({ videoId }: PlayerProps) {
  const [streamUrl, setStreamUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isAudioOnly, setIsAudioOnly } = usePlayerStore();

  useEffect(() => {
    const fetchStreamUrl = async () => {
      setIsLoading(true);
      try {
        const endpoint = isAudioOnly ? '/api/stream/audio' : '/api/stream';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stream URL');
        }

        const data = await response.json();
        setStreamUrl(data.streamUrl);
      } catch (error) {
        console.error(error);
        // Handle error state in UI
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchStreamUrl();
    }
  }, [videoId, isAudioOnly]);

  const handleRewind = () => {
    if (iframeRef.current?.contentWindow) {
      // The targetOrigin should be the Cloudflare Stream domain for security
      iframeRef.current.contentWindow.postMessage({ seek: -10 }, 'https://customer-mhnj3u59da2g04j5.cloudflarestream.com');
    }
  };

  const toggleAudioOnly = () => {
    setIsAudioOnly(!isAudioOnly);
  };

  if (isLoading || !streamUrl) {
    return (
      <div className="w-full bg-black flex items-center justify-center">
        <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
          <p className="text-white">Loading Player...</p>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AspectRatio ratio={isAudioOnly ? 16 / 3 : 16 / 9}>
        <iframe
          ref={iframeRef}
          src={streamUrl}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </AspectRatio>
      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" onClick={handleRewind}>Rewind 10s</Button>
        <Button 
          variant={isAudioOnly ? "default" : "outline"} 
          onClick={toggleAudioOnly}
        >
          {isAudioOnly ? "Video Mode" : "Audio Only"}
        </Button>
      </div>
    </div>
  );
}
