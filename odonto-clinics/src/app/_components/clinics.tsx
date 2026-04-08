import { Card, CardContent } from "@/components/ui/card";
import Foto from "../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/generated/prisma/client";

interface ProfessionalProps {
  professionals: User[];
  limit?: number;
}

export function Clinics({professionals, limit}: ProfessionalProps) {
  const list = limit ? professionals.slice(0, limit) : professionals;
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12 font-bold">
          Clínicas Disponíveis
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((clinic) => (
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
                        <p className="text-sm text-blue-500 leading-snug">{clinic.address}</p>
                      )}
                      {clinic.phone && (
                        <p className="text-sm font-medium text-gray-600">{clinic.phone}</p>
                      )}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0" />
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
      </div>
    </div>
  );
}
