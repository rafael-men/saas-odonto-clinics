import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }
}

interface User {
    id: string;
    name: string;
    email: string;
    emailVerfied?: null | string | boolean;
    image?: string;
    address?: string;
    phone?: string;
    cpf?: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}