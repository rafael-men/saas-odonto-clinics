

import { redirect } from "next/navigation"
import { getInfoSchedule } from "./_DAL/get-schedule"
import { ScheduleContent } from "./_components/schedule-cont"
import { getPatientSession } from "@/app/paciente/_actions/auth"

export default async function SchedulePage({params,}: {params: Promise<{id:string}>}) {
    const userId = (await params).id
    const [user, patient] = await Promise.all([
        getInfoSchedule({userId: userId}),
        getPatientSession(),
    ]);

    if(!user) {
        redirect('/');
    }

    return (
        <ScheduleContent clinica={user} patient={patient} />
    )
}