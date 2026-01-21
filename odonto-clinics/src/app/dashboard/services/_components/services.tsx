'use client'

import React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogTrigger, DialogDescription} from '@/components/ui/dialog';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PencilIcon, Plus, X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { DialogServ } from './dialogServ';
import { Service } from '@/generated/prisma/client';
import { formatCurrency } from '@/utils/formatCurrency';
import { deleteService } from '../_actions/delete-service';
import { cn } from '@/lib/utils';

interface ServicesProps {
    services: Service[];
}

export function Services({services}: ServicesProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [editService, setEditService] = useState<Service | null>(null);

    async function handleDelete(serviceId: string) {
        setDeletingId(serviceId);
        setFeedback(null);

        try {
            const response = await deleteService({serviceId});

            if (response.success) {
                setFeedback({ type: 'success', message: response.message || 'Serviço deletado!' });
            } else {
                setFeedback({ type: 'error', message: response.error || 'Erro ao deletar' });
            }
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro inesperado. Tente novamente.' });
        } finally {
            setDeletingId(null);
            setTimeout(() => setFeedback(null), 3000);
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
                        {feedback && (
                            <div className={cn(
                                "flex items-center gap-2 p-3 rounded-lg text-sm mb-4",
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