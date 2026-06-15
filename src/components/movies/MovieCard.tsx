import { Link } from "@tanstack/react-router";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type MovieCardData = {
  id: string;
  title: string;
  poster_url: string | null;
  rating: number | null;
  genres: string[];
  duration_minutes: number;
  certificate: string | null;
  languages: string[];
};

export function MovieCard({ movie }: { movie: MovieCardData }) {
  return (
    <Link
      to="/movies/$id"
      params={{ id: movie.id }}
      className="group block w-[180px] shrink-0 sm:w-[220px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-border/40 transition-all duration-300 group-hover:shadow-glow group-hover:ring-primary/40">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">No poster</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3">
          <div className="flex items-center gap-1.5 text-xs text-white/90">
            <Star className="size-3.5 fill-[color:var(--color-gold)] text-[color:var(--color-gold)]" />
            <span className="font-semibold">{(movie.rating ?? 0).toFixed(1)}</span>
            <span className="opacity-60">/ 5</span>
          </div>
        </div>
        {movie.certificate && (
          <Badge className="absolute right-2 top-2 bg-black/60 text-white backdrop-blur">{movie.certificate}</Badge>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-1 font-semibold transition group-hover:text-primary-glow">{movie.title}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{movie.genres.slice(0, 3).join(" • ")}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" /> {movie.duration_minutes}m · {movie.languages[0] ?? "EN"}
        </p>
      </div>
    </Link>
  );
}
