'use client'

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import type { Prisma } from "@/generated/prisma/client";

type AppointmentWithServ = Prisma.AppointmentsGetPayload<{
    include: {
        service: true;
    }
}>
interface AgendaListProps {
    times: string[]
}

export function AgendaList({times}: AgendaListProps) {
    const searchParams = useSearchParams();
    const date = searchParams.get('date');

    const {data, isLoading} = useQuery({
        queryKey: ['get-appointments',date],
        queryFn: async () => {
            const activeDate = date ?? format(new Date(), 'yyyy-MM-dd');

            const url = `${process.env.NEXT_PUB}/api/clinica/agendamentos?date=${activeDate}`;
            const response = await fetch(url);
            const json = await response.json() as AppointmentWithServ[];

            if(!response.ok) {
                return [];
            }
            else {
                return json;
            }
        }
    })

    const occupantRecord: Record<string, AppointmentWithServ> = {

    };

    if(data && data.length > 0) {
        for ( const appointment of data) {
            const requiredSlots = Math.ceil(appointment.service.duration / 30);
            const startIndex = times.indexOf(appointment.time);

            if(startIndex !== -1) {
                for (let i = 0; i < requiredSlots; i++) {
                    const slotIndex = startIndex + i;
                    if(slotIndex < times.length) {
                        occupantRecord[times[slotIndex]] = appointment;
                    }
                }
            }
        }
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold ml-7">
                Agendamentos
            </CardTitle>
            <button>DATA</button>
            <CardHeader/>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-13rem)] lg:h-[calc(100vh-15rem)] pr-4">
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : (
                        times.map((slot)=> {

                            const occupant = occupantRecord[slot];

                            if(occupant) {
                                return (
                                <div key={slot} className="flex items-center py-2 border-t last:border-b">
                                    <div className="w-16 tex-sm font-semibold">
                                    {slot}
                                    </div>
                                    <div className="flex-1 text-sm">
                                       <div className="font-semibold">
                                        {occupant.name}
                                       </div>
                                       <div className="text-sm  from-neutral-700">
                                        {occupant.email}
                                       </div>
                                    </div>
                                </div>
                                )
                            }
                        return (
                            <div key={slot} className="flex items-center py-2 border-t last:border-b">
                            <div className="w-16 tex-sm font-semibold">
                                {slot}
                            </div>
                            <div className="flex-1 text-sm text-gray-500">
                                Disponível
                            </div>
                        </div>
                        )
                    })
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}