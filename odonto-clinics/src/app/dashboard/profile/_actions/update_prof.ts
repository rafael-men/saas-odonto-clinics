'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message:'Nome Obrigatório'}),
    address: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    timeZone: z.string().min(1, {message:'Fuso Horário Obrigatório'}),
    times: z.array(z.string()),
});

type FormSchemaType = z.infer<typeof formSchema>;

export async function updateProfile(data: FormSchemaType) {
    const session = await auth();


    if (!session?.user?.id) {
        return { error: 'Usuário não identificado' };
    }

    const schema = formSchema.safeParse(data);

    

    if (!schema.success) {
        return { error: 'Preencha os campos corretamente', details: schema.error?.issues };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: schema.data.name,
                address: schema.data.address,
                phone: schema.data.phone,
                cpf: schema.data.cpf,
                timeZone: schema.data.timeZone,
                times: schema.data.times,
            }
        });

        return { success: true , message: 'Clinica atualizada com sucesso!'};
    } catch {
        return { error: 'Erro ao atualizar perfil' };
    }
}