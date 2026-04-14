'use client'

import { useState } from "react";
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

export function CancelButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    async function handleCancel() {
        setLoading(true);
        try {
            const res = await cancelAppointment(appointmentId);
            if (res?.error) {
                addToast(res.error, 'error');
            } else {
                addToast('Consulta cancelada com sucesso. Um e-mail de confirmação foi enviado.', 'success');
                router.refresh();
            }
        } catch {
            addToast('Erro ao cancelar. Tente novamente.', 'error');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
            >
                <XCircle className="w-3.5 h-3.5" />
                Cancelar
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Cancelar consulta</h3>
                            <p className="text-sm text-gray-500">
                                Você realmente deseja cancelar esta consulta? Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Manter consulta
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sim, cancelar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
