'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Image from "next/image";
import Foto from  '../../../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { updateProfile } from "../_actions/update_prof";

type User = Prisma.UserGetPayload<{}>;


const profileSchema = z.object({
    name: z.string()
        .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
        .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
    address: z.string().optional(),
    phone: z.string()
        .optional()
        .refine((val) => !val || val.replace(/\D/g, '').length >= 10, {
            message: 'Telefone deve ter pelo menos 10 dígitos'
        }),
    cpf: z.string()
        .optional()
        .refine((val) => !val || val.replace(/\D/g, '').length === 14, {
            message: 'CNPJ deve ter 14 dígitos'
        }),
    status: z.string(),
    timeZone: z.string().min(1, { message: 'Selecione um fuso horário' }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileContentProps {
    user: User;
}

export default function ProfileContent({user}: ProfileContentProps) {
    const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || '',
            address: user.address || '',
            phone: user.phone || '',
            cpf: user.cpf || '',
            status: user.status ? 'active' : 'inactive',
            timeZone: user.timeZone || ''
        }
    });


    function generateTimeSlots() {
        const hours: string[] = [];

        for (let i = 7;i<=24;i++) {
           for(let j=0;j<2;j++) {
            const hour = i.toString().padStart(2,'0');
            const minute = (j*30).toString().padStart(2,'0');
            hours.push(`${hour}:${minute}`);
           }
        }

        return hours;
    }

    

    const hours = generateTimeSlots();

     function toggleHour(hour: string) {
        setSelectedHours((prevHours) => 
            prevHours.includes(hour) ? prevHours.filter(h => h !== hour) : [...prevHours, hour].sort())
    }

    const timeZones = Intl.supportedValuesOf('timeZone').filter((zone) =>
        zone.startsWith('America/Sao_Paulo') || zone.startsWith('America/Fortaleza') || zone.startsWith('America/Cuiaba') || zone.startsWith('America/Recife') || zone.startsWith('America/Manaus') || zone.startsWith('America/Rio_Branco')
    )

    function formatCNPJ(value: string){
        const numbers = value.replace(/\D/g, '').slice(0,14);
        return numbers
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 10) {
        return numbers
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        return numbers
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }
}

    async function onSubmit(values: ProfileFormData) {
        setIsLoading(true);
        setFeedback(null);

        try {
            const response = await updateProfile({
                name: values.name,
                address: values.address,
                phone: values.phone,
                cpf: values.cpf,
                status: values.status === 'active' ? true : false,
                timeZone: values.timeZone,
                times: selectedHours || []
            });

            if (response.error) {
                setFeedback({ type: 'error', message: response.error });
            } else {
                setFeedback({ type: 'success', message: response.message || 'Perfil atualizado com sucesso!' });
            }
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro inesperado. Tente novamente.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    }

    return (
        <div className="mx-auto ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 ">
                            <div className="flex justify-center">
                                <div className="relative h-40 w-40">
                                    <Image src={user.image ? user.image : Foto} alt="foto da clinica" fill className="object-cover rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FormField control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Nome</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Insira o nome da Clínica"  />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>    
                                    )}
                                />
                                <FormField control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Endereço</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Insira seu Endereço"  />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>    
                                    )}
                                />
                                 <FormField control={form.control}
                                    name="cpf"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">CNPJ</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Insira o CNPJ da clínica" onChange={(e) => field.onChange(formatCNPJ(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>    
                                    )}
                                />
                                <FormField control={form.control}
                                    name="phone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Telefone</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Insira seu Telefone" onChange={(e)=> field.onChange(formatPhone(e.target.value)) } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>    
                                    )}
                                />
                                 <FormField control={form.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Status</FormLabel>
                                            <FormControl>
                                                <Select  onValueChange={field.onChange} defaultValue={field.value ? 'active' : 'inactive'}>
                                                    <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o Status Atual" {...field} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Ativo - Clínica Aberta</SelectItem>
                                                    <SelectItem value="inactive">Inativo - Clínica Fechada</SelectItem>
                                                </SelectContent>  
                                                </Select>                                          
                                            </FormControl>
                                        </FormItem>    
                                    )}
                                />
                                <div className="space-y-2 bg-white ">
                                    <Label className="font-semibold">Horários de funcionamento da Clínica</Label>
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}> 
                                        <DialogTrigger asChild>
                                            <Button variant='outline' className="w-full justify-between">
                                                Selecionar Horários
                                                <ArrowRight className="w-5 h-5"/>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Horários Disponíveis
                                                </DialogTitle>
                                            </DialogHeader>
                                            <section className="py-4">
                                                <p className="text-sm text-muted-foreground mb-2">clique nos horários abaixos para marcar ou desmarcar</p>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {hours.map((hour) => (
                                                        <Button type="button" key={hour} variant="outline" className={cn('border-2',selectedHours.includes(hour) && 'border-blue-600')} onClick={()=> toggleHour(hour)}>
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </section>
                                            <Button className="2-full bg-blue-600 text-white" type="button" onClick={()=> setDialogOpen(false)} >Fechar</Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <FormField control={form.control}
                                    name="timeZone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Fuso Horário</FormLabel>
                                            <FormControl>
                                                <Select  onValueChange={field.onChange} defaultValue={field.value ? 'active' : 'inactive'}>
                                                    <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o fuso horário" {...field} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeZones.map((zone) => (
                                                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                                    ))}
                                                </SelectContent>  
                                                </Select>                                          
                                            </FormControl>
                                        </FormItem>    
                                    )}
                                />

                                {/* Feedback de sucesso ou erro */}
                                {feedback && (
                                    <div className={cn(
                                        "flex items-center gap-2 p-4 rounded-lg",
                                        feedback.type === 'success'
                                            ? "bg-green-50 text-green-800 border border-green-200"
                                            : "bg-red-50 text-red-800 border border-red-200"
                                    )}>
                                        {feedback.type === 'success'
                                            ? <CheckCircle2 className="w-5 h-5" />
                                            : <XCircle className="w-5 h-5" />
                                        }
                                        <span>{feedback.message}</span>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        'Salvar Alterações'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}