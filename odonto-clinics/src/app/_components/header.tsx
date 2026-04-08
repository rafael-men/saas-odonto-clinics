"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logos.png";

export function Header() {
    return(
        <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-black">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/">
                    <Image src={Logo} alt="Logo da clínica" width={200} height={50} style={{height: 'auto'}}/>
                </Link>

                <nav className="flex items-center gap-4">
                    <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-medium">
                        <Link href="/clinicas">Encontrar Clínica</Link>
                    </Button>
                </nav>
            </div>
        </header>
    )
}