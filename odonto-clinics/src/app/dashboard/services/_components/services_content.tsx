import { getServices } from "./_DAL/getServices";
import { Services } from "./services";


interface ServicesContentProps {
    userId: string;
}


export default async function ServicesContent({userId}: ServicesContentProps) {

    const services = await getServices({userId: userId});

    console.log(services);
    return (
        <Services services={services.data || []}/>
    )
}