'use client'

import { useState, useMemo } from "react";
import { User } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import Foto from "../../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg";
import { Search, MapPin, Clock, Wifi, CalendarCheck, Phone, SlidersHorizontal } from "lucide-react";
import { ClinicGridSkeleton } from "@/app/_components/clinic-card-skeleton";
import { ClinicStatusBadge, isClinicOpen } from "@/app/_components/clinic-status-badge";

interface Props {
  professionals: User[];
}

const TIME_OPTIONS = [
  { label: "Manhã", from: "06:00", to: "11:59" },
  { label: "Tarde", from: "12:00", to: "17:59" },
  { label: "Noite", from: "18:00", to: "22:59" },
];

function timeInRange(time: string, from: string, to: string) {
  return time >= from && time <= to;
}



export function ClinicasContent({ professionals }: Props) {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  function handleSearch(val: string) {
    setIsFiltering(true);
    setSearch(val);
    setTimeout(() => setIsFiltering(false), 300);
  }

  const filtered = useMemo(() => {
    return professionals.filter((clinic) => {
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        clinic.name?.toLowerCase().includes(term) ||
        clinic.address?.toLowerCase().includes(term);

      const matchesAvailable = !onlyAvailable || isClinicOpen(clinic.times);

      const matchesPeriod =
        !selectedPeriod ||
        (() => {
          const period = TIME_OPTIONS.find((t) => t.label === selectedPeriod);
          if (!period) return true;
          return clinic.times.some((t) => timeInRange(t, period.from, period.to));
        })();

      return matchesSearch && matchesAvailable && matchesPeriod;
    });
  }, [professionals, search, onlyAvailable, selectedPeriod]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-800/20 blur-3xl" />
        <div className="container mx-auto relative z-10 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-3">Encontre sua Clínica</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 -mt-8 relative z-10">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-700">
            <SlidersHorizontal className="w-4 h-4 text-blue-500" />
            Filtrar clínicas
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou endereço..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedPeriod(selectedPeriod === opt.label ? null : opt.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    selectedPeriod === opt.label
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-200"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOnlyAvailable((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all shrink-0 ${
                onlyAvailable
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              <Wifi className="w-4 h-4" />
              Disponíveis
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
          clínica{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
        </p>
        {isFiltering ? (
          <ClinicGridSkeleton count={4} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold text-gray-500">Nenhuma clínica encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((clinic) => (
              <div
                key={clinic.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden">
                  <Image
                    src={clinic.image || Foto}
                    alt={clinic.name ?? "Clínica"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <ClinicStatusBadge times={clinic.times} />
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 leading-tight truncate">{clinic.name}</h3>
                    {clinic.address && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                        <span className="truncate">{clinic.address}</span>
                      </p>
                    )}
                    {clinic.phone && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                        {clinic.phone}
                      </p>
                    )}
                    {clinic.times.length > 0 && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {clinic.times[0]} – {clinic.times[clinic.times.length - 1]}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={`/clinica/${clinic.id}`}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 py-2.5 transition-all shadow-sm shadow-blue-200"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Agendar horário
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
