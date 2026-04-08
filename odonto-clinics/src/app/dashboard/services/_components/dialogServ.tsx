'use client';

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogServFormData, useDialogServForm } from "./dialogServForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { currencyConverter } from '@/utils/currencyConverter';
import { createService } from "../_actions/createService";
import { updateService } from "../_actions/updateService";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { Professional } from "@/generated/prisma/client";

interface DialogServProps {
    onSuccess?: () => void;
    serviceId?: string | null;
    professionals: Professional[];
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
        professionalId?: string;
    };
}

export function DialogServ({ onSuccess, serviceId, professionals, initialValues }: DialogServProps) {
    const form = useDialogServForm({ initialValues });
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!serviceId;

    async function onsubmit(values: DialogServFormData) {
        setIsLoading(true);
        const priceinCents = currencyConverter(values.price);
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;
        const totalDur = (hours * 60) + minutes;

        try {
            let response;
            if (isEditing && serviceId) {
                response = await updateService({
                    serviceId,
                    name: values.name,
                    price: priceinCents,
                    duration: totalDur,
                    professionalId: values.professionalId || undefined,
                });
            } else {
                response = await createService({
                    name: values.name,
                    price: priceinCents,
                    duration: totalDur,
                    professionalId: values.professionalId || undefined,
                });
            }

            if (response.success) {
                addToast(response.message || (isEditing ? 'Serviço atualizado!' : 'Serviço adicionado!'), 'success');
                if (!isEditing) form.reset();
                setTimeout(() => onSuccess?.(), 1500);
            } else {
                addToast(response.error || 'Erro ao salvar serviço', 'error');
            }
        } catch {
            addToast('Erro inesperado. Tente novamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    function ChangeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
        let { value } = event.target;
        value = value.replace(/\D/g, '');
        if (value) {
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        event.target.value = value;
        form.setValue('price', value);
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{isEditing ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                <DialogDescription>
                    {isEditing ? 'Altere as informações do serviço' : 'Adicione um serviço realizado pela clínica'}
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form className="space-y-3" onSubmit={form.handleSubmit(onsubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Nome do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Consulta" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Valor do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 120,00" {...field} onChange={ChangeCurrency} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="professionalId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Profissional Responsável</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Nenhum profissional</option>
                                        {professionals.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {p.crm}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p className="font-semibold text-sm">Tempo Estimado de Duração</p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Horas</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1" min="0" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Minutos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="30" min="0" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full font-semibold bg-black text-white" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEditing ? 'Salvando...' : 'Adicionando...'}</>
                        ) : (
                            isEditing ? 'Salvar Alterações' : 'Adicionar Serviço'
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
}
