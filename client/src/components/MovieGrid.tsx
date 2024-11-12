import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies?: any[];
  loading?: boolean;
}

export default function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movies?.length) {
    return <div>No movies found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
