'use server'

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerPatient(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
}) {
    const existing = await prisma.patient.findUnique({ where: { email: data.email } });
    if (existing) return { error: "Email já cadastrado." };

    const hashed = await bcrypt.hash(data.password, 10);
    const patient = await prisma.patient.create({
        data: { name: data.name, email: data.email, phone: data.phone, password: hashed },
    });

    const cookieStore = await cookies();
    cookieStore.set("patient_session", patient.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
    });

    return { success: true };
}

export async function loginPatient(data: { email: string; password: string }) {
    const patient = await prisma.patient.findUnique({ where: { email: data.email } });
    if (!patient) return { error: "Email ou senha inválidos." };

    const valid = await bcrypt.compare(data.password, patient.password);
    if (!valid) return { error: "Email ou senha inválidos." };

    const cookieStore = await cookies();
    cookieStore.set("patient_session", patient.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
    });

    return { success: true };
}

export async function logoutPatient() {
    const cookieStore = await cookies();
    cookieStore.delete("patient_session");
    redirect("/paciente/login");
}

export async function getPatientSession() {
    const cookieStore = await cookies();
    const id = cookieStore.get("patient_session")?.value;
    if (!id) return null;
    return prisma.patient.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, phone: true },
    });
}
