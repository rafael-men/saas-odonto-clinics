

import { redirect } from "next/navigation"
import { getInfoSchedule } from "./_DAL/get-schedule"
import { ScheduleContent } from "./_components/schedule-cont"


export default async function SchedulePage({params,}: {params: Promise<{id:string}>}) {
    const userId = (await params).id
    const user = await getInfoSchedule({userId: userId})

    if(!user) {
        redirect('/');
    }

    return (
        <ScheduleContent clinica={user}/>
    )
}