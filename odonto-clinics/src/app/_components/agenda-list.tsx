'use client'

import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, addDays, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Prisma } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, X, CalendarDays } from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { cancelAppointment } from "@/app/_actions-appointments/cancel-appointment";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DialogAppointment } from "./appointment-dialog";
import { useRouter } from "next/navigation";

export type AppointmentWithServ = Prisma.AppointmentsGetPayload<{
    include: { service: true }
}>

interface AgendaListProps {
    times: string[]
}

const COLORS = [
    'bg-blue-100 border-blue-400 text-blue-800',
    'bg-emerald-100 border-emerald-400 text-emerald-800',
    'bg-violet-100 border-violet-400 text-violet-800',
    'bg-amber-100 border-amber-400 text-amber-800',
    'bg-rose-100 border-rose-400 text-rose-800',
    'bg-cyan-100 border-cyan-400 text-cyan-800',
];

function getColor(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
}

export function AgendaList({ times }: AgendaListProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailAppointment, setDetailAppointment] = useState<AppointmentWithServ | null>(null);

    const dateParam = searchParams.get('date');
    const activeDate = dateParam ?? format(new Date(), 'yyyy-MM-dd');
    const parsedDate = parseISO(activeDate);

    function navigate(direction: 'prev' | 'next' | 'today') {
        let newDate: Date;
        if (direction === 'today') newDate = new Date();
        else if (direction === 'prev') newDate = subDays(parsedDate, 1);
        else newDate = addDays(parsedDate, 1);

        const url = new URL(window.location.href);
        url.searchParams.set('date', format(newDate, 'yyyy-MM-dd'));
        router.push(url.toString());
    }

    const { data, isLoading } = useQuery({
        queryKey: ['get-appointments', activeDate],
        queryFn: async () => {
            const url = `/api/clinica/agendamentos?data=${activeDate}`;
            const response = await fetch(url);
            if (!response.ok) return [];
            return response.json() as Promise<AppointmentWithServ[]>;
        },
        staleTime: 20000,
        refetchInterval: 60000,
    });

    // Map slots → appointment (accounting for duration)
    const occupantRecord: Record<string, AppointmentWithServ> = {};
    const appointmentStartSlot = new Set<string>();

    if (data && data.length > 0) {
        for (const appointment of data) {
            const requiredSlots = Math.ceil(appointment.service.duration / 30);
            const startIndex = times.indexOf(appointment.time);
            if (startIndex !== -1) {
                appointmentStartSlot.add(appointment.time);
                for (let i = 0; i < requiredSlots; i++) {
                    const slotIndex = startIndex + i;
                    if (slotIndex < times.length) {
                        occupantRecord[times[slotIndex]] = appointment;
                    }
                }
            }
        }
    }

    async function handleCancel(appointmentId: string) {
        const response = await cancelAppointment({ appointmentId });
        if (response?.error) {
            addToast(response.error, 'error');
        } else {
            addToast('Agendamento cancelado!', 'success');
            queryClient.invalidateQueries({ queryKey: ['get-appointments', activeDate] });
        }
    }

    const isToday = activeDate === format(new Date(), 'yyyy-MM-dd');
    const dateLabel = format(parsedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
    const totalAppointments = data?.length ?? 0;

    // Track which slots are continuations (not the start) to skip rendering
    const skippedSlots = new Set<string>();
    if (data && data.length > 0) {
        for (const appointment of data) {
            const requiredSlots = Math.ceil(appointment.service.duration / 30);
            const startIndex = times.indexOf(appointment.time);
            if (startIndex !== -1) {
                for (let i = 1; i < requiredSlots; i++) {
                    const slotIndex = startIndex + i;
                    if (slotIndex < times.length) skippedSlots.add(times[slotIndex]);
                }
            }
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="flex flex-col h-full bg-white rounded-xl border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold capitalize">{dateLabel}</p>
                            <p className="text-xs text-gray-500">{totalAppointments} agendamento{totalAppointments !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={isToday ? "default" : "outline"}
                            size="sm"
                            className={isToday ? "bg-blue-600 text-white" : ""}
                            onClick={() => navigate('today')}
                        >
                            Hoje
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                            Carregando agenda...
                        </div>
                    ) : (
                        <div className="divide-y">
                            {times.map((slot) => {
                                if (skippedSlots.has(slot)) return null;

                                const occupant = occupantRecord[slot];
                                const slotsCount = occupant
                                    ? Math.ceil(occupant.service.duration / 30)
                                    : 1;
                                const color = occupant ? getColor(occupant.id) : '';

                                return (
                                    <div
                                        key={slot}
                                        className="flex min-h-[3.5rem]"
                                        style={occupant ? { minHeight: `${slotsCount * 3.5}rem` } : {}}
                                    >
                                        {/* Time column */}
                                        <div className="w-16 shrink-0 flex items-start justify-center pt-3 text-xs font-medium text-gray-400 border-r bg-gray-50">
                                            {slot}
                                        </div>

                                        {/* Content column */}
                                        <div className="flex-1 px-3 py-2 flex items-start">
                                            {occupant ? (
                                                <div className={`flex-1 rounded-lg border-l-4 px-3 py-2 ${color} flex items-start justify-between gap-2`}>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm truncate">{occupant.name}</p>
                                                        <p className="text-xs opacity-75 truncate">{occupant.service.name}</p>
                                                        <p className="text-xs opacity-60 truncate">{occupant.phone}</p>
                                                        {slotsCount > 1 && (
                                                            <p className="text-xs opacity-50 mt-0.5">
                                                                {occupant.time} – {times[times.indexOf(occupant.time) + slotsCount] ?? ''}
                                                                {' '}({occupant.service.duration} min)
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 shrink-0">
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-7 h-7 opacity-70 hover:opacity-100"
                                                                onClick={() => setDetailAppointment(occupant)}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-7 h-7 opacity-70 hover:opacity-100 hover:text-red-500"
                                                            onClick={() => handleCancel(occupant.id)}
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-300 pt-1">Disponível</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <DialogAppointment appointment={detailAppointment} />
        </Dialog>
    );
}
