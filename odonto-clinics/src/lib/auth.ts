import NextAuth from "next-auth";
import prisma from './prisma';
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password as string, user.password);
                if (!isValid) return null;

                return { id: user.id, name: user.name, email: user.email, image: user.image };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Para Google: cria ou atualiza o usuário no banco manualmente
            if (account?.provider === "google" && user.email) {
                const existing = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existing) {
                    const created = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        },
                    });
                    user.id = created.id;
                } else {
                    user.id = existing.id;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user?.id) {
                token.sub = user.id;
            }
            if (account?.provider === "google" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });
                if (dbUser) token.sub = dbUser.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
})
