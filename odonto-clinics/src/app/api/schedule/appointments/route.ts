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

        function timeToMinutes(time: string): number {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        }

        const blockedSlots = new Set<string>();
        for (const apt of appointments) {
            const aptStartMin = timeToMinutes(apt.time);
            const aptEndMin = aptStartMin + apt.service.duration;

            for (const time of user.times) {
                const slotMin = timeToMinutes(time);
                if (slotMin >= aptStartMin && slotMin < aptEndMin) {
                    blockedSlots.add(time);
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