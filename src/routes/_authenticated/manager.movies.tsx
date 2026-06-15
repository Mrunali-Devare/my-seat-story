import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/manager/movies")({
  component: ManagerMovies,
});

function ManagerMovies() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", poster_url: "", duration_minutes: "120", genres: "", languages: "English", certificate: "UA" });

  const { data: movies = [] } = useQuery({
    queryKey: ["mgr-movies-list"],
    queryFn: async () => (await supabase.from("movies").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const create = async () => {
    if (!form.title) return toast.error("Title required");
    const { error } = await supabase.from("movies").insert({
      title: form.title,
      description: form.description,
      poster_url: form.poster_url || null,
      duration_minutes: Number(form.duration_minutes),
      genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
      languages: form.languages.split(",").map((g) => g.trim()).filter(Boolean),
      certificate: form.certificate,
      status: "now_showing" as const,
    });
    if (error) return toast.error(error.message);
    toast.success("Movie added");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["mgr-movies-list"] });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-glow shadow-glow"><Plus className="mr-2 size-4" /> Add movie</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add a movie</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Poster URL</Label><Input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} placeholder="https://…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Duration (min)</Label><Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Certificate</Label><Input value={form.certificate} onChange={(e) => setForm({ ...form, certificate: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Genres (comma separated)</Label><Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Action, Sci-Fi" /></div>
              <div className="space-y-1.5"><Label>Languages</Label><Input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="English, Hindi" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create} className="bg-gradient-to-r from-primary to-primary-glow shadow-glow">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((m: any) => (
          <div key={m.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-card">
            {m.poster_url && <img src={m.poster_url} alt={m.title} className="h-32 w-20 shrink-0 rounded-md object-cover" />}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{m.title}</h3>
              <p className="text-xs text-muted-foreground">{m.duration_minutes}m · {m.certificate}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {m.genres?.slice(0, 3).map((g: string) => <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>)}
              </div>
              <Badge className="mt-2 capitalize bg-primary/15 text-primary-glow hover:bg-primary/20">{m.status.replace("_", " ")}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
