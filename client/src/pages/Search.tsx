import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTMDB } from "@/hooks/use-tmdb";
import MovieGrid from "@/components/MovieGrid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Search() {
  const [_, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { data: searchResults, isLoading } = useTMDB(
    query
      ? `search/movie?query=${encodeURIComponent(query)}&year=${year}`
      : `discover/movie?sort_by=${sortBy}${genre ? `&with_genres=${genre}` : ""}${
          year ? `&year=${year}` : ""
        }`
  );

  const { data: genres } = useTMDB("genre/movie/list");

  // Get the search params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, []);

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Search Movies</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Input
            type="search"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLocation(`/search?q=${encodeURIComponent(e.target.value)}`);
            }}
            className="md:col-span-2"
          />

          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {genres?.genres?.map((g: any) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <MovieGrid
          movies={searchResults?.results}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
