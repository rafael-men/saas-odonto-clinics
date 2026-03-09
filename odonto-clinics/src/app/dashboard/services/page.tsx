import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import ServicesContent from "./_components/services_content";
import { PageHeader } from "../_components/PageHeader";

export default async function Services() {
    const session = await getSession();
    if(!session){
        redirect('/');
    }

    return (
        <>
            <PageHeader title="Serviços" userId={session.user?.id!} />
            <ServicesContent userId={session.user?.id!} />
        </>
    )
}
