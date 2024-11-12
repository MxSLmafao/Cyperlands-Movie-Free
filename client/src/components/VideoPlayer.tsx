import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  movieId: string;
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      let errorMessage = "Failed to load video. Please try again later.";
      if (video.error) {
        switch (video.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Video playback was aborted.";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "A network error occurred while loading the video.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "The video could not be decoded.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "The video format is not supported.";
            break;
        }
      }
      setError(errorMessage);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleStalled = () => {
      setError("Video playback stalled. Please check your connection.");
      setIsLoading(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error('Playback error:', err);
          setError("Failed to play video. Please try again.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="rounded-md bg-destructive p-4 text-white">{error}</div>
        </div>
      )}

      <video
        ref={videoRef}
        className="h-full w-full"
        src={movieId ? `https://moviesapi.club/movies/${movieId}/stream` : ''}
        onError={(e) => {
          console.error('Video error event:', e);
          setError("Failed to load video. Please try again later.");
        }}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/20 p-2 hover:bg-white/30 disabled:opacity-50"
            disabled={isLoading || !!error}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </button>

          <div className="flex w-32 items-center gap-2">
            <button
              onClick={toggleMute}
              className="rounded-full bg-white/20 p-2 hover:bg-white/30 disabled:opacity-50"
              disabled={isLoading || !!error}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
              disabled={isLoading || !!error}
            />
          </div>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = value[0];
                }
              }}
              disabled={isLoading || !!error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
