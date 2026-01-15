'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogTrigger, DialogDescription} from '@/components/ui/dialog';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogServ } from './dialogServ';

export function Services() {
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <section className='mx-auto'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-xl md:text-2xl font-semibold'>Serviços Disponíveis</CardTitle>
                        <DialogTrigger asChild>
                            <Button className='bg-blue-600 text-white'>
                                <Plus className='w-4 h-4'/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogServ/>
                        </DialogContent>
                    </CardHeader>
                </Card>
            </section>
        </Dialog>
    )
}