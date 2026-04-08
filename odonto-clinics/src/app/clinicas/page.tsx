import { Footer } from "../_components/footer";
import { Header } from "../_components/header";
import { getProfessionals } from "../_data_access/get-professionals";
import { ClinicasContent } from "./_components/clinicas-content";

export default async function ClinicasPage() {
  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="pt-20 flex-1">
        <ClinicasContent professionals={professionals} />
      </div>
      <Footer />
    </div>
  );
}
