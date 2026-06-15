import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Sparkles, TrendingUp, CalendarClock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { MovieRow } from "@/components/movies/MovieRow";
import { Button } from "@/components/ui/button";
import type { MovieCardData } from "@/components/movies/MovieCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cineverse — Book movie tickets online" },
      { name: "description", content: "Browse trending films, pick your seats, and book movie tickets in seconds." },
      { property: "og:title", content: "Cineverse — Book movie tickets online" },
      { property: "og:description", content: "Browse trending films, pick your seats, and book movie tickets in seconds." },
    ],
  }),
  component: Home,
});

type HeroMovie = MovieCardData & { description: string | null; backdrop_url: string | null };

function Home() {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("id,title,description,poster_url,backdrop_url,rating,genres,duration_minutes,certificate,languages,featured,trending,status")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const featured = (movies.filter((m) => m.featured && m.status === "now_showing")[0] ?? movies[0]) as HeroMovie | undefined;
  const trending = movies.filter((m) => m.trending && m.status === "now_showing");
  const nowShowing = movies.filter((m) => m.status === "now_showing");
  const upcoming = movies.filter((m) => m.status === "upcoming");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {featured?.backdrop_url && (
          <div className="absolute inset-0 -z-10">
            <img src={featured.backdrop_url} alt="" className="size-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
            <div className="absolute inset-0 bg-hero opacity-80" />
          </div>
        )}
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              <Sparkles className="size-3.5" /> Now showing
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
              {featured?.title ?? "Your next great night out"}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {featured?.description ?? "Discover the latest films and book the perfect seat in seconds."}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {featured && (
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow shadow-glow hover:opacity-95">
                  <Link to="/movies/$id" params={{ id: featured.id }}>
                    <Play className="mr-2 size-4 fill-current" /> Book tickets
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="border-border/60 bg-card/40 backdrop-blur">
                <a href="#now-showing"><CalendarClock className="mr-2 size-4" /> See showtimes</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary-glow" />
              Showing for <span className="font-semibold text-foreground">{typeof window !== "undefined" ? localStorage.getItem("city") ?? "Mumbai" : "Mumbai"}</span>
            </div>
          </div>
        </div>
      </section>

      <div id="now-showing">
        {isLoading && (
          <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Loading movies…</div>
        )}
        <MovieRow eyebrow="In theatres" title="Now Showing" movies={nowShowing} />
        {trending.length > 0 && (
          <MovieRow eyebrow={(<span className="inline-flex items-center gap-1.5"><TrendingUp className="size-3"/> Trending</span>) as any} title="Trending this week" movies={trending} />
        )}
        <MovieRow eyebrow="Coming soon" title="Upcoming Releases" movies={upcoming} />
      </div>

      <footer className="mt-20 border-t border-border/40 py-10">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground">
          <p>© Cineverse — Movie ticketing reimagined.</p>
          <p className="text-xs opacity-60">Mock payments enabled. No real charges are processed.</p>
        </div>
      </footer>
    </div>
  );
}
