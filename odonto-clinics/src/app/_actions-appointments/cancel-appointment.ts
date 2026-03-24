'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {z} from "zod"

const formSchema = z.object({
    appointmentId: z.string().min(3, "Forneça um agendamento válido"),
})

type FormSchema = z.infer<typeof formSchema>;

export async function cancelAppointment(formData: FormSchema) {
    const schema = formSchema.safeParse(formData);

    if(!schema.success) {
        return {
            error: schema.error.issues[0]?.message
        }
    }

    const session = await auth();

    if(!session?.user?.id) {
        return {
            error: "Usuário não autenticado"
        }
    }

    try {
        await prisma.appointments.delete({
            where: {
                id: formData.appointmentId,
                userId: session.user?.id
            }
        })
    }
    catch (error) {
        return {
            error: "Erro ao cancelar o agendamento"
        }
    }
}