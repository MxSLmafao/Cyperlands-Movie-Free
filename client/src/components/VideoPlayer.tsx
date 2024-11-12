import { useState } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  movieId: string;
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <iframe 
        src={`https://moviesapi.club/movie/${movieId}`}
        className="w-full h-full"
        style={{ aspectRatio: '16/9' }}
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}