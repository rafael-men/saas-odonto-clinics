'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateProfileImage(base64Image: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: 'Usuário não identificado' };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: base64Image },
        });

        return { success: true };
    } catch {
        return { error: 'Erro ao atualizar imagem' };
    }
}
