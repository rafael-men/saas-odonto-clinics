import { getReminders } from "../dashboard/_dal/reminders";
import { ReminderContent } from "./reminder-content";



export async function Reminder({userId} : {userId
    
    : string}) {

    const reminders = await getReminders({userId: userId});
    return (
        <div className="flex flex-col gap-3">
            <ReminderContent reminder={reminders}/>
        </div>
    )
}