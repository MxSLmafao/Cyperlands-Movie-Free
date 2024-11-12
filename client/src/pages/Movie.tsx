import { useParams } from "wouter";
import { useTMDB } from "@/hooks/use-tmdb";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export default function Movie() {
  const { id } = useParams();
  const { data: movie } = useTMDB(`movie/${id}`);
  const { data: credits } = useTMDB(`movie/${id}/credits`);
  const { user } = useUser();
  const { toast } = useToast();

  if (!movie) return <div>Loading...</div>;

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add movies to your watchlist",
        variant: "destructive",
      });
      return;
    }
    // Add to watchlist logic here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <VideoPlayer movieId={id} />
        
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
            <p className="mb-4 text-lg text-muted-foreground">
              {movie.overview}
            </p>
            <div className="mb-4 flex gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <Button onClick={handleAddToWatchlist}>
              Add to Watchlist
            </Button>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Cast</h2>
            <div className="space-y-4">
              {credits?.cast?.slice(0, 5).map((actor) => (
                <div key={actor.id} className="flex items-center gap-4">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                    alt={actor.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{actor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
