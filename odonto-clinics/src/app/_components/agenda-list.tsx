'use client'

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import type { Prisma } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { cancelAppointment } from "@/app/_actions-appointments/cancel-appointment";
import { useQueryClient } from "@tanstack/react-query";


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
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const {data, isLoading} = useQuery({
        queryKey: ['get-appointments',date],
        queryFn: async () => {
            const activeDate = date ?? format(new Date(), 'yyyy-MM-dd');

            const url = `/api/clinica/agendamentos?data=${activeDate}`;
            const response = await fetch(url);
            const json = await response.json() as AppointmentWithServ[];

            if(!response.ok) {
                return [];
            }
            else {
                return json;
            }
        }
        ,
        staleTime: 20000,
        refetchInterval: 60000 
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

    async function HandleCancelAppointment(appointmentId: string) {
        const response = await cancelAppointment({ appointmentId });
        if (response?.error) {
            addToast(response.error, 'error');
        } else {
            addToast('Agendamento cancelado com sucesso!', 'success');
            queryClient.invalidateQueries({ queryKey: ['get-appointments', date] });
        }
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl md:text-2xl font-bold">
                Agendamentos
              </CardTitle>
            </CardHeader>
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
                                       <div className="text-sm font-thin  from-neutral-500">
                                        {occupant.phone}
                                       </div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="flex gap-4">
                                            <Button variant='ghost' size='icon'>
                                                <Eye className="w-4 h-4"/>
                                            </Button>
                                            <Button variant='ghost' size='icon' onClick={() => HandleCancelAppointment(occupant.id)}>
                                               <X className="w-4 h-4"/>
                                            </Button>
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