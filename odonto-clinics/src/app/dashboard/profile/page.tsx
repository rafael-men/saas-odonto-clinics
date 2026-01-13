import  getSession  from "@/lib/getSession";
import { redirect } from "next/navigation";
import getUser from "./_DAL/getUser";
import ProfileContent from "./_components/profile-content";

export default async function Profile() {
    const session = await getSession();
    
      if(!session){ 
        redirect('/');  
      }
      const user = await getUser({
        userId: session.user?.id as string
      })

      if(!user) {
        redirect('/');
      }

    return (
        <ProfileContent user={user}/>
    )
}