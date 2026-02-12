'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"


export const AppointmentSchema = z.object({
    name: z.string().min(1, 'O nome do paciente é obrigatório'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(1, 'O telefone é obrigatório'),
    date: z.date(),
    serviceId: z.string().min(1, 'O serviço é obrigatório'),
    paymentForm: z.string().min(1, 'A forma de pagamento é obrigatória'),
})

export type AppointmentFormData = z.infer<typeof AppointmentSchema>;

export function ScheduleForm() {
    return useForm<AppointmentFormData>({
        resolver: zodResolver(AppointmentSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            date: new Date(),
            serviceId: '',
            paymentForm: '',
        }
    })
}