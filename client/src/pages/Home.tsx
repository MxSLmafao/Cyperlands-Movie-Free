import { useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { useTMDB } from "@/hooks/use-tmdb";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"trending" | "popular">("trending");
  const { data: trendingMovies } = useTMDB("trending/movie/week");
  const { data: popularMovies } = useTMDB("movie/popular");

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
        >
          Popular
        </button>
      </div>

      <MovieGrid
        movies={activeTab === "trending" ? trendingMovies?.results : popularMovies?.results}
      />
    </div>
  );
}
