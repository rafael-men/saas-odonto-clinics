import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logos.png";
import { User } from "lucide-react";
import { getPatientSession } from "@/app/paciente/_actions/auth";

export async function Header() {
    const patient = await getPatientSession();

    return (
        <header className="fixed top-0 right-0 left-0 z-[999] py-3 px-6 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/">
                    <Image src={Logo} alt="Logo da clínica" width={180} height={50} style={{ height: 'auto' }} />
                </Link>

                <nav className="flex items-center gap-3">

                    {patient ? (
                        <Link
                            href="/paciente/consultas"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full px-4 py-2 text-sm transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="max-w-[120px] truncate">{patient.name}</span>
                        </Link>
                    ) : (
                        <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full px-5 shadow-sm">
                            <Link href="/paciente/login" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Minha Conta
                            </Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
