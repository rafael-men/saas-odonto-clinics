'use client'

import { ProfileForm } from "./profile-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Foto from  '../../../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg';

export default function ProfileContent() {
    const form = ProfileForm();
    return (
        <div className="mx-auto ">
            <Form {...form}>
                <div>
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
                                                <Input {...field} placeholder="Insira seu Nome de Usuário"  />
                                            </FormControl>
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Form>
        </div>
    )
}