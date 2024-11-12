import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useTMDB } from "@/hooks/use-tmdb";
import useSWR from "swr";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [_, setLocation] = useLocation();
  const { user, isLoading: userLoading } = useUser();
  const { data: watchlist, mutate } = useSWR<{ movieId: number }[]>(
    "/api/watchlist"
  );

  const movieIds = watchlist?.map((item) => item.movieId) || [];
  const { data: movieDetails, isLoading: moviesLoading } = useTMDB(
    movieIds.length
      ? `movie/details?ids=${movieIds.join(",")}`
      : null
  );

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/auth");
    }
  }, [user, userLoading, setLocation]);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleRemoveFromWatchlist = async (movieId: number) => {
    try {
      await fetch(`/api/watchlist/${movieId}`, {
        method: "DELETE",
        credentials: "include",
      });
      mutate();
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your watchlist and preferences
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Your Watchlist</h2>
          {watchlist?.length === 0 ? (
            <p className="text-muted-foreground">
              Your watchlist is empty. Start adding movies you want to watch!
            </p>
          ) : (
            <MovieGrid
              movies={movieDetails}
              loading={moviesLoading}
            />
          )}
        </div>

        <Button
          variant="destructive"
          onClick={() => {
            fetch("/logout", { method: "POST", credentials: "include" }).then(
              () => setLocation("/")
            );
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
