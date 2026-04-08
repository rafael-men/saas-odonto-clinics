'use server';

import z from "zod";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.number().min(1, {message: "O valor do serviço é obrigatório"}),
    duration: z.number(),
    professionalId: z.string().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>;

export async function createService(formData: FormSchemaType) {
    const session = await auth();

    if(!session?.user?.id) {
        return { success: false, error: "Usuário não autenticado" };
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success) {
        return { success: false, error: "Dados inválidos" };
    }

    try {
        const service = await prisma.service.create({
            data: {
                name: schema.data.name,
                price: schema.data.price,
                duration: schema.data.duration,
                userId: session.user.id,
                professionalId: schema.data.professionalId || null,
            }
        })

        revalidatePath('/dashboard/services');

        return {
            success: true,
            message: `Serviço "${service.name}" adicionado com sucesso!`,
            data: service
        }
    }
    catch (err) {
        console.error("Erro ao criar serviço:", err);
        return {
            success: false,
            error: "Erro ao criar serviço. Tente novamente."
        }
    }
}