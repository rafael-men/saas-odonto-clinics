import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export const GET = auth(async function GET(request) {
    if(!request.auth) {
        return NextResponse.json({error: "Acesso Não Autorizado"}, {status: 401});
    }

    const searchParams = request.nextUrl.searchParams;
    const dataString = searchParams.get("data") as string; 
    const clinicId = request.auth?.user?.id

    if(!dataString) {
        return NextResponse.json({error: "Data não fornecida"}, {status: 400});
    }
    if(!clinicId) {
        return NextResponse.json({error: "Clinica não encontrada"}, {status: 400});
    
    }

    try{
        const [year,month,day] = dataString.split("-").map(Number);
        const startDate = new Date(year, month - 1, day,0,0,0,0);
        const endDate = new Date(year, month - 1, day,23,59,59,999);

        const appointments = await prisma.appointments.findMany({
            where: {
                userId: clinicId,
                AppointmentDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include : {
                service: true,
            }
        })

        return NextResponse.json(appointments);
    }
    catch(e) {
        return NextResponse.json({error: "Erro ao buscar agendamentos"}, {status: 500});
    }
})