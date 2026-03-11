'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { createReminder } from "../dashboard/_actions/create-reminder";
import { useToast } from "@/components/toast-provider";

interface ReminderListProps {
    onSuccess?: () => void;
}

export default function ReminderList({ onSuccess }: ReminderListProps) {
    const { addToast } = useToast();
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!description.trim()) return;

        setIsLoading(true);
        const res = await createReminder(description);
        setIsLoading(false);

        if (res.error) {
            addToast(res.error, 'error');
        } else {
            addToast('Lembrete criado!', 'success');
            setDescription('');
            onSuccess?.();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <Input
                placeholder="Ex: Ligar para paciente amanhã às 10h"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading || !description.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </Button>
        </form>
    );
}
