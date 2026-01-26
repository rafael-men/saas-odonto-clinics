'use client'

import Image from "next/image";
import Test from '../../../../../public/foto1.png';
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScheduleForm } from "./schedule-form";
import { DateTimePicker } from "./datePicker";
import 'react-datepicker/dist/react-datepicker.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";



type UserWithService = Prisma.UserGetPayload<{
    include: {
        services: true
    }
}>

interface scheduleContentProps {
    clinica: UserWithService
}

export function ScheduleContent({clinica}: scheduleContentProps) {
    const form = ScheduleForm();

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


    return (
        <div className="min-h-screen flex flex-col">
            <section className="h-32 bg-black"/>
            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 mb-8">
                                <Image src={ clinica.image ? clinica.image : Test} alt='clinica' className="object-cover" fill/>
                            </div>
                            <h1 className="text-2xl font-bold">{clinica.name}</h1>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-5 h-5"/>
                                <span>{clinica.address}</span>
                            </div>
                    </div>
                </div>
            </section>

            <section className="max-w-2xl mx-auto w-full mt-6">
            <Form {...form}>
                <form className="mx-4 space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-semibold">Nome do Paciente</FormLabel>
                            <FormControl>
                            <Input id="name" placeholder="digite seu nome completo"
                            {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                     <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-semibold">Email do Paciente</FormLabel>
                            <FormControl>
                            <Input id="email" placeholder="digite seu email"
                            {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                     <FormField control={form.control} name="phone" render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-semibold">Telefone</FormLabel>
                            <FormControl>
                            <Input id="phone" placeholder="(XX) XXXXX-XXXX)"
                            {...field} onChange={(e) => {
                                const formattedValue = formatPhone(e.target.value);
                                field.onChange(formattedValue);
                            }} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>


                     <FormField control={form.control} name="date" render={({field}) => (
                        <FormItem className="flex items-center gap-2 space-y-1">
                            <FormLabel className="font-semibold">Data do Agendamento</FormLabel>
                            <FormControl >
                            <DateTimePicker
                            initialDate={new Date()}
                            className="w-full rounded borde p-3"
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
                        <FormItem className="my-2">
                            <FormLabel className="font-semibold">Selecione o Serviço a ser Realizado</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='selecione um dos serviços'/>
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


                    
                </form>
            </Form>
            </section>
        </div>
    )
}