import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { PageHeader } from "../_components/PageHeader";
import { getProfessionalsByUser } from "./_actions/professionals-actions";
import { ProfessionalsList } from "./_components/professionals-list";

export default async function ProfissionaisPage() {
    const session = await getSession();
    if (!session) redirect('/');

    const userId = session.user?.id!;
    const professionals = await getProfessionalsByUser(userId);

    return (
        <>
            <PageHeader title="Profissionais" userId={userId} />
            <div className="p-4 md:p-6">
                <ProfessionalsList professionals={professionals} userId={userId} />
            </div>
        </>
    );
}
