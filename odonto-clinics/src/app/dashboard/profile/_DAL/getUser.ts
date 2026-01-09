'use server'

import prisma from "@/lib/prisma"

interface getUserProps {
    userId: string;
}

export default async function getUser({userId}: getUserProps) {
    try {
        if(!userId) {
            return null;
        }
        const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
      })

      if(!user) {
        return null;
      }
      else {
        return user;    
      }
    }
    catch (error) {
        console.log("Usuário não Encontrado:", error)
        return null
    }
}