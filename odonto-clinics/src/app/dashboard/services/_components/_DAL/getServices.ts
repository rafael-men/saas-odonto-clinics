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
                status:true
            }
        })

            return {
                data: services
            }
    }
    catch (err) {
        console.log(err);
        throw new Error('Erro ao Buscar Serviços.');
    }
}