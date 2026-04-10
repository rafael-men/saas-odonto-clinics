import { Clinics } from "./_components/clinics";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { getProfessionals } from "./_data_access/get-professionals";
import { ClinicGridSkeleton } from "./_components/clinic-card-skeleton";
import { Suspense } from "react";

export default async function Home() {
  const professionals = await getProfessionals();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <Suspense fallback={
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse mb-12" />
            <ClinicGridSkeleton count={5} />
          </div>
        </section>
      }>
        <Clinics professionals={professionals} limit={5} />
      </Suspense>
      <Footer />
    </div>
  );
}
