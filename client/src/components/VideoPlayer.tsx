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
      
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {/* Protective overlay to catch unwanted clicks */}
        <div className="absolute inset-0 z-10" onClick={(e) => e.preventDefault()} />
        
        {/* Main video iframe with updated permissions */}
        <iframe 
          src={`https://moviesapi.club/movie/${movieId}`}
          className="h-full w-full"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
          allow="fullscreen"
          allowFullScreen
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
