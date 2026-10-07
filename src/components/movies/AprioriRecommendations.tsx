import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard, type MovieCardData } from "./MovieCard";

type Recommendation = {
  movie_id: string;
  movie_title: string;
  poster_url: string | null;
  rating: number | null;
  genres: string[];
  duration_minutes: number;
  certificate: string | null;
  languages: string[];
  support: number;
  confidence: number;
  lift: number;
};

export function AprioriRecommendations({
  movieTitle,
}: {
  movieTitle: string;
}) {
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["apriori-recommendations", movieTitle],
    enabled: !!movieTitle,

    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_apriori_recommendations",
        {
          p_movie_title: movieTitle,
        }
      );

      if (error) throw error;

      return (data ?? []) as Recommendation[];
    },
  });

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15">
            <Sparkles className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Recommended for You
            </h2>

            <p className="text-sm text-muted-foreground">
              Based on viewer movie associations
            </p>
          </div>
        </div>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
        {recommendations.map((recommendation) => {
          const movie: MovieCardData = {
            id: recommendation.movie_id,
            title: recommendation.movie_title,
            poster_url: recommendation.poster_url,
            rating: recommendation.rating,
            genres: recommendation.genres,
            duration_minutes: recommendation.duration_minutes,
            certificate: recommendation.certificate,
            languages: recommendation.languages,
          };

          return (
            <div
              key={recommendation.movie_id}
              className="w-[220px] shrink-0"
            >
              <MovieCard movie={movie} />

              <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />

                  <p className="text-sm font-semibold">
                    Why recommended?
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Viewers who watched{" "}
                  <span className="font-medium text-foreground">
                    {movieTitle}
                  </span>{" "}
                  also watched this movie.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-background p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      Confidence
                    </p>

                    <p className="text-sm font-semibold">
                      {(recommendation.confidence * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div className="rounded-md bg-background p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">
                      Lift
                    </p>

                    <p className="text-sm font-semibold">
                      {recommendation.lift.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}