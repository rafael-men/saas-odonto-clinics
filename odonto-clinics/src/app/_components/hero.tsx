import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import HeroImage from '../../../public/hero.png';
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { getPatientSession } from "../paciente/_actions/auth";

export async function Hero() {
    const patient = await getPatientSession();
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 min-h-[92vh] flex items-center">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 space-y-8 text-white max-w-2xl">

                        <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                            Cuide do seu{" "}
                            <span className="text-yellow-300">sorriso</span>{" "}
                            com facilidade
                        </h1>

                        <p className="text-lg text-blue-100 leading-relaxed max-w-xl">
                            Encontre clínicas odontológicas, agende consultas em segundos e acompanhe seus atendimentos — tudo em um só lugar.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg shadow-blue-900/20 rounded-full px-8">
                                <Link href="/clinicas">Encontrar Clínica</Link>
                            </Button>
                            {!patient && (
                                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 bg-transparent">
                                    <Link href="/paciente/login">Acessar Minha Conta</Link>
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-6 pt-2">
                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                                <CalendarCheck className="w-4 h-4 text-yellow-300" />
                                Agendamento em menos de 2 min
                            </div>
                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                                Clínicas verificadas
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block flex-shrink-0">
                        <div className="relative w-[520px] h-[520px]">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-cyan-300/10 blur-md" />
                            <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl">
                                <Image
                                    src={HeroImage}
                                    alt="Dentista"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                            </div>
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#f8fafc"/>
                </svg>
            </div>
        </section>
    );
}
