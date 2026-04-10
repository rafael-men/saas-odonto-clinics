'use server'

import prisma from "@/lib/prisma";
import { use } from "react";

export async function getInfoSchedule({userId}:{userId: string}) {
    try {
        if(!userId) {
            return null;
        }
        else {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                },
                include: {
                    services: {
                        where: {
                            status: true
                        },
                        include: {
                            professional: true
                        }
                    }
                }
            })

            if(!user) {
                return null;
            }

            return user;
        }
    }
    catch(err) {
        throw err;
    }
}