'use client'

import { useEffect, useState } from "react";

export function isClinicOpen(times: string[]): boolean {
  if (times.length === 0) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...times].sort();
  const first = sorted[0].split(':').map(Number);
  const last = sorted[sorted.length - 1].split(':').map(Number);
  const openMin = first[0] * 60 + first[1];
  const closeMin = last[0] * 60 + last[1] + 30;

  return currentMinutes >= openMin && currentMinutes <= closeMin;
}

export function ClinicStatusBadge({ times }: { times: string[] }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isClinicOpen(times));
  }, [times]);

  if (open === null) return null;

  if (open) {
    return (
      <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Aberta
      </span>
    );
  }

  return (
    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Fechada
    </span>
  );
}
