import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { date } from "zod";
import { error } from "console";


export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const userId = searchParams.get('userId');
    const dateParam = searchParams.get('date');

    if(!userId || userId === 'null' || !dateParam || dateParam === 'null') {
        return NextResponse.json({
            error: 'Nenhum agendamento encontrado'
        },{
            status: 400
        })
    }

    try {
        const [year, month, day] = dateParam.split('-').map(Number);
        const start = new Date(year, month - 1, day, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59,999);

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        }
        )

        if(!user) {
        return NextResponse.json({
            error: 'Nenhum agendamento encontrado'
        },{
            status: 400
        })
     }

        const appointments = await prisma.appointments.findMany({
            where: {
                userId: userId,
                AppointmentDate: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                service: true,
            }
        })

        const blockedSlots = new Set<string>();
        for (const apt of appointments) {
            const requiredSlot = Math.ceil(apt.service.duration / 30);
            const startIndex = user.times.indexOf(apt.time);

            if(startIndex !== -1) {
                for(let i = 0; i < requiredSlot; i++) {
                    const blocked = user.times[startIndex + 1];
                    if(blocked) {
                        blockedSlots.add(blocked);
                    }
                }
            }
        }

        const blockedTimes = Array.from(blockedSlots);

        return NextResponse.json(blockedTimes);


    }
    catch (err) {
        console.log(err);
        return NextResponse.json({
            error: 'Nenhum agendamento encontrado'
        },{
            status: 400
        })
    }
}