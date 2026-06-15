import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, CalendarClock, MapPin, Sparkles, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { MovieCard } from "@/components/movies/MovieCard";
import { HeroBanner } from "@/components/premium/HeroBanner";
import { GlassPanel } from "@/components/premium/GlassPanel";
import { PremiumCard } from "@/components/premium/PremiumCard";
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

  const featuredMovies = movies.filter((m) => m.featured && m.status === "now_showing") as HeroMovie[];
  const trending = movies.filter((m) => m.trending && m.status === "now_showing");
  const nowShowing = movies.filter((m) => m.status === "now_showing");
  const upcoming = movies.filter((m) => m.status === "upcoming");

  // Use featured movies for hero, or fall back to top rated now showing movies
  const heroMovies = featuredMovies.length > 0 
    ? featuredMovies 
    : (nowShowing.slice(0, 5) as HeroMovie[]);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <SiteHeader />

      {/* Hero Banner */}
      {!isLoading && heroMovies.length > 0 && (
        <HeroBanner movies={heroMovies} />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Location indicator */}
        <GlassPanel className="mb-8 inline-flex items-center gap-3 px-4 py-2">
          <MapPin className="size-4 text-[color:var(--color-gold)]" />
          <span className="text-sm text-white/80">
            Showing for <span className="font-semibold text-white">
              {typeof window !== "undefined" ? localStorage.getItem("city") ?? "Mumbai" : "Mumbai"}
            </span>
          </span>
        </GlassPanel>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Film className="mx-auto size-12 text-[color:var(--color-primary)] animate-pulse" />
              <p className="mt-4 text-white/60">Loading movies…</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Now Showing */}
            <PremiumCard variant="default" className="p-6 md:p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--color-primary)]/20">
                  <Sparkles className="size-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">Now Showing</h2>
                  <p className="text-sm text-white/60">Currently playing in theatres</p>
                </div>
              </div>
              <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
                {nowShowing.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </PremiumCard>

            {/* Trending */}
            {trending.length > 0 && (
              <PremiumCard variant="default" className="p-6 md:p-8 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--color-gold)]/20">
                    <TrendingUp className="size-5 text-[color:var(--color-gold)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Trending This Week</h2>
                    <p className="text-sm text-white/60">Most popular movies right now</p>
                  </div>
                </div>
                <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
                  {trending.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </PremiumCard>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <PremiumCard variant="default" className="p-6 md:p-8 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--color-primary)]/20">
                    <CalendarClock className="size-5 text-[color:var(--color-primary)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Upcoming Releases</h2>
                    <p className="text-sm text-white/60">Coming soon to theatres</p>
                  </div>
                </div>
                <div className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
                  {upcoming.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </PremiumCard>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-glow)] p-2">
                <Film className="size-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gradient-primary">Cineverse</span>
            </div>
            <p className="text-sm text-white/60">© Cineverse — Movie ticketing reimagined.</p>
            <p className="text-xs text-white/40">Mock payments enabled. No real charges are processed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
