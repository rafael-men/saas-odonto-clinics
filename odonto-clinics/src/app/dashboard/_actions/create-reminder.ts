'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReminder(description: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Não autorizado' };

    if (!description?.trim()) return { error: 'Descrição obrigatória' };

    try {
        await prisma.reminder.create({
            data: {
                description: description.trim(),
                userId: session.user.id,
            },
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch {
        return { error: 'Erro ao criar lembrete' };
    }
}
