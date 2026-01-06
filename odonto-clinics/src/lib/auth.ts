import NextAuth from "next-auth";
import prisma from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter:PrismaAdapter(prisma),
    trustHost: true,
  providers: [],
})