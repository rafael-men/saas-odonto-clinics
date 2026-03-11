'use server';

import prisma from "@/lib/prisma";
import { error } from "console";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    reminderId: z.string().min(1, "O ID do lembrete é obrigatório"),
})

type FormData = z.infer<typeof formSchema>;

export  async function DeleteReminder(form: FormData) {
    const schema = formSchema.safeParse(form);

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    try {
        await prisma.reminder.delete({
            where: {
                id: form.reminderId
            }
        })

        revalidatePath('/dashboard');
        return { success: true };
    }
    catch(e) {
        return {
            error: 'não foi possível deletar o lembrete.'
        };
    }
}