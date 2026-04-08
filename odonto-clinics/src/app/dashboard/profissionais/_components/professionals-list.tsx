'use client'

import { useState } from "react";
import { Professional } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, PencilIcon, Trash2, Loader2, Phone, MessageCircle, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { ProfessionalDialog } from "./professional-dialog";
import { deleteProfessional } from "../_actions/professionals-actions";
import { useToast } from "@/components/toast-provider";

interface Props {
    professionals: Professional[];
    userId: string;
}

export function ProfessionalsList({ professionals: initial, userId }: Props) {
    const { addToast } = useToast();
    const [list, setList] = useState<Professional[]>(initial);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Professional | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [viewingId, setViewingId] = useState<string | null>(null);

    function openCreate() {
        setEditing(null);
        setDialogOpen(true);
    }

    function openEdit(p: Professional) {
        setEditing(p);
        setDialogOpen(true);
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteProfessional(id);
            setList((prev) => prev.filter((p) => p.id !== id));
            addToast("Profissional removido.", "success");
        } catch {
            addToast("Erro ao remover profissional.", "error");
        } finally {
            setDeletingId(null);
        }
    }

    function handleSuccess() {
        setDialogOpen(false);
        window.location.reload();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <section className="mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl md:text-2xl font-semibold">
                            Profissionais Disponíveis
                        </CardTitle>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {list.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">
                                Nenhum profissional cadastrado. Clique em + para adicionar.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {list.map((p) => (
                                    <article
                                        key={p.id}
                                        className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="relative h-40 w-full bg-gray-100">
                                            {p.photo ? (
                                                <Image
                                                    src={p.photo}
                                                    alt={p.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 33vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">
                                                    <BadgeCheck className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <div>
                                                <h3 className="font-semibold text-base">{p.name}</h3>
                                                <span className="text-xs text-blue-600 font-medium">{p.crm}</span>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 shrink-0" />
                                                    {p.phone}
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-green-500" />
                                                    {p.whatsapp}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => openEdit(p)}
                                                >
                                                    <PencilIcon className="w-3.5 h-3.5 mr-1" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={deletingId === p.id}
                                                >
                                                    {deletingId === p.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                            Remover
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <DialogContent>
                <ProfessionalDialog
                    userId={userId}
                    professional={editing}
                    onSuccess={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}
