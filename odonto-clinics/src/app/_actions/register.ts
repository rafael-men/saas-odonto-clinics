'use server'

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { error: "Email já cadastrado" };
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { email, password: hashed, name },
    });

    return { success: true };
}
