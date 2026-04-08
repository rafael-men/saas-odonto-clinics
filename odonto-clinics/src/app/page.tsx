import { Clinics } from "./_components/clinics";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { getProfessionals } from "./_data_access/get-professionals";

export default async function Home() {
  const professionals = await getProfessionals();
  return (
    <div className="flex flex-col min-h-screen">
   <Header/>
   <div className="pt-20">
    <Hero/>
    <Clinics professionals={professionals} limit={5}/>
    <Footer/>
   </div>
   </div>
  );
}
