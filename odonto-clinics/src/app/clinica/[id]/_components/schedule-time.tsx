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
                    <Button
                        onClick={() => onSelectedTime(slot.time)}
                        type="button"
                        disabled={!slot.available}
                        className={cn(
                            "h-10 select-none",
                            slot.available
                                ? "bg-slate-50 text-black hover:bg-slate-100"
                                : "bg-gray-200 text-gray-400 line-through cursor-not-allowed",
                            selectedTime === slot.time && slot.available && "border-2 border-blue-600"
                        )}
                        key={slot.time}
                    >
                        {slot.time}
                    </Button>
                )
            })}
        </div>
    )
}