import { getPatientSession } from "../_actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, Clock, CreditCard, Building2, LogOut, XCircle, Home } from "lucide-react";
import { logoutPatient } from "../_actions/auth";
import Link from "next/link";
import { CancelButton } from "./_components/cancel-button";

export default async function PatientConsultasPage() {
    const patient = await getPatientSession();
    if (!patient) redirect('/paciente/login');

    const appointments = await prisma.appointments.findMany({
        where: { email: patient.email },
        include: { service: true, user: true },
        orderBy: { AppointmentDate: 'desc' },
    });

    const now = new Date();

    function isAppointmentPast(date: Date, time: string) {
        const [h, m] = time.split(':').map(Number);
        const dt = new Date(date);
        dt.setHours(h, m, 0, 0);
        return dt < now;
    }

    const active = appointments.filter((a) => a.status !== 'cancelled');
    const cancelled = appointments.filter((a) => a.status === 'cancelled');

    const upcoming = active.filter((a) => !isAppointmentPast(a.AppointmentDate, a.time));
    const past = active.filter((a) => isAppointmentPast(a.AppointmentDate, a.time));

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-sm text-blue-100">Olá,</p>
                            <p className="font-bold text-lg leading-tight">{patient.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-1.5 text-sm text-blue-100 hover:text-white transition-colors">
                            <Home className="w-4 h-4" />
                            Início
                        </Link>
                        <form action={logoutPatient}>
                            <button type="submit" className="flex items-center gap-1.5 text-sm text-blue-100 hover:text-white transition-colors">
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-emerald-500" />
                        Próximas consultas
                    </h2>
                    {upcoming.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
                            <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-gray-500">Nenhuma consulta agendada</p>
                            <Link href="/clinicas" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                                Agendar agora
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((a) => (
                                <AppointmentCard
                                    key={a.id}
                                    appointment={a}
                                    variant="upcoming"
                                    showCancel
                                />
                            ))}
                        </div>
                    )}
                </section>

                {past.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Histórico
                        </h2>
                        <div className="space-y-3">
                            {past.map((a) => (
                                <AppointmentCard key={a.id} appointment={a} variant="past" />
                            ))}
                        </div>
                    </section>
                )}

                {cancelled.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            Canceladas
                        </h2>
                        <div className="space-y-3">
                            {cancelled.map((a) => (
                                <AppointmentCard key={a.id} appointment={a} variant="cancelled" />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

function AppointmentCard({
    appointment: a,
    variant,
    showCancel,
}: {
    appointment: any;
    variant: 'upcoming' | 'past' | 'cancelled';
    showCancel?: boolean;
}) {
    const dateLabel = format(a.AppointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

    const styles = {
        upcoming: "border-emerald-100 hover:shadow-md",
        past: "border-gray-100 opacity-80",
        cancelled: "border-red-100 opacity-70",
    };

    const badgeBg = {
        upcoming: "bg-blue-50 text-blue-600",
        past: "bg-gray-100 text-gray-500",
        cancelled: "bg-red-50 text-red-500",
    };

    const dateBg = {
        upcoming: "bg-gradient-to-br from-blue-500 to-cyan-400",
        past: "bg-gray-200 text-gray-500",
        cancelled: "bg-red-100 text-red-400",
    };

    return (
        <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${styles[variant]}`}>
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold
                ${variant === 'upcoming' ? `${dateBg[variant]} text-white` : dateBg[variant]}`}>
                <span className="text-xl leading-none">{format(a.AppointmentDate, 'd')}</span>
                <span className="text-xs uppercase">{format(a.AppointmentDate, 'MMM', { locale: ptBR })}</span>
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
                <p className="font-bold text-gray-900 capitalize truncate">{dateLabel}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {a.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {a.user?.name ?? 'Clínica'}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        {a.paymentForm === 'pix' ? 'PIX' : 'Cartão de crédito'}
                    </span>
                </div>
                {variant === 'cancelled' && (
                    <span className="text-xs text-red-500 font-medium">Consulta cancelada</span>
                )}
            </div>
            <div className="shrink-0 flex items-center gap-3">
                <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${badgeBg[variant]}`}>
                    {a.service?.name ?? 'Serviço'}
                </span>
                {variant === 'upcoming' && showCancel && (
                    <CancelButton appointmentId={a.id} />
                )}
            </div>
        </div>
    );
}
