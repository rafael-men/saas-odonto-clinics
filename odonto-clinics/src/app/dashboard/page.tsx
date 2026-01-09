import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";


export default async function Dashboard() {
  const session = await getSession();
  if(!session){ 
    redirect('/');  
  }
  return (
    <div>
      <h1>oppos</h1>
      <div className="w-full h-[600px] bg-gray-300 mb-10 ">
      </div>
    </div>
  )
}