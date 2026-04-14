'use client'

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/toast-provider";
import { requestPasswordReset, resetPassword } from "../_actions/reset-password";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (token) {
        return <NewPasswordForm token={token} />;
    }

    return <RequestResetForm />;
}

function RequestResetForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { addToast } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setSent(true);
        } catch {
            addToast('Erro ao enviar. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h1 className="text-xl font-bold text-gray-900">E-mail enviado!</h1>
                    <p className="text-sm text-gray-500">
                        Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e spam.
                    </p>
                    <Link href="/paciente/login" className="text-sm text-blue-600 font-semibold hover:underline">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900">Esqueceu sua senha?</h1>
                    <p className="text-sm text-gray-500">
                        Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl h-11"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link de redefinição'}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/paciente/login" className="text-xs text-gray-400 hover:text-gray-600">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}

function NewPasswordForm({ token }: { token: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(token, password);
            if (res.error) {
                setError(res.error);
            } else {
                setDone(true);
            }
        } catch {
            addToast('Erro ao redefinir. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h1 className="text-xl font-bold text-gray-900">Senha redefinida!</h1>
                    <p className="text-sm text-gray-500">Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
                    <Button
                        onClick={() => router.push('/paciente/login')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl h-11"
                    >
                        Ir para o login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900">Nova senha</h1>
                    <p className="text-sm text-gray-500">Digite sua nova senha abaixo.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Nova senha</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Confirmar nova senha</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl h-11"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redefinir senha'}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/paciente/login" className="text-xs text-gray-400 hover:text-gray-600">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}
