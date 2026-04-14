'use server'

import prisma from "@/lib/prisma";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
        const startOfDay = new Date(year, month, day, 0, 0, 0, 0)
        const endOfDay = new Date(year, month, day, 23, 59, 59, 999)

        const user = await prisma.user.findFirst({
            where: { id: FormData.clinicaId }
        })

        if (!user) {
            return { error: "Clínica não encontrada" }
        }

        const existingAppointments = await prisma.appointments.findMany({
            where: {
                userId: FormData.clinicaId,
                AppointmentDate: { gte: startOfDay, lte: endOfDay }
            },
            include: { service: true }
        })

        const service = await prisma.service.findFirst({
            where: { id: FormData.serviceId }
        })

        if (!service) {
            return { error: "Serviço não encontrado" }
        }

        function timeToMinutes(time: string): number {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        }

        const newStartMin = timeToMinutes(FormData.time);
        const newEndMin = newStartMin + service.duration;

        for (const apt of existingAppointments) {
            const aptStartMin = timeToMinutes(apt.time);
            const aptEndMin = aptStartMin + apt.service.duration;

            if (newStartMin < aptEndMin && newEndMin > aptStartMin) {
                return { error: `Conflito com agendamento existente às ${apt.time}` }
            }
        }

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

        sendAppointmentConfirmationEmail({
            patientName: FormData.name,
            patientEmail: FormData.email,
            clinicName: user.name || 'Clínica',
            serviceName: service.name,
            date: format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
            time: FormData.time,
            paymentForm: FormData.paymentForm,
            appointmentId: appointment.id,
        });

        return {
            data: appointment
        }

    }

    catch(err) {
        return { error: "Erro ao criar agendamento" }
    }
}
