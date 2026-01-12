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
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(1, { message:'Nome Obrigatório'}),
    address: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    status: z.string(),
    timeZone: z.string().min(1, {message:'Fuso Horário Obrigatório'}),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileContent() {
    const [selectedHours, setSelectedHours] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            cpf:'',
            status: 'active',
            timeZone: ''
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

    async function onSubmit(values: ProfileFormData) {
        const profile = {
            ...values,
            times: selectedHours,
        }
        console.log(profile);
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
                                    <Image src={Foto} alt="foto da clinica" fill className="object-cover rounded-full" />
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
                                            <FormLabel className="font-semibold">CPF</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Insira seu CPF"  />
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
                                                <Input {...field} placeholder="Insira seu Telefone"  />
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

                                <Button type="submit" className="w-full bg-blue-600 text-white">Salvar Alterações</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}