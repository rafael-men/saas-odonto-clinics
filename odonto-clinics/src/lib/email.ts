import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT) || 465;
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface AppointmentEmailData {
    patientName: string;
    patientEmail: string;
    clinicName: string;
    serviceName: string;
    date: string;
    time: string;
    paymentForm: string;
    appointmentId: string;
}

export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData) {
    const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/paciente/consultas`;
    const paymentLabel = data.paymentForm === 'pix' ? 'PIX' : 'Cartão de crédito';

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2563eb, #0891b2); padding: 32px 24px; text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_URL}/logos.png" alt="OdontoClinic" style="width: 48px; height: 48px; margin-bottom: 16px;" />
            <h1 style="color: white; margin: 0; font-size: 24px;"> Consulta Confirmada</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Sua consulta foi agendada com sucesso!</p>
        </div>
        <div style="padding: 32px 24px;">
            <p style="color: #334155; font-size: 16px; margin: 0 0 24px;">
                Olá, <strong>${data.patientName}</strong>! Aqui estão os detalhes do seu agendamento:
            </p>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">🏥 Clínica</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${data.clinicName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">🦷 Serviço</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.serviceName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">📅 Data</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">🕐 Horário</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">💳 Pagamento</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${paymentLabel}</td>
                    </tr>
                </table>
            </div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                     Você pode cancelar esta consulta com até <strong>30 minutos de antecedência</strong> pelo sistema.
                </p>
            </div>
            <div style="text-align: center;">
                <a href="${cancelUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #0891b2); color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; font-size: 14px;">
                    Ver minhas consultas
                </a>
            </div>
        </div>
        <div style="background: #1e293b; padding: 20px 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                OdontoClinic — Cuidando do seu sorriso
            </p>
        </div>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"OdontoClinic" <${process.env.SMTP_USER}>`,
            to: data.patientEmail,
            subject: `Consulta confirmada — ${data.clinicName}`,
            html,
        });
    } catch (err) {
    }
}

interface CancellationEmailData {
    patientName: string;
    patientEmail: string;
    clinicName: string;
    serviceName: string;
    date: string;
    time: string;
}

export async function sendCancellationEmail(data: CancellationEmailData) {
    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 32px 24px; text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_URL}/logos.png" alt="OdontoClinic" style="width: 48px; height: 48px; margin-bottom: 16px;" />
            <h1 style="color: white; margin: 0; font-size: 24px;">Consulta Cancelada</h1>
            <p style="color: #fecaca; margin: 8px 0 0; font-size: 14px;">Sua consulta foi cancelada com sucesso.</p>
        </div>
        <div style="padding: 32px 24px;">
            <p style="color: #334155; font-size: 16px; margin: 0 0 24px;">
                Olá, <strong>${data.patientName}</strong>. Confirmamos o cancelamento da sua consulta:
            </p>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">🏥 Clínica</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${data.clinicName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">🦷 Serviço</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.serviceName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">📅 Data</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9;">🕐 Horário</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #f1f5f9;">${data.time}</td>
                    </tr>
                </table>
            </div>
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_URL}/clinicas" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #0891b2); color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; font-size: 14px;">
                    Agendar nova consulta
                </a>
            </div>
        </div>
        <div style="background: #1e293b; padding: 20px 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                OdontoClinic — Cuidando do seu sorriso
            </p>
        </div>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"OdontoClinic" <${process.env.SMTP_USER}>`,
            to: data.patientEmail,
            subject: `Consulta cancelada — ${data.clinicName}`,
            html,
        });
    } catch (err) {
    }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/paciente/redefinir-senha?token=${token}`;

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2563eb, #0891b2); padding: 32px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Redefinir Senha</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Solicitação de alteração de senha</p>
        </div>
        <div style="padding: 32px 24px;">
            <p style="color: #334155; font-size: 16px; margin: 0 0 24px;">
                Olá, <strong>${name}</strong>! Recebemos uma solicitação para redefinir sua senha.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">
                Clique no botão abaixo para criar uma nova senha. Este link expira em <strong>1 hora</strong>.
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #0891b2); color: white; text-decoration: none; padding: 14px 40px; border-radius: 9999px; font-weight: 600; font-size: 15px;">
                    Redefinir minha senha
                </a>
            </div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px;">
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                    Se você não solicitou esta alteração, ignore este e-mail. Sua senha permanecerá a mesma.
                </p>
            </div>
        </div>
        <div style="background: #1e293b; padding: 20px 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                OdontoClinic — Cuidando do seu sorriso
            </p>
        </div>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"OdontoClinic" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Redefinir senha — OdontoClinic',
            html,
        });
    } catch (err) {
    }
}
