import { useState } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  movieId: string;
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!movieId) {
    return (
      <div className="video-player-wrapper">
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="rounded-md bg-destructive p-4 text-white">
            Invalid movie ID
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-wrapper">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <iframe 
        src={`https://moviesapi.club/movie/${movieId}`}
        className="h-full w-full"
        frameBorder="0"
        allowFullScreen
        style={{ aspectRatio: '16/9' }}
        onLoad={() => setIsLoading(false)}
        allow="fullscreen"
        loading="lazy"
      />
    </div>
  );
}
