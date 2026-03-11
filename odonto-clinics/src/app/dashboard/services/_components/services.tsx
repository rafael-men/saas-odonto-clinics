'use client'

import React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogTrigger, DialogDescription} from '@/components/ui/dialog';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PencilIcon, Plus, X, Loader2 } from 'lucide-react';
import { DialogServ } from './dialogServ';
import { Service } from '@/generated/prisma/client';
import { formatCurrency } from '@/utils/formatCurrency';
import { deleteService } from '../_actions/delete-service';
import { useToast } from '@/components/toast-provider';

interface ServicesProps {
    services: Service[];
}

export function Services({services}: ServicesProps) {
    const { addToast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editService, setEditService] = useState<Service | null>(null);

    async function handleDelete(serviceId: string) {
        setDeletingId(serviceId);

        try {
            const response = await deleteService({serviceId});

            if (response.success) {
                addToast(response.message || 'Serviço deletado com sucesso!', 'success');
            } else {
                addToast(response.error || 'Erro ao deletar serviço', 'error');
            }
        } catch (error) {
            addToast('Erro inesperado. Tente novamente.', 'error');
        } finally {
            setDeletingId(null);
        }
    }

    async function handleEditService(service: Service) {
        setEditService(service);
        setDialogOpen(true);
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <section className='mx-auto'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-xl md:text-2xl font-semibold'>Serviços Disponíveis</CardTitle>
                        <DialogTrigger asChild>
                            <Button className='bg-blue-600 text-white' onClick={() => setEditService(null)}>
                                <Plus className='w-4 h-4'/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogServ serviceId={editService ? editService.id : undefined} 
                            initialValues={editService ? {
                                name: editService.name,
                                price: (editService.price/100).toFixed(2).replace('.', ','),
                                hours: Math.floor(editService.duration / 60).toString(),
                                minutes: (editService.duration % 60).toString()
                            } : undefined} />
                        </DialogContent>
                    </CardHeader>
                    <CardContent>
                        <section className='space-y-4'>
                            {services.map((service) => (
                                <article key={service.id} className='flex items-center justify-between'>
                                    <div className='flex items-center space-x-2'>
                                        <span className='font-medium'>{service.name}</span>
                                        <span className='text-gray-500'>-</span>
                                        <span className='font-semibold'>{formatCurrency((service.price / 100))}</span>
                                    </div>
                                    <div>
                                        <Button className='bg-gray-600 text-white' size='icon' onClick={() => handleEditService(service)}>
                                            <PencilIcon className='w-4 h-4'/>
                                        </Button>
                                        <Button
                                            className='bg-gray-600 text-white ml-2'
                                            size='icon'
                                            onClick={() => handleDelete(service.id)}
                                            disabled={deletingId === service.id}
                                        >
                                            {deletingId === service.id ? (
                                                <Loader2 className='w-4 h-4 animate-spin'/>
                                            ) : (
                                                <X className='w-4 h-4'/>
                                            )}
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                </Card>
            </section>
        </Dialog>
    )
}