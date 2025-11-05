"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu } from "lucide-react"; 
import Link from "next/link";

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const Items = [{href: '/profissionais',label: 'Profissionais'}]
    const Nav = () => (
        <>
        {Items.map((item) => (
            <Button key={item.href} asChild className="bg-transparent hover:bg-transparent text-black shadow-none" 
            onClick={()=> setIsOpen(false)}>
                <Link href={item.href}>
                {item.label}
                </Link>
            </Button>
        ))}
        </>
    )

    return(
        <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-black">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-3xl font-bold text-white" >
                Logo
                </Link>

                <nav className="hidden md:flex items-center text-white space-x-4">
                    <Nav/>
                </nav>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger className="md:hidden">
                        <Button className="text-white hover:bg-transparent" variant='ghost' size='icon'>
                          <Menu className="w-6 h-6"/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w[240px] sm-[300px] z-[9999] bg-white">
                        <SheetTitle className="border-b-4 h-12  text-center pt-3 font-bold">
                            Menu
                        </SheetTitle>
                        <nav className="pl-2 flex flex-col space-y-4 " >
                            <Nav/>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}