import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
                <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
                    © {new Date().getFullYear()} <span className="text-blue-400 font-semibold">OdontoClinic</span>. Todos os direitos reservados.
                </div>
        </footer>
    );
}
