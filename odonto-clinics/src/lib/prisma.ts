import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
let prisma: PrismaClient;
const adapter = new PrismaPg({connectionString})

if(process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
        adapter
    })
} 
else {
    let globalPrisma = global as typeof globalThis & {
        prisma: PrismaClient
    }

    if(!globalPrisma.prisma) {
        globalPrisma.prisma = new PrismaClient({adapter});
    }

    prisma = globalPrisma.prisma
}

export default prisma;