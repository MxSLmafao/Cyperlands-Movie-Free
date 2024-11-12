import { useState, useEffect } from "react";
import { Loader2, Cast } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  movieId: string;
}

declare global {
  namespace chrome.cast {
    interface Session {
      loadMedia(request: chrome.cast.media.LoadRequest): void;
    }
    
    namespace media {
      class MediaInfo {
        constructor(contentId: string, contentType: string);
      }
      class LoadRequest {
        constructor(mediaInfo: MediaInfo);
      }
    }

    class SessionRequest {
      constructor(appId: string);
    }

    class ApiConfig {
      constructor(
        sessionRequest: SessionRequest,
        sessionListener: (session: Session) => void,
        receiverListener: (availability: string) => void
      );
    }

    let initialize: (
      apiConfig: ApiConfig,
      onInitSuccess: () => void,
      onError: (error: Error) => void
    ) => void;

    let requestSession: (
      onSuccess: (session: Session) => void,
      onError: (error: Error) => void
    ) => void;

    let isAvailable: boolean;
  }
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCastAvailable, setIsCastAvailable] = useState(false);

  useEffect(() => {
    if (!(window as any).__onGCastApiAvailable) {
      (window as any).__onGCastApiAvailable = function(isAvailable: boolean) {
        if (isAvailable && chrome.cast) {
          initializeCastApi();
        }
      };
    }
  }, []);

  const initializeCastApi = () => {
    const sessionRequest = new chrome.cast.SessionRequest('CC1AD845');
    const apiConfig = new chrome.cast.ApiConfig(
      sessionRequest,
      (session) => {
        console.log('Cast session started:', session);
      },
      (availability) => {
        setIsCastAvailable(availability === 'available');
      }
    );

    chrome.cast.initialize(
      apiConfig,
      () => console.log('Cast API initialized'),
      (error) => console.error('Cast API initialization error:', error)
    );
  };

  const handleCastClick = () => {
    chrome.cast.requestSession(
      (session) => {
        const mediaInfo = new chrome.cast.media.MediaInfo(
          `https://moviesapi.club/movie/${movieId}`,
          'video/mp4'
        );
        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        session.loadMedia(request);
      },
      (error) => console.error('Error starting cast session:', error)
    );
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10">
        {isCastAvailable && (
          <Button
            variant="secondary"
            size="icon"
            onClick={handleCastClick}
            className="bg-black/50 hover:bg-black/70"
          >
            <Cast className="h-4 w-4" />
          </Button>
        )}
      </div>

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
