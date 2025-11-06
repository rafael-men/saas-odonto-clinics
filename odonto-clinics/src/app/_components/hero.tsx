import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroImage from '../../../public/hero.png';

export function Hero() {
    return (
        <div className="bg-blue-200">
            <div className="container mx-auto px-4 pt-20 pb-4 sm:px-6 lg:px-8 sm:pb-0">
                <main className="justify-center flex items-center">
                    <div className="space-y-8 max-w-3xl flex flex-col justify-center pb-5">
                        <h1 className="text-5xl lg:text-6xl font-bold">
                            Temos o que você precisa para cuidar da sua saúde bucal.
                        </h1>
                        <p className="text-base md:text-lg">
                            Uma plataforma especializada em atendimento odontológico 
                            com agendamentos simplificados e que busca trazer a melhor 
                            qualidade e experiência.
                        </p>
                        <Button className="bg-blue-500 text-white w-fit font-semibold">
                            Encontre uma Clínica
                        </Button>
                    </div>

                    <div className="hidden lg:block">
                        <Image src={HeroImage} alt="doctor" objectFit="object-contain" quality={100} priority={true}/>
                    </div>
                </main>
            </div>
        </div>
    )
}