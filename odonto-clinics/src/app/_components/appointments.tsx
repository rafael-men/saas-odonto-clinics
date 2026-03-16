import { getAgenda } from "../dashboard/_dal/agenda";
import { AgendaList } from "./agenda-list";



export default async function Appointments({userId}: {userId: string}) {
    const {times } = await getAgenda({userId: userId});
    return (
        <AgendaList times={times}/>
    )
}