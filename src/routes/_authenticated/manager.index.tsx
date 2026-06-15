import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Ticket, TrendingUp, Users, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/manager/")({
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["mgr-stats"],
    queryFn: async () => {
      const [b, m, t, s] = await Promise.all([
        supabase.from("bookings").select("total_amount, status, created_at"),
        supabase.from("movies").select("id", { count: "exact", head: true }),
        supabase.from("theaters").select("id", { count: "exact", head: true }),
        supabase.from("shows").select("id", { count: "exact", head: true }),
      ]);
      const totalRevenue = (b.data ?? []).filter((x: any) => x.status === "confirmed").reduce((sum: number, x: any) => sum + Number(x.total_amount), 0);
      const todayRevenue = (b.data ?? []).filter((x: any) => x.status === "confirmed" && new Date(x.created_at).toDateString() === new Date().toDateString())
        .reduce((sum: number, x: any) => sum + Number(x.total_amount), 0);
      return {
        bookings: b.data?.length ?? 0,
        movies: m.count ?? 0,
        theaters: t.count ?? 0,
        shows: s.count ?? 0,
        totalRevenue, todayRevenue,
      };
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={<TrendingUp className="size-5" />} label="Total revenue" value={inr(stats?.totalRevenue ?? 0)} hint={`${inr(stats?.todayRevenue ?? 0)} today`} />
      <Stat icon={<Ticket className="size-5" />} label="Bookings" value={String(stats?.bookings ?? 0)} />
      <Stat icon={<Building2 className="size-5" />} label="Theaters" value={String(stats?.theaters ?? 0)} />
      <Stat icon={<Users className="size-5" />} label="Active shows" value={String(stats?.shows ?? 0)} />
    </div>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="text-primary-glow">{icon}</span> {label}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
