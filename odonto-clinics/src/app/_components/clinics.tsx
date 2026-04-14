import Image from "next/image";
import Link from "next/link";
import { User } from "@/generated/prisma/client";
import { MapPin, Phone, Clock, ArrowRight, CalendarCheck } from "lucide-react";
import Foto from "../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg";
import { ClinicGridSkeleton } from "./clinic-card-skeleton";
import { ClinicStatusBadge } from "./clinic-status-badge";
import { Suspense } from "react";

interface ProfessionalProps {
  professionals: User[];
  limit?: number;
}


export function Clinics({ professionals, limit }: ProfessionalProps) {
  const list = limit ? professionals.slice(0, limit) : professionals;

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">
              Clínicas em destaque
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Clínicas Disponíveis
            </h2>
          </div>
          {limit && (
            <Link
              href="/clinicas"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <Suspense fallback={<ClinicGridSkeleton count={limit ?? 4} />}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((clinic) => (
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
                    <h3 className="font-bold text-base text-gray-900 leading-tight truncate">
                      {clinic.name}
                    </h3>
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
        </Suspense>
      </div>
    </section>
  );
}
