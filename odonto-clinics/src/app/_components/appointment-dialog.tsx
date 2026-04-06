import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import {AppointmentWithServ} from "./agenda-list";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";

interface DialogAppointmentProps {
    appointment: AppointmentWithServ | null
}

export function DialogAppointment({appointment}: DialogAppointmentProps) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Detalhes do Agendamento
                </DialogTitle>
                <DialogDescription>
                    Aqui você pode ver os detalhes do agendamento selecionado, incluindo informações sobre o paciente, serviço agendado e horário. Você também pode optar por cancelar o agendamento ou entrar em contato com o paciente para mais informações.
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                {appointment && (
                    <article className="font-medium">
                        <span className="font-bold">Horário:</span> {appointment.time} (tolerância de 30min) <br/>
                        <span className="font-bold">Data:</span> {format(appointment.AppointmentDate, "dd/MM/yyyy")} <br/>
                        <span className="font-bold">Nome:</span> {appointment.name} <br/>
                        <span className="font-bold">Email:</span> {appointment.email} <br/>
                        <span className="font-bold">Telefone:</span> {appointment.phone} <br/>
                        <div className="bg-slate-200 text-center rounded-lg">
                        <span className="font-bold ">Serviço a ser prestado: </span>{appointment.service.name} <br/>
                        </div>
                        <span className="font-bold">Valor a pagar:</span>{formatCurrency((appointment.service.price) /100 )} <br/>
                    </article>
                )}
            </div>
        </DialogContent>
    )
}