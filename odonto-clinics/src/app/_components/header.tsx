import Link from "next/link";

export function Header() {
    return(
        <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-black text-white">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" >
                Logo
                </Link>

                <nav>
                    <a href="/">Profissionais</a>
                </nav>
            </div>
        </header>
    )
}