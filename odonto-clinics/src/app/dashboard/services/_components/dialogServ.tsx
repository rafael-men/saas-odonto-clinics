'use client';

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogServFormData, useDialogServForm } from "./dialogServForm";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { currencyConverter } from '@/utils/currencyConverter';
import { createService } from "../_actions/createService";
import { updateService } from "../_actions/updateService";
import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogServProps {
    onSuccess?: () => void;
    serviceId?: string | null;
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
    };
}

export function DialogServ({ onSuccess, serviceId, initialValues }: DialogServProps) {
    const form = useDialogServForm({initialValues});
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const isEditing = !!serviceId;

    async function onsubmit(values: DialogServFormData) {
        setIsLoading(true);
        setFeedback(null);

        const priceinCents = currencyConverter(values.price);
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;
        const totalDur = (hours * 60) + minutes;

        try {
            let response;

            if (isEditing && serviceId) {
                response = await updateService({
                    serviceId: serviceId,
                    name: values.name,
                    price: priceinCents,
                    duration: totalDur
                });
            } else {
                response = await createService({
                    name: values.name,
                    price: priceinCents,
                    duration: totalDur
                });
            }

            if (response.success) {
                setFeedback({
                    type: 'success',
                    message: response.message || (isEditing ? 'Serviço atualizado!' : 'Serviço adicionado!')
                });
                if (!isEditing) form.reset();
                setTimeout(() => {
                    onSuccess?.();
                }, 1500);
            } else {
                setFeedback({
                    type: 'error',
                    message: response.error || (isEditing ? 'Erro ao atualizar serviço' : 'Erro ao adicionar serviço')
                });
            }
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro inesperado. Tente novamente.' });
        } finally {
            setIsLoading(false);
        }
    }

    function ChangeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
        let { value } = event.target;
        value = value.replace(/\D/g, '');
        if(value) {
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
                {isEditing ? 'Altere as informações do serviço' : 'Adicione um Serviço Realizado pela Clínica'}
            </DialogDescription>
        </DialogHeader>


         <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onsubmit)}>
                <div className="flex flex-col">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field})=> (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Nome do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Consulta" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="price"
                        render={({field})=> (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Valor do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 120,00" {...field}  onChange={ChangeCurrency}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                </div>
                <p className="font-semibold">
                    Tempo Estimado de Duração
                </p>
                <div className="grid, grid-cols-2 gap-3">
                     <FormField
                        control={form.control}
                        name="hours"
                        render={({field})=> (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Horas: </FormLabel>
                                <FormControl>
                                    <Input placeholder="1"  min='0' type="number" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="minutes"
                        render={({field})=> (
                            <FormItem className="my-2">
                                <FormLabel className="font-semibold">Minutos: </FormLabel>
                                <FormControl>
                                    <Input placeholder="1"  min='0' type="number" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                </div>
                {feedback && (
                    <div className={cn(
                        "flex items-center gap-2 p-3 rounded-lg text-sm",
                        feedback.type === 'success'
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    )}>
                        {feedback.type === 'success'
                            ? <CheckCircle2 className="w-4 h-4" />
                            : <XCircle className="w-4 h-4" />
                        }
                        <span>{feedback.message}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full font-semibold bg-black text-white"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isEditing ? 'Salvando...' : 'Adicionando...'}
                        </>
                    ) : (
                        isEditing ? 'Salvar Alterações' : 'Adicionar o Serviço'
                    )}
                </Button>
            </form>
        </Form>
        </>
    )
}