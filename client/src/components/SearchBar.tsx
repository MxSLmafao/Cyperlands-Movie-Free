import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTMDB } from "@/hooks/use-tmdb";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [_, setLocation] = useLocation();

  const { data: searchResults } = useTMDB(
    query ? `search/movie?query=${encodeURIComponent(query)}` : null
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (movieId: string) => {
    setOpen(false);
    setLocation(`/movie/${movieId}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/80"
      >
        <Search className="h-4 w-4" />
        <span>Search movies...</span>
        <kbd className="pointer-events-none ml-2 hidden select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search movies..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Movies">
            {searchResults?.results?.slice(0, 5).map((movie: any) => (
              <CommandItem
                key={movie.id}
                value={movie.title}
                onSelect={() => handleSelect(movie.id)}
              >
                <div className="flex items-center gap-2">
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{movie.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                setLocation(`/search?q=${encodeURIComponent(query)}`);
              }}
            >
              View all results
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
