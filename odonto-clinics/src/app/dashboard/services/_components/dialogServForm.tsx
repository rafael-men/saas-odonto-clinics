import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


const dialogServFormSchema = z.object({
    name: z.string().min(1, 'O nome do serviço é obrigatório'),
    price: z.string().min(1, 'o preço é obrigatório'),
    hours: z.string(),
    minutes: z.string(),
}); 

export interface DialogServFormProps {
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export type DialogServFormData = z.infer<typeof dialogServFormSchema>;

export function useDialogServForm({ initialValues }: DialogServFormProps ) {
    return useForm<DialogServFormData>({
        resolver: zodResolver(dialogServFormSchema),
        defaultValues: initialValues || {
            name: '',
            price: '',
            hours: '',
            minutes: '',
        }
    })
}