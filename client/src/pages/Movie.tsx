import { useParams } from "wouter";
import { useTMDB } from "@/hooks/use-tmdb";
import VideoPlayer from "@/components/VideoPlayer";
import { Loader2 } from "lucide-react";

export default function Movie() {
  const { id } = useParams();
  const { data: movie, isLoading: movieLoading, error: movieError } = useTMDB(id ? `movie/${id}` : null);
  const { data: credits, isLoading: creditsLoading } = useTMDB(id ? `movie/${id}/credits` : null);

  if (movieLoading || creditsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-md bg-destructive p-4 text-white">
          Failed to load movie details. Please try again later.
        </div>
      </div>
    );
  }

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
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Cast</h2>
            <div className="space-y-4">
              {credits?.cast?.slice(0, 5).map((actor) => (
                <div key={actor.id} className="flex items-center gap-4">
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                      alt={actor.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
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
