import { Card, CardContent } from "@/components/ui/card";
import Foto from "../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg";
import Image from "next/image";
import Link from "next/link";

export function Clinics() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12 font-bold">
          Clínicas Disponíveis
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-40 w-full">
                <Image
                  src={Foto}
                  alt="Clínica"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">Clínica centro</h3>
                    <p className="text-sm text-gray-600">
                      Rua x, centro, Campo Grande - MS
                    </p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1"></div>
                </div>
                <Link
                  href="/clinica/1"
                  className="w-full bg-blue-500 text-white rounded-md text-sm font-medium flex items-center justify-center py-2"
                >
                  Agendar horário 
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
