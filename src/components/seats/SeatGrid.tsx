import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type SeatRow = {
  id: string;
  show_id: string;
  row_label: string;
  col_num: number;
  seat_label: string;
  seat_type: "regular" | "premium" | "vip" | "recliner";
  price: number;
  status: "available" | "locked" | "booked";
  locked_by: string | null;
  locked_until: string | null;
};

const TYPE_COLOR: Record<SeatRow["seat_type"], string> = {
  regular: "border-[color:var(--color-seat-available)]",
  premium: "border-[color:var(--color-seat-premium)]",
  vip: "border-[color:var(--color-seat-vip)]",
  recliner: "border-[color:var(--color-seat-recliner)]",
};

export function SeatGrid({
  seats, selected, currentUserId, onToggle,
}: {
  seats: SeatRow[];
  selected: Set<string>;
  currentUserId: string | null;
  onToggle: (seat: SeatRow) => void;
}) {
  const rows = useMemo(() => {
    const map = new Map<string, SeatRow[]>();
    for (const s of seats) {
      if (!map.has(s.row_label)) map.set(s.row_label, []);
      map.get(s.row_label)!.push(s);
    }
    for (const [, arr] of map) arr.sort((a, b) => a.col_num - b.col_num);
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  return (
    <div className="space-y-6">
      <div className="mx-auto h-1.5 max-w-md rounded-full bg-gradient-to-r from-transparent via-primary-glow to-transparent" />
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">All eyes this way please</p>

      <div className="space-y-2">
        {rows.map(([row, arr]) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-5 text-xs font-semibold text-muted-foreground">{row}</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {arr.map((seat, i) => {
                const sel = selected.has(seat.id);
                const isBooked = seat.status === "booked";
                const isMine = seat.status === "locked" && seat.locked_by === currentUserId;
                const isOtherLock = seat.status === "locked" && !isMine;
                const gap = arr.length > 6 && i === Math.floor(arr.length / 2) ? "ml-3" : "";

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked || isOtherLock}
                    onClick={() => onToggle(seat)}
                    title={`${seat.seat_label} · ${seat.seat_type} · ₹${seat.price}`}
                    className={cn(
                      "relative size-7 rounded-md border text-[10px] font-semibold transition disabled:cursor-not-allowed",
                      gap,
                      isBooked && "border-transparent bg-[color:var(--color-seat-booked)] text-muted-foreground/40",
                      isOtherLock && "border-[color:var(--color-seat-locked)] bg-[color:var(--color-seat-locked)]/30 text-muted-foreground",
                      !isBooked && !isOtherLock && !sel && cn("bg-card hover:bg-primary/20 hover:border-primary-glow", TYPE_COLOR[seat.seat_type]),
                      sel && "border-transparent bg-[color:var(--color-seat-selected)] text-[color:var(--color-gold-foreground)] shadow-glow",
                    )}
                  >
                    {seat.col_num}
                  </button>
                );
              })}
            </div>
            <span className="w-5 text-xs font-semibold text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <Legend swatch="bg-card border border-[color:var(--color-seat-available)]" label="Available" />
        <Legend swatch="bg-[color:var(--color-seat-selected)]" label="Selected" />
        <Legend swatch="bg-[color:var(--color-seat-booked)]" label="Booked" />
        <Legend swatch="bg-[color:var(--color-seat-locked)]" label="On hold" />
        <Legend swatch="border-2 border-[color:var(--color-seat-premium)]" label="Premium" />
        <Legend swatch="border-2 border-[color:var(--color-seat-vip)]" label="VIP" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block size-4 rounded-md", swatch)} />
      {label}
    </span>
  );
}
