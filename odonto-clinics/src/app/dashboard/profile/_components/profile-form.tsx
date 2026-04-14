'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { time } from 'console';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UserProfileFormProps {
    name: string | null;
    address?: string | null;
    phone?: string | null;
    cpf?: string | null;
    status: boolean;
    timeZone: string | null;
}


const profileSchema = z.object({
    name: z.string().min(1, { message:'Nome Obrigatório'}),
    address: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    status: z.string(),
    timeZone: z.string().min(1, {message:'Fuso Horário Obrigatório'}),
})

type ProfileFormData = z.infer<typeof profileSchema>;


export function ProfileForm({name, address, phone, cpf, status, timeZone}: UserProfileFormProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: name || '',
            address: address || '' ,
            phone: phone || '',
            cpf: cpf || '',
            status:status ?  'active' :'inactive',
            timeZone: timeZone || ''
        }
    })
}
