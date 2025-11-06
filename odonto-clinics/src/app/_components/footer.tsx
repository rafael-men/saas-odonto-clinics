export function Footer() {
    return (
        <footer className="py-6 text-center text-white bg-black text-sm md:text-base">
            <p>© {new Date().getFullYear()} <span className="font-semibold text-blue-500">Odonto Clinics</span>. 
          Todos os direitos reservados.</p>
        </footer>
    )
}