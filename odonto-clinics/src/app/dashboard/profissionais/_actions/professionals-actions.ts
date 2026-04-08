'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProfessionalsByUser(userId: string) {
    return prisma.professional.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createProfessional(data: {
    name: string;
    crm: string;
    phone: string;
    whatsapp: string;
    photo?: string;
    userId: string;
}) {
    await prisma.professional.create({ data });
    revalidatePath('/dashboard/profissionais');
}

export async function updateProfessional(id: string, data: {
    name: string;
    crm: string;
    phone: string;
    whatsapp: string;
    photo?: string;
}) {
    await prisma.professional.update({ where: { id }, data });
    revalidatePath('/dashboard/profissionais');
}

export async function deleteProfessional(id: string) {
    await prisma.professional.delete({ where: { id } });
    revalidatePath('/dashboard/profissionais');
}
