'use client'

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
interface AgendaListProps {
    times: string[]
}

export function AgendaList({times}: AgendaListProps) {
    const searchParams = useSearchParams();
    const date = searchParams.get('date');
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Agendamentos
            </CardTitle>
            <button>DATA</button>
            <CardHeader/>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-13rem)] lg:h-[calc(100vh-15rem)] pr-4">
                    {times.map((slot)=> {
                        return (
                            <div key={slot} className="flex items-center py-2 border-t last:border-b">
                            <div className="w-16 tex-sm font-semibold">
                                {slot}
                            </div>
                            <div className="flex-1 text-sm text-gray-500">
                                Disponível
                            </div>
                        </div>
                        )
                    })}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}