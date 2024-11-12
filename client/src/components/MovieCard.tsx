import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="movie-card cursor-pointer">
        <CardContent className="p-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="h-[300px] w-full object-cover"
          />
          <div className="movie-card-overlay p-4">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="mb-1 text-lg font-bold text-white">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
