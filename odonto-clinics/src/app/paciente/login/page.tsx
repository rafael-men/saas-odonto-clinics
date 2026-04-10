'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginPatient, registerPatient } from "../_actions/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/toast-provider";

function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
        return numbers
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
    if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (!/[A-Za-z]/.test(password)) return 'A senha deve conter pelo menos uma letra.';
    if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número.';
    return null;
}

export default function PatientLoginPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});

    function set(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function handlePhoneChange(value: string) {
        set('phone', formatPhone(value));
    }

    function validate() {
        const newErrors: typeof errors = {};
        if (!validateEmail(form.email)) {
            newErrors.email = 'Informe um e-mail válido.';
        }
        const pwdError = validatePassword(form.password);
        if (pwdError) {
            newErrors.password = pwdError;
        }
        if (mode === 'register' && form.phone && form.phone.replace(/\D/g, '').length < 10) {
            newErrors.phone = 'Informe um telefone válido com DDD.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === 'register') {
                const res = await registerPatient(form);
                if (res?.error) { addToast(res.error, 'error'); return; }
                addToast('Conta criada com sucesso!', 'success');
            } else {
                const res = await loginPatient({ email: form.email, password: form.password });
                if (res?.error) { addToast(res.error, 'error'); return; }
                addToast('Bem-vindo de volta!', 'success');
            }
            router.push('/paciente/consultas');
        } catch {
            addToast('Erro inesperado. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    }

    function switchMode(newMode: 'login' | 'register') {
        setMode(newMode);
        setErrors({});
        setForm({ name: '', email: '', phone: '', password: '' });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900">
                        {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta de paciente'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {mode === 'login' ? 'Acompanhe suas consultas agendadas' : 'Cadastre-se para acompanhar seus agendamentos'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            <div className="space-y-1">
                                <Label>Nome completo</Label>
                                <Input
                                    placeholder="Seu nome"
                                    value={form.name}
                                    onChange={(e) => set('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Telefone</Label>
                                <Input
                                    placeholder="(11) 99999-9999"
                                    value={form.phone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    inputMode="numeric"
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </>
                    )}
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            required
                            className={errors.email ? 'border-red-400 focus-visible:ring-red-300' : ''}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label>Senha</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => set('password', e.target.value)}
                            required
                            className={errors.password ? 'border-red-400 focus-visible:ring-red-300' : ''}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                        {mode === 'register' && !errors.password && (
                            <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres, com letras e números.</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl h-11"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    {mode === 'login' ? (
                        <>Não tem conta?{' '}
                            <button onClick={() => switchMode('register')} className="text-blue-600 font-semibold hover:underline">Criar conta</button>
                        </>
                    ) : (
                        <>Já tem conta?{' '}
                            <button onClick={() => switchMode('login')} className="text-blue-600 font-semibold hover:underline">Entrar</button>
                        </>
                    )}
                </p>

                <div className="text-center">
                    <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Voltar para o início</Link>
                </div>
            </div>
        </div>
    );
}
