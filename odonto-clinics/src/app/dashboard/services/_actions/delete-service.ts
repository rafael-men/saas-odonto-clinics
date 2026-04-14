'use server';

import z from "zod";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    serviceId: z.string().min(1, {message: "ID do serviço é obrigatório"})
})

type FormSchemaType = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchemaType) {

    const session = await auth();

    if(!session?.user?.id) {
        return { success: false, error: "Erro ao deletar serviço" };
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success) {
        return { success: false, error: "Dados inválidos" };
    }

    try {
        const service = await prisma.service.update({
            where: {
                id: formData.serviceId,
                userId: session.user.id
            },
            data: {
                status: false
            }
        })

        revalidatePath('/dashboard/services');

        return {
            success: true,
            message: `Serviço "${service.name}" deletado com sucesso!`,
            data: service
        }
    }
    catch {
        return {
            success: false,
            error: "Erro ao deletar serviço. Tente novamente."
        }
    }

}