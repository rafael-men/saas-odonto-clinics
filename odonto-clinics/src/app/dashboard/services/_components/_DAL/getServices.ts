'use server'

import prisma from "@/lib/prisma";

export async function getServices({userId}: {userId: string}) {
    if(!userId) {
        throw new Error('Falha ao Buscar Serviços.');
    }

    try {

        const services = await prisma.service.findMany({
            where: {
                userId: userId,
                status: true
            },
            include: {
                professional: true,
            }
        })

            return {
                data: services
            }
    }
    catch {
        throw new Error('Erro ao Buscar Serviços.');
    }
}