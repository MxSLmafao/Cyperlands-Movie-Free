import { useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { useTMDB } from "@/hooks/use-tmdb";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"trending" | "popular">("trending");
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTMDB("trending/movie/week");
  const { data: popularMovies, isLoading: popularLoading, error: popularError } = useTMDB("movie/popular");

  const isLoading = trendingLoading || popularLoading;
  const error = trendingError || popularError;
  const movies = activeTab === "trending" ? trendingMovies?.results : popularMovies?.results;

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-primary">CineStreamX</h1>
        <SearchBar />
      </header>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("trending")}
          className={`rounded-md px-4 py-2 ${
            activeTab === "trending"
              ? "bg-primary text-white"
              : "bg-secondary text-muted-foreground"
          }`}
          disabled={isLoading}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`rounded-md px-4 py-2 ${
            activeTab === "popular"
              ? "bg-primary text-white"
              : "bg-secondary text-muted-foreground"
          }`}
          disabled={isLoading}
        >
          Popular
        </button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-md bg-destructive p-4 text-white">
            Failed to load movies. Please try again later.
          </div>
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
