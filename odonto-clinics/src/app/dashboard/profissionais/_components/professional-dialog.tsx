'use client'

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, User } from "lucide-react";
import { createProfessional, updateProfessional } from "../_actions/professionals-actions";
import { useToast } from "@/components/toast-provider";
import { Professional } from "@/generated/prisma/client";
import Image from "next/image";

const schema = z.object({
    name: z.string().min(1, "Nome obrigatório"),
    crm: z.string().min(1, "CRM obrigatório"),
    phone: z.string().min(1, "Telefone obrigatório"),
    whatsapp: z.string().min(1, "WhatsApp obrigatório"),
});

type FormData = z.infer<typeof schema>;

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    }
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
}


interface Props {
    userId: string;
    professional?: Professional | null;
    onSuccess: () => void;
}

export function ProfessionalDialog({ userId, professional, onSuccess }: Props) {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [photoBase64, setPhotoBase64] = useState<string>(professional?.photo ?? "");
    const [phoneDisplay, setPhoneDisplay] = useState(professional?.phone ?? "");
    const [whatsappDisplay, setWhatsappDisplay] = useState(professional?.whatsapp ?? "");
    const [crmDisplay, setCrmDisplay] = useState(professional?.crm ?? "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEdit = !!professional;

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: professional?.name ?? "",
            crm: professional?.crm ?? "",
            phone: professional?.phone ?? "",
            whatsapp: professional?.whatsapp ?? "",
        },
    });

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 800 * 1024) {
            addToast("Foto muito grande. Máximo 800KB.", "error");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPhotoBase64(reader.result as string);
        reader.readAsDataURL(file);
    }

    function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatPhone(e.target.value);
        setPhoneDisplay(formatted);
        setValue("phone", formatted);
    }

    function handleWhatsappInput(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatPhone(e.target.value);
        setWhatsappDisplay(formatted);
        setValue("whatsapp", formatted);
    }

    function handleCrmInput(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        // Allow free typing but store formatted
        setCrmDisplay(raw.toUpperCase());
        setValue("crm", raw.toUpperCase());
    }

    async function onSubmit(data: FormData) {
        setLoading(true);
        try {
            const payload = {
                ...data,
                photo: photoBase64 || undefined,
            };
            if (isEdit) {
                await updateProfessional(professional.id, payload);
                addToast("Profissional atualizado com sucesso!", "success");
            } else {
                await createProfessional({ ...payload, userId });
                addToast("Profissional cadastrado com sucesso!", "success");
                reset();
                setPhotoBase64("");
                setPhoneDisplay("");
                setWhatsappDisplay("");
                setCrmDisplay("");
            }
            onSuccess();
        } catch {
            addToast("Erro ao salvar profissional.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{isEdit ? "Editar Profissional" : "Novo Profissional"}</DialogTitle>
                <DialogDescription>
                    {isEdit ? "Atualize os dados do profissional." : "Preencha os dados para cadastrar um profissional."}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                {/* Upload de foto */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 hover:border-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {photoBase64 ? (
                            <Image src={photoBase64} alt="Foto" fill className="object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-1">
                                <User className="w-8 h-8" />
                                <span className="text-xs">Foto</span>
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {photoBase64 ? "Trocar foto" : "Enviar foto"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>

                <div className="space-y-1">
                    <Label>Nome</Label>
                    <Input placeholder="Dr. João Silva" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>CRM</Label>
                    <Input
                        placeholder="CRM/SP 123456"
                        value={crmDisplay}
                        onChange={handleCrmInput}
                    />
                    {errors.crm && <p className="text-xs text-red-500">{errors.crm.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Telefone</Label>
                        <Input
                            placeholder="(11) 9999-9999"
                            value={phoneDisplay}
                            onChange={handlePhoneInput}
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>WhatsApp</Label>
                        <Input
                            placeholder="(11) 99999-9999"
                            value={whatsappDisplay}
                            onChange={handleWhatsappInput}
                        />
                        {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Salvar alterações" : "Cadastrar profissional"}
                </Button>
            </form>
        </>
    );
}
