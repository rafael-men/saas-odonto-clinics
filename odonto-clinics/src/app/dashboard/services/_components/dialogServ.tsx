'use client';

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDialogServForm } from "./dialogServForm";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DialogServ() {
    const form = useDialogServForm();
    return (
        <>
        <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
            <DialogDescription>Adicione um Serviço Realizado pela Clínica</DialogDescription>
        </DialogHeader>


         <Form {...form}>
            <form className="space-y-2">
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
                                    <Input placeholder="Ex: 120,00" {...field}/>
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
                <Button type="submit" className="w-full font-semibold bg-black text-white">
                    Adicionar o Serviço
                </Button>
            </form>
        </Form>
        </>
    )
}