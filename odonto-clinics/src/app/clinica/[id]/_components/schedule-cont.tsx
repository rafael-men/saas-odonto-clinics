'use client'

import Image from "next/image";
import Test from '../../../../../public/foto1.png';
import { MapPin, Clock, DollarSign, CreditCard, QrCode, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppointmentFormData, ScheduleForm } from "./schedule-form";
import { DateTimePicker } from "./datePicker";
import 'react-datepicker/dist/react-datepicker.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { ScheduleTime } from "./schedule-time";
import { createAppointment } from "../_actions/create-appointment";
import { useToast } from "@/components/toast-provider";



type UserWithService = Prisma.UserGetPayload<{
    include: {
        services: true
    }
}>

interface scheduleContentProps {
    clinica: UserWithService
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

const PAYMENT_OPTIONS = [
    {
        value: 'pix',
        label: 'PIX',
        description: 'Pagamento via PIX',
        icon: QrCode,
    },
    {
        value: 'credito',
        label: 'Crédito',
        description: 'Até 10x sem juros',
        icon: CreditCard,
    },
]

export function ScheduleContent({clinica}: scheduleContentProps) {
    const form = ScheduleForm();
    const { addToast } = useToast();
    const { watch } = form;
    const [selectedTime, setSelectedTime] = useState('');
    const [avTimeSlots, setAvTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const selectedDate = watch('date');
    const selectedServiceId = watch('serviceId');
    const selectedPayment = watch('paymentForm');


    function formatPhone(value: string) {
        const numbers = value.replace(/\D/g, '').slice(0, 11);

        if (numbers.length <= 10) {
            return numbers
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            return numbers
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }
    }


    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadingSlots(true);
        try {
            const dateString = date.toISOString().split('T')[0];
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/appointments?userId=${clinica.id}&date=${dateString}`);

            const json = await response.json();
            setLoadingSlots(false);
            return Array.isArray(json) ? json : [];
        }
        catch(err) {
            return [];
        } finally {
            setLoadingSlots(false);
        }
    },[clinica.id])

    useEffect(()=>{
        if(selectedDate) {
            fetchBlockedTimes(selectedDate).then((blocked) => {
                setBlockedTimes(blocked);
                const times = clinica.times || [];
                const now = new Date();
                const isToday = selectedDate.toDateString() === now.toDateString();

                const finalSlots = times.map((time) => {
                    let available = !blocked.includes(time);

                    if (isToday && available) {
                        const [hours, minutes] = time.split(':').map(Number);
                        const slotDate = new Date(selectedDate);
                        slotDate.setHours(hours, minutes, 0, 0);
                        available = slotDate > now;
                    }

                    return { time, available };
                });

                setAvTimeSlots(finalSlots);
            });
        }
    },[clinica.times, fetchBlockedTimes, selectedDate])

    async function handleSchedule(FormData: AppointmentFormData) {
        if(!selectedTime) {
            addToast('Selecione um horário para o agendamento.', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const response = await createAppointment({
                name: FormData.name,
                email: FormData.email,
                phone: FormData.phone,
                time: selectedTime,
                date: FormData.date.toISOString(),
                serviceId: FormData.serviceId,
                clinicaId: clinica.id,
                paymentForm: FormData.paymentForm,
            })

            if (response?.error) {
                addToast(response.error, 'error');
            } else {
                addToast('Agendamento realizado com sucesso!', 'success');
                form.reset();
                setSelectedTime('');
            }
        } catch {
            addToast('Erro inesperado ao agendar. Tente novamente.', 'error');
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <section className="h-36 bg-gradient-to-r from-blue-700 to-slate-800"/>
            <section className="container mx-auto px-4 -mt-20">
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col items-center">
                            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                                <Image src={ clinica.image ? clinica.image : Test} alt='clinica' className="object-cover" fill/>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{clinica.name}</h1>
                            <div className="flex items-center gap-1 text-gray-500 mt-1">
                                <MapPin className="w-4 h-4"/>
                                <span className="text-sm">{clinica.address}</span>
                            </div>
                    </div>
                </div>
            </section>

            <section className="max-w-2xl mx-auto w-full mt-8 pb-12">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSchedule)} className="mx-4 space-y-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Dados do Paciente</h2>

                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Nome Completo</FormLabel>
                            <FormControl>
                            <Input id="name" placeholder="Digite seu nome completo"
                            {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                     <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-gray-700">E-mail</FormLabel>
                            <FormControl>
                            <Input id="email" type="email" placeholder="exemplo@email.com"
                            {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                     <FormField control={form.control} name="phone" render={({field}) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Telefone</FormLabel>
                            <FormControl>
                            <Input id="phone" placeholder="(XX) XXXXX-XXXX"
                            {...field} onChange={(e) => {
                                const formattedValue = formatPhone(e.target.value);
                                field.onChange(formattedValue);
                            }} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <div className="border-t pt-5">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Agendamento</h2>
                    </div>

                     <FormField control={form.control} name="date" render={({field}) => (
                        <FormItem className="flex items-center gap-2 space-y-1">
                            <FormLabel className="font-semibold text-gray-700">Data</FormLabel>
                            <FormControl >
                            <DateTimePicker
                            initialDate={new Date()}
                            className="w-full rounded border p-3"
                            onChange={(date) => {
                                if(date) {
                                    field.onChange(date);
                                }
                            }}
                            />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>


                     <FormField control={form.control} name="serviceId" render={({field}) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Serviço</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Selecione um dos serviços'/>
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {clinica.services.map((service) => (
                                        <SelectItem key={service.id} value={service.id} className="py-3" textValue={service.name}>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium">{service.name}</span>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {Math.floor(service.duration / 60)}h {service.duration % 60}min
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        {(service.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    {selectedServiceId && (
                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-700">
                                Horários Disponíveis
                            </Label>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                {loadingSlots ? (
                                    <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Carregando horários...</span>
                                    </div>
                                ) : avTimeSlots.length === 0 ?
                                (
                                    <p className="text-center text-gray-500 py-4">Nenhum horário disponível para esta data</p>
                                ) :
                                (
                                    <ScheduleTime
                                    onSelectedTime={(time) => setSelectedTime(time)}
                                    selectedDate={selectedDate}
                                    selectedTime={selectedTime}
                                    requiredSlots={clinica.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinica.services.find(service => service.id === selectedServiceId)!.duration / 30) : 1}
                                    blockedTimes={blockedTimes}
                                    avTimeSlots={avTimeSlots}
                                    clinicaTimes={clinica.times}/>
                                )
                            }
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-5">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Forma de Pagamento</h2>
                        <p className="text-sm text-gray-500 mt-2 mb-4">Pagamento realizado no dia da consulta</p>
                    </div>

                    <FormField control={form.control} name="paymentForm" render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <div className="grid grid-cols-2 gap-3">
                                    {PAYMENT_OPTIONS.map((option) => {
                                        const isSelected = field.value === option.value;
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => field.onChange(option.value)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                                <span className="font-semibold text-sm">{option.label}</span>
                                                <span className="text-xs text-center">{option.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    {selectedPayment === 'credito' && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg">
                            <CreditCard className="w-4 h-4 shrink-0" />
                            <span>Parcelamento em até <strong>10x sem juros</strong> no cartão de crédito.</span>
                        </div>
                    )}

                    {clinica.status ? (
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-xl transition-colors"
                        type="submit"
                        disabled={submitting || !watch('name') || !watch('email') || !watch('phone') || !watch('date') || !watch('paymentForm')}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Agendando...
                            </span>
                        ) : (
                            'Agendar Consulta'
                        )}
                    </Button>
                    ): (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>A clínica está fechada no momento.</span>
                        </div>
                    )}

                </form>
            </Form>
            </section>
        </div>
    )
}
