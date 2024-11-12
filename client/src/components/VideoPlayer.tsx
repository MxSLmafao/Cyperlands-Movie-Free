import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  movieId: string;
}

interface VideoFormat {
  src: string;
  type: string;
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

  const videoFormats: VideoFormat[] = movieId
    ? [
        {
          src: `https://moviesapi.club/movies/${movieId}/stream`,
          type: 'application/x-mpegURL' // HLS
        },
        {
          src: `https://moviesapi.club/movies/${movieId}/stream.mp4`,
          type: 'video/mp4'
        }
      ]
    : [];

  // Reset states when movieId changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    
    return () => {
      setIsLoading(false);
      setError(null);
    };
  }, [movieId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check browser format support
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl');
    const canPlayMP4 = video.canPlayType('video/mp4');

    console.log('Browser video support:', {
      hls: canPlayHLS,
      mp4: canPlayMP4
    });

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded');
      setDuration(video.duration);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
    };

    const handleWaiting = () => {
      console.log('Video is waiting/buffering');
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log('Video is playing');
      setIsLoading(false);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      let errorMessage = "Failed to load video. Please try again later.";
      if (video.error) {
        console.error('Video error code:', video.error.code);
        console.error('Video error message:', video.error.message);
        
        switch (video.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Video playback was aborted.";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "A network error occurred while loading the video. Please check your connection.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "The video could not be decoded. The file might be corrupted.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = `This video format is not supported. Browser support: ${
              video.canPlayType('application/vnd.apple.mpegurl') ? 'HLS ✓' : 'HLS ✗'
            }, ${
              video.canPlayType('video/mp4') ? 'MP4 ✓' : 'MP4 ✗'
            }`;
            break;
        }
      }
      setError(errorMessage);
      setIsLoading(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
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
        crossOrigin="anonymous"
        playsInline
      >
        {videoFormats.map((format, index) => (
          <source key={index} src={format.src} type={format.type} />
        ))}
        Your browser does not support the video tag or the video format.
      </video>
      
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
