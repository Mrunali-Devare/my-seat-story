import { Link, useRouter } from "@tanstack/react-router";
import { Film, LogOut, Search, Ticket, User as UserIcon, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { GlassPanel } from "@/components/premium/GlassPanel";
import { useState } from "react";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune"];

export function SiteHeader() {
  const { user, roles } = useAuth();
  const router = useRouter();
  const isManager = roles.includes("manager") || roles.includes("admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[color:var(--color-background)]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-glow)] p-2 shadow-glow">
            <Film className="size-6 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
            <span className="text-gradient-primary">Cine</span>verse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-white/5 rounded-lg" activeProps={{ className: "text-foreground bg-white/10" }} activeOptions={{ exact: true }}>Movies</Link>
          {user && (
            <Link to="/bookings" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-white/5 rounded-lg" activeProps={{ className: "text-foreground bg-white/10" }}>My Bookings</Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* City selector */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:flex">
            <select
              defaultValue={typeof window !== "undefined" ? localStorage.getItem("city") || "Mumbai" : "Mumbai"}
              onChange={(e) => {
                localStorage.setItem("city", e.target.value);
                router.invalidate();
              }}
              className="bg-transparent text-foreground outline-none cursor-pointer"
            >
              {CITIES.map((c) => <option key={c} value={c} className="bg-card">{c}</option>)}
            </select>
          </div>

          {/* Search button */}
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-white/10 text-white/70 hover:text-white" aria-label="Search">
            <Search className="size-5" />
          </Button>

          {/* User menu or sign in */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-white/10">
                  <Avatar className="size-9 border border-white/20">
                    <AvatarFallback className="bg-[color:var(--color-primary)]/20 text-[color:var(--color-primary)] font-semibold">{initial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[color:var(--color-card)] border-white/10">
                <DropdownMenuLabel className="text-white">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => router.navigate({ to: "/profile" })} className="text-white/80 hover:text-white hover:bg-white/10">
                  <UserIcon className="mr-2 size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.navigate({ to: "/bookings" })} className="text-white/80 hover:text-white hover:bg-white/10">
                  <Ticket className="mr-2 size-4" /> My Bookings
                </DropdownMenuItem>
                {isManager && (
                  <DropdownMenuItem onClick={() => router.navigate({ to: "/manager" })} className="text-white/80 hover:text-white hover:bg-white/10">
                    <LayoutDashboard className="mr-2 size-4" /> Manager
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={signOut} className="text-white/80 hover:text-white hover:bg-white/10">
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <PremiumButton asChild variant="crimson" size="sm">
              <Link to="/auth">Sign in</Link>
            </PremiumButton>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-white/10 text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <GlassPanel className="mx-4 mb-4 md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              to="/"
              className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              activeProps={{ className: "text-white bg-white/10" }}
              activeOptions={{ exact: true }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
            {user && (
              <Link
                to="/bookings"
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                activeProps={{ className: "text-white bg-white/10" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}
            {!user && (
              <Link
                to="/auth"
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </GlassPanel>
      )}
    </header>
  );
}
