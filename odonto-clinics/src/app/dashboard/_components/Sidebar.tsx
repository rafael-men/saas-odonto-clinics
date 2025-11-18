'use client'
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, Folder, List, Settings } from "lucide-react";
import Link from "next/link";

export function Sidebar({children} : {children : React.ReactNode}) {
    const pathname = usePathname()
    const [Collapsed, setCollapsed] = useState(false)


    return (
        <div className="flex min-h-screen w-full">
            <div className={clsx("flex flex-1 flex-col transition-all duration-300",{
                'md:ml-20' : Collapsed, 
                'md:ml-64' : !Collapsed
            })}>

                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button size='icon' className="md:hidden">
                                    <List className="w-5 h-5"/>
                                </Button>
                            </SheetTrigger>

                            <h1 className="text-base md:text-lg font-semibold">
                                Menu
                            </h1>
                        </div>

                        
                    <SheetContent side="right" className="sm:max-w-xs text-black bg-white">
                        <SheetTitle className="text-center pt-5">Odonto Clinic</SheetTitle>

                        <nav className="grid gap-2 text-base pt-5">
                            <SidebarNav href="/dashboard" label="dashboard" pathname={pathname} collapsed={Collapsed} 
                            icon={<CalendarCheck2 className="w-6 h-6"/>}/>

                            <SidebarNav href="/dashboard/services" label="Serviços" pathname={pathname} collapsed={Collapsed} 
                            icon={<Folder className="w-5 h-6"/> }/>

                            <SidebarNav href="/dashboard/profile" label="Perfil" pathname={pathname} collapsed={Collapsed} 
                            icon={<Settings className="w-5 h-6"/> }/>

                        </nav>
                    </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>

            </div>
        </div>
    )
}

interface SidebarNavProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string
    collapsed: boolean
}

function SidebarNav({href,icon,label,pathname,collapsed} : SidebarNavProps) {
    return (
        <Link href={href}>
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors",{
                'bg-blue-600 text-white' : pathname === href,
                'text-slate-600' : pathname !== href,

            })}>
                <span className="w-6 h-6">{icon}</span>
                {!collapsed && <span>{label}</span>}
            </div>
        </Link>
    )
}