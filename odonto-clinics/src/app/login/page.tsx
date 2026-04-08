'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, loginWithCredentials } from "../_actions/login";
import { register } from "../_actions/register";
import Image from "next/image";
import Logo from "../../../public/icon.png";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/toast-provider";

export default function LoginPage() {
    const { addToast } = useToast();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'register') {
                const res = await register(email, password, name, address);
                if (res?.error) {
                    addToast(res.error, 'error');
                    setLoading(false);
                    return;
                }
                addToast('Conta criada com sucesso! Você será redirecionado...', 'success');
            }
            await loginWithCredentials(email, password);
        } catch {
            addToast('Email ou senha inválidos', 'error');
            setLoading(false);
        }
    }

    async function handleGoogle() {
        setLoading(true);
        await login('google');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <Link href="/">
                        <Image src={Logo} alt="Logo" className="w-10 h-10" />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-800">
                        {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    placeholder="Seu nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                    id="address"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
                        ou continue com
                    </div>
                </div>

                <Button variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={loading}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar com Google
                </Button>

                <p className="text-center text-sm text-gray-500">
                    {mode === 'login' ? (
                        <>Não tem conta?{' '}
                            <button onClick={() => setMode('register')} className="text-blue-600 font-medium hover:underline">
                                Criar conta
                            </button>
                        </>
                    ) : (
                        <>Já tem conta?{' '}
                            <button onClick={() => setMode('login')} className="text-blue-600 font-medium hover:underline">
                                Entrar
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
