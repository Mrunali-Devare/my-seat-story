import { MovieCard, type MovieCardData } from "./MovieCard";

export function MovieRow({ title, movies, eyebrow }: { title: string; eyebrow?: string; movies: MovieCardData[] }) {
  if (!movies.length) return null;
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">{eyebrow}</p>}
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
        {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
    </section>
  );
}
