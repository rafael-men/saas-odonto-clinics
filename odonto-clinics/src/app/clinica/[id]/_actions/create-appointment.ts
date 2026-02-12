'use server'

import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateAppointmentSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    date: z.string().min(1, "A data é obrigatória"),
    time: z.string().min(1, "O horário é obrigatório"),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
    clinicaId: z.string().min(1, "A clínica é obrigatória"),
    paymentForm: z.string().min(1, "A forma de pagamento é obrigatória"),
})


type FormSchema = z.infer<typeof CreateAppointmentSchema>

export async function createAppointment(FormData: FormSchema) {
    const schema = CreateAppointmentSchema.safeParse(FormData)

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    try {
        const selectedDate = new Date(FormData.date)
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        const appointmentDate = new Date(year, month, day, 0, 0, 0, 0)

        const appointment = await prisma.appointments.create({
            data: {
                name: FormData.name,
                email: FormData.email,
                phone: FormData.phone,
                AppointmentDate: appointmentDate,
                time: FormData.time,
                serviceId: FormData.serviceId,
                userId: FormData.clinicaId,
                paymentForm: FormData.paymentForm
            }
        })

        return {
            data: appointment
        }

    }

    catch(err) {
        return { error: "Erro ao criar agendamento" }
    }
}
