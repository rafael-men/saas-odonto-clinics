'use client'

import { useState, useMemo } from "react";
import { User } from "@/generated/prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import Foto from "../../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg";
import { Search, MapPin, Clock, Wifi } from "lucide-react";

interface Props {
  professionals: User[];
}

const TIME_OPTIONS = [
  { label: "Manhã (06:00 - 12:00)", from: "06:00", to: "11:59" },
  { label: "Tarde (12:00 - 18:00)", from: "12:00", to: "17:59" },
  { label: "Noite (18:00 - 23:00)", from: "18:00", to: "22:59" },
];

function timeInRange(time: string, from: string, to: string) {
  return time >= from && time <= to;
}

export function ClinicasContent({ professionals }: Props) {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return professionals.filter((clinic) => {
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        clinic.name?.toLowerCase().includes(term) ||
        clinic.address?.toLowerCase().includes(term);

      const matchesAvailable = !onlyAvailable || clinic.status === true;

      const matchesPeriod =
        !selectedPeriod ||
        (() => {
          const period = TIME_OPTIONS.find((t) => t.label === selectedPeriod);
          if (!period) return true;
          return clinic.times.some((t) =>
            timeInRange(t, period.from, period.to)
          );
        })();

      return matchesSearch && matchesAvailable && matchesPeriod;
    });
  }, [professionals, search, onlyAvailable, selectedPeriod]);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-10">
          Clínicas Disponíveis
        </h1>

        <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Buscar por nome ou localização
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Ex: Centro, Clínica Saúde..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Horário de funcionamento
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() =>
                    setSelectedPeriod(
                      selectedPeriod === opt.label ? null : opt.label
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedPeriod === opt.label
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Wifi className="w-4 h-4" />
              Disponibilidade
            </label>
            <button
              onClick={() => setOnlyAvailable((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
                onlyAvailable
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  onlyAvailable ? "bg-white" : "bg-emerald-500"
                }`}
              />
              Apenas disponíveis
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Nenhuma clínica encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} clínica{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((clinic) => (
                <Card
                  key={clinic.id}
                  className="overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col"
                >
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="relative h-48 w-full shrink-0">
                      <Image
                        src={clinic.image || Foto}
                        alt={clinic.name ?? "Clínica"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-semibold text-base leading-tight truncate">
                            {clinic.name}
                          </h3>
                          {clinic.address && (
                            <p className="text-sm text-blue-500 leading-snug">
                              {clinic.address}
                            </p>
                          )}
                          {clinic.phone && (
                            <p className="text-sm font-medium text-gray-600">
                              {clinic.phone}
                            </p>
                          )}
                          {clinic.times.length > 0 && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {clinic.times[0]} – {clinic.times[clinic.times.length - 1]}
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                            clinic.status ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div className="mt-auto">
                        <Link
                          href={`/clinica/${clinic.id}`}
                          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-md text-sm font-medium flex items-center justify-center py-2"
                        >
                          Agendar horário
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
