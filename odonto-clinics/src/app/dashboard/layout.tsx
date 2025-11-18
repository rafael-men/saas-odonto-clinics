import { Sidebar } from "./_components/Sidebar"


export default function Dashboard({
    children,
} : {
    children : React.ReactNode
})  {
return (
    <>
    <Sidebar>
        {children}
    </Sidebar>
    </>
)}