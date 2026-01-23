'use client'

import Image from "next/image";
import Test from '../../../../../public/foto1.png';
import { MapPin } from "lucide-react";

export function ScheduleContent() {
    return (
        <div className="min-h-screen flex flex-col">
            <section className="h-32 bg-black"/>
            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 mb-8">
                                <Image src={Test} alt='clinica' className="object-cover" fill/>
                            </div>
                            <h1 className="text-2xl font-bold">Clínica</h1>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-5 h-5"/>
                                <span>Endereço não informado</span>
                            </div>
                    </div>
                </div>
            </section>
        </div>
    )
}