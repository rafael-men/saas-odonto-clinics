import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const profileSchema = z.object({
    name: z.string().min(1, { message:'Nome Obrigatório'}),
    address: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    status: z.string(),
    timeZone: z.string().min(1, {message:'Fuso Horário Obrigatório'}),
})

type ProfileFormData = z.infer<typeof profileSchema>;


// Hook para o formulário de perfil
export function ProfileForm() {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            cpf:'',
            status: 'active',
            timeZone: ''
        }
    })
}
