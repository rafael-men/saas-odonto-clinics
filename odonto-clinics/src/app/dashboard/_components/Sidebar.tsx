'use client'
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, PersonStanding, Settings, Stethoscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from '../../../../public/icon.png';
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";

export function Sidebar({children} : {children : React.ReactNode}) {
    const pathname = usePathname()
    const [Collapsed, setCollapsed] = useState(false)


    return (
        <div className="flex min-h-screen w-full">
            <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 h-full p-4",{
                'w-20':Collapsed,
                'w-64':!Collapsed,
                'hidden md:flex md:fixed':true
            })}>

            <div className="mb-6 mt-4" style={{ display: 'flex', alignItems: 'center' }}>
             {!Collapsed && (
            <>
            <Image 
                src={Logo} 
                alt="logo" 
                priority 
                quality={100} 
                style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '10px' 
                }}
            />
            <h1 className="font-semibold" style={{ margin: 0 }}>Odonto Clinics</h1>
            </>
            )}
           </div>


            <Button className="bg-gray-100 w-full hover:bg-gray-200 text-zinc-900 self-end mb-2"
                onClick={() => setCollapsed(!Collapsed)}>
                {!Collapsed ? <ChevronLeft className="h-12 w-12"/> : <ChevronRight className="w-12 h-12"/>}
            </Button>

            {Collapsed && (
                 <nav className="flex flex-col gap-1 overflow-hidden">
                <SidebarNav href="/dashboard" label="Agendamentos" pathname={pathname} collapsed={Collapsed}
                icon={<CalendarCheck2 className="w-6 h-6"/>}/>

                <SidebarNav href="/dashboard/services" label="Serviços" pathname={pathname} collapsed={Collapsed}
                icon={<Settings className="w-6 h-6"/>}/>

                <SidebarNav href="/dashboard/profissionais" label="Profissionais" pathname={pathname} collapsed={Collapsed}
                icon={<Stethoscope className="w-6 h-6"/>}/>

                <SidebarNav href="/dashboard/profile" label="Perfil" pathname={pathname} collapsed={Collapsed}
                icon={<PersonStanding className="w-6 h-6"/>}/>
                 </nav>
            )}


            <Collapsible open={!Collapsed}>
            <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">

                <span className="text-sm text-gray-800 font-medium ">
                    Painel
                </span>

                <SidebarNav href="/dashboard" label="Agendamentos" pathname={pathname} collapsed={Collapsed} 
                icon={<CalendarCheck2 className="w-6 h-6"/>}/>

                <SidebarNav href="/dashboard/services" label="Serviços" pathname={pathname} collapsed={Collapsed}
                icon={<Settings className="w-6 h-6"/>}/>

                <SidebarNav href="/dashboard/profissionais" label="Profissionais" pathname={pathname} collapsed={Collapsed}
                icon={<Stethoscope className="w-6 h-6"/>}/>

                <span className="text-sm text-gray-800 font-medium ">
                    Configurações
                </span>

                <SidebarNav href="/dashboard/profile" label="Perfil" pathname={pathname} collapsed={Collapsed}
                icon={<PersonStanding className="w-6 h-6"/>}/>
                

            </nav>
            </CollapsibleContent>
            </Collapsible>
            </aside>


            <div className={clsx("flex flex-1 flex-col transition-all duration-300",{
                'md:ml-20' : Collapsed, 
                'md:ml-64' : !Collapsed
            })}>

                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button size='icon' className="md:hidden" onClick={()=> setCollapsed(false)}>
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
                            <SidebarNav href="/dashboard" label="Agendamentos" pathname={pathname} collapsed={Collapsed} 
                            icon={<CalendarCheck2 className="w-6 h-6"/>}/>

                            <SidebarNav href="/dashboard/services" label="Serviços" pathname={pathname} collapsed={Collapsed}
                            icon={<Folder className="w-5 h-6"/>}/>

                            <SidebarNav href="/dashboard/profissionais" label="Profissionais" pathname={pathname} collapsed={Collapsed}
                            icon={<Stethoscope className="w-5 h-6"/>}/>

                            <SidebarNav href="/dashboard/profile" label="Perfil" pathname={pathname} collapsed={Collapsed}
                            icon={<Settings className="w-5 h-6"/>}/>

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