import { Link, useRouter } from "@tanstack/react-router";
import { Film, LogOut, Search, Ticket, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"];

export function SiteHeader() {
  const { user, roles } = useAuth();
  const router = useRouter();
  const isManager = roles.includes("manager") || roles.includes("admin");

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary-glow p-1.5 shadow-glow">
            <Film className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient-primary">Cine</span>verse
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>Movies</Link>
          {user && (
            <Link to="/bookings" className="px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>My Bookings</Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs sm:flex">
            <select
              defaultValue={typeof window !== "undefined" ? localStorage.getItem("city") || "Mumbai" : "Mumbai"}
              onChange={(e) => {
                localStorage.setItem("city", e.target.value);
                router.invalidate();
              }}
              className="bg-transparent text-foreground outline-none"
            >
              {CITIES.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
            </select>
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
            <Search className="size-4" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/20 text-primary-foreground">{initial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.navigate({ to: "/profile" })}>
                  <UserIcon className="mr-2 size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.navigate({ to: "/bookings" })}>
                  <Ticket className="mr-2 size-4" /> My Bookings
                </DropdownMenuItem>
                {isManager && (
                  <DropdownMenuItem onClick={() => router.navigate({ to: "/manager" })}>
                    <LayoutDashboard className="mr-2 size-4" /> Manager
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-gradient-to-r from-primary to-primary-glow shadow-glow hover:opacity-90">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
