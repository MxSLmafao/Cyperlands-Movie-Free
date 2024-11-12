import { Loader2 } from "lucide-react";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies?: any[];
  loading?: boolean;
  error?: Error;
}

export default function MovieGrid({ movies, loading, error }: MovieGridProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-md bg-destructive p-4 text-white">
          Failed to load movies. Please try again later.
        </div>
      </div>
    );
  }

  if (!movies?.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        No movies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
