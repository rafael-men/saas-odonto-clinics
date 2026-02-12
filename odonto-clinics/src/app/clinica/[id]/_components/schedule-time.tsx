'use client'

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-cont"
import { cn } from "@/lib/utils";

interface ScheduleTimeProps {
    selectedDate: Date,
    selectedTime: string,
    requiredSlots: number,
    blockedTimes: string[],
    avTimeSlots: TimeSlot[],
    clinicaTimes: string[];
    onSelectedTime: (time: string) => void;
}

export function ScheduleTime({selectedDate, selectedTime, requiredSlots, blockedTimes, avTimeSlots, clinicaTimes, onSelectedTime} : ScheduleTimeProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            {avTimeSlots.map((slot) => {
                return (
                    <Button onClick={() => onSelectedTime(slot.time)} type="button" className={cn("bg-slate-50 h-10 selected-none text-black",selectedTime == slot.time && "border-2 border-blue-600")} key={slot.time}>
                        {slot.time}
                    </Button>
                )
            })}
        </div>
    )
}