'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@/generated/prisma/client"
import { Plus, Trash } from "lucide-react";
import { DeleteReminder } from "../dashboard/_actions/delete-reminder";
import { useToast } from "@/components/toast-provider";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReminderList from "./reminder-list";


interface ReminderContentProps {
    reminder: Reminder[];
}

export function ReminderContent({reminder} : ReminderContentProps) {
    const { addToast } = useToast();
    const [deleting, setDeleting] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDeleteRem = async (id:string) => {
        setDeleting(id);
        try {
            const response = await DeleteReminder({reminderId: id});
            if (response.error) {
                addToast(response.error, 'error');
            } else {
                addToast('Lembrete deletado com sucesso!', 'success');
            }
        } catch (error) {
            addToast('Erro ao deletar lembrete', 'error');
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-bold text-xl md:text-2xl ">
                        Lembretes
                    </CardTitle>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant='ghost' size='sm' className="w-9 p-0">
                                <Plus className="w-5 h-5"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Lembrete</DialogTitle>
                            </DialogHeader>
                            <ReminderList onSuccess={() => setDialogOpen(false)}/>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {reminder.length === 0 && (<p className="text-sm text-gray-500">Nenhum lembrete encontrado.</p>)}
                    <ScrollArea className="h-[340px] lg:max-h[calc(100vh-15rem)] pr-0 w-full flex-1">
                    {reminder.map((item => (
                        <article key={item.id} className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-300 mb-2 px-2 rounded-xl">
                            <p className="text-sm font-medium md:text-base">{item.description}</p>
                            <Button onClick={() => handleDeleteRem(item.id)} disabled={deleting === item.id} className=" bg-red-600 shadow-none rounded-full p-2" size='sm'>
                                <Trash className="w-4 h-4 text-white"/>
                            </Button>
                        </article>
                    )))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}