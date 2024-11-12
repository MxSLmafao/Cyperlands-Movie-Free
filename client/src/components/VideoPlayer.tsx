import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  movieId: string;
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent popup windows
    const handlePopup = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    window.addEventListener('beforeunload', handlePopup);
    return () => window.removeEventListener('beforeunload', handlePopup);
  }, []);

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
        <div 
          className="absolute inset-0 z-10" 
          style={{ pointerEvents: 'none' }}
        />
        
        <div className="relative w-full h-full">
          <iframe 
            src={`https://moviesapi.club/movie/${movieId}`}
            className="absolute inset-0 w-full h-full"
            style={{ 
              pointerEvents: 'auto',
              zIndex: 5
            }}
            frameBorder="0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
