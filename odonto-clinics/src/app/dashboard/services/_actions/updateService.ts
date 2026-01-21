'use server';

import z from "zod";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    serviceId: z.string().min(1, {message: "ID do serviço é obrigatório"}),
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.number().min(1, {message: "O valor do serviço é obrigatório"}),
    duration: z.number()
})

type FormSchemaType = z.infer<typeof formSchema>;

export async function updateService(formData: FormSchemaType) {
    const session = await auth();

    if(!session?.user?.id) {
        return { success: false, error: "Usuário não autenticado" };
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success) {
        return { success: false, error: "Dados inválidos" };
    }

    try {
        const service = await prisma.service.update({
            where: {
                id: schema.data.serviceId,
                userId: session.user.id
            },
            data: {
                name: schema.data.name,
                price: schema.data.price,
                duration: schema.data.duration
            }
        })

        revalidatePath('/dashboard/services');

        return {
            success: true,
            message: `Serviço "${service.name}" atualizado com sucesso!`,
            data: service
        }
    }
    catch (err) {
        console.error("Erro ao atualizar serviço:", err);
        return {
            success: false,
            error: "Erro ao atualizar serviço. Tente novamente."
        }
    }
}
