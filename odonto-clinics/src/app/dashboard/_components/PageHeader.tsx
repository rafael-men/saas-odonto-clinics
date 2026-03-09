import Image from "next/image";
import Foto from '../../../../public/dentista-concentrada-em-um-check-up-dentario_1153-666.jpg';
import prisma from "@/lib/prisma";

interface PageHeaderProps {
    userId: string;
    title: string;
}

export async function PageHeader({ userId, title }: PageHeaderProps) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true },
    });

    return (
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                    <Image
                        src={user?.image ?? Foto}
                        alt="foto do perfil"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
