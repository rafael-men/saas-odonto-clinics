'use server'

import prisma from "@/lib/prisma";

export async function getAgenda({userId} : {userId: string}) {
    if(!userId) {
        return {
            times: []
        }
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id:true,
                times: true
            }
        })

        if(!user) {
            return {
                times: [],
                userId: ''
            }
        }
        else {
            return {
                times: user.times,
                userId: user.id
            }
        }
    }
    catch(e) {
        return {
            times: [],
            userId: ''
        }
    }
}