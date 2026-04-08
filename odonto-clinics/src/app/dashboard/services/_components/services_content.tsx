import { getServices } from "./_DAL/getServices";
import { Services } from "./services";
import prisma from "@/lib/prisma";

interface ServicesContentProps {
    userId: string;
}

export default async function ServicesContent({userId}: ServicesContentProps) {
    const services = await getServices({userId});
    const professionals = await prisma.professional.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
    });

    return (
        <Services services={services.data || []} professionals={professionals} />
    )
}
