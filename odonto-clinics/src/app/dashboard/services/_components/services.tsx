'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PencilIcon, Plus, X, Loader2 } from 'lucide-react';
import { DialogServ } from './dialogServ';
import { Professional, Service } from '@/generated/prisma/client';
import { formatCurrency } from '@/utils/formatCurrency';
import { deleteService } from '../_actions/delete-service';
import { useToast } from '@/components/toast-provider';

type ServiceWithProfessional = Service & { professional: Professional | null };

interface ServicesProps {
    services: ServiceWithProfessional[];
    professionals: Professional[];
}

export function Services({ services, professionals }: ServicesProps) {
    const { addToast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editService, setEditService] = useState<ServiceWithProfessional | null>(null);

    async function handleDelete(serviceId: string) {
        setDeletingId(serviceId);
        try {
            const response = await deleteService({ serviceId });
            if (response.success) {
                addToast(response.message || 'Serviço deletado com sucesso!', 'success');
            } else {
                addToast(response.error || 'Erro ao deletar serviço', 'error');
            }
        } catch {
            addToast('Erro inesperado. Tente novamente.', 'error');
        } finally {
            setDeletingId(null);
        }
    }

    function handleEditService(service: ServiceWithProfessional) {
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
                                <Plus className='w-4 h-4' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogServ
                                professionals={professionals}
                                serviceId={editService?.id}
                                initialValues={editService ? {
                                    name: editService.name,
                                    price: (editService.price / 100).toFixed(2).replace('.', ','),
                                    hours: Math.floor(editService.duration / 60).toString(),
                                    minutes: (editService.duration % 60).toString(),
                                    professionalId: editService.professionalId ?? '',
                                } : undefined}
                            />
                        </DialogContent>
                    </CardHeader>
                    <CardContent>
                        <section className='space-y-3'>
                            {services.length === 0 && (
                                <p className='text-sm text-gray-400 text-center py-6'>Nenhum serviço cadastrado.</p>
                            )}
                            {services.map((service) => (
                                <article key={service.id} className='flex items-center justify-between border rounded-lg px-4 py-3'>
                                    <div className='flex flex-col gap-0.5'>
                                        <span className='font-medium'>{service.name}</span>
                                        <span className='text-sm font-semibold text-blue-600'>{formatCurrency(service.price / 100)}</span>
                                        {service.professional && (
                                            <span className='text-xs text-gray-500'>Dr(a). {service.professional.name}</span>
                                        )}
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button className='bg-gray-600 text-white' size='icon' onClick={() => handleEditService(service)}>
                                            <PencilIcon className='w-4 h-4' />
                                        </Button>
                                        <Button
                                            className='bg-gray-600 text-white'
                                            size='icon'
                                            onClick={() => handleDelete(service.id)}
                                            disabled={deletingId === service.id}
                                        >
                                            {deletingId === service.id ? (
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                            ) : (
                                                <X className='w-4 h-4' />
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
    );
}
