'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@/generated/prisma/client"
import { Plus, Trash } from "lucide-react";

interface ReminderContentProps {
    reminder: Reminder[];
}

export function ReminderContent({reminder} : ReminderContentProps) {
    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-bold text-xl md:text-2xl ">
                        Lembretes
                    </CardTitle>
                    <Button className="w-9 p-0" variant='ghost' size='sm'>
                        <Plus className="w-4 h-4"/>
                    </Button>
                </CardHeader>
                <CardContent>
                    {reminder.length === 0 && (<p className="text-sm text-gray-500">Nenhum lembrete encontrado.</p>)}
                    <ScrollArea className="h-[340px] lg:max-h[calc(100vh-15rem)]">
                    {reminder.map((item => (
                        <article className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-300 mb-2 px-2 rounded-xl">
                            <p className="text-sm font-medium md:text-base">{item.description}</p>
                            <Button>
                                <Trash className="w-4 h-4 text-white bg-red-600 shadow-none rounded-full p-2" size='sm'/>
                            </Button>
                        </article>
                    )))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}