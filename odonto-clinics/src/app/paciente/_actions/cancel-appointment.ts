'use server'

import prisma from "@/lib/prisma";
import { sendCancellationEmail } from "@/lib/email";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getPatientSession } from "./auth";

export async function cancelAppointment(appointmentId: string) {
    const patient = await getPatientSession();
    if (!patient) {
        return { error: "Você precisa estar logado." };
    }

    const appointment = await prisma.appointments.findFirst({
        where: { id: appointmentId, email: patient.email },
        include: { service: true, user: true },
    });

    if (!appointment) {
        return { error: "Consulta não encontrada." };
    }

    if (appointment.status === 'cancelled') {
        return { error: "Esta consulta já foi cancelada." };
    }

    const [h, m] = appointment.time.split(':').map(Number);
    const date = appointment.AppointmentDate;
    const appointmentDateTime = new Date(
        date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h, m, 0, 0
    );

    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes < 30) {
        return { error: "Só é possível cancelar com pelo menos 30 minutos de antecedência." };
    }

    await prisma.appointments.update({
        where: { id: appointmentId },
        data: { status: 'cancelled' },
    });

    sendCancellationEmail({
        patientName: appointment.name,
        patientEmail: appointment.email,
        clinicName: appointment.user?.name || 'Clínica',
        serviceName: appointment.service?.name || 'Serviço',
        date: format(appointment.AppointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
        time: appointment.time,
    });

    return { success: true };
}
