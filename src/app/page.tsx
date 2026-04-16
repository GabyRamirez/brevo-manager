import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
      <div className="max-w-3xl animate-fade-up">
        <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Gestiona les teves preferències
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-inter">
          Control total sobre les teves subscripcions i comunicacions per correu de Brevo.
          Registra't per començar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg">
            Registra't ara
          </Link>
          <Link href="/login" className="btn-secondary text-lg">
            Inicia sessió
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="glass-card p-8 text-left hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Llistes de Correu</h3>
          <p className="text-slate-400">Trieu exactament quins temes t'interessen i gestiona les teves subscripcions.</p>
        </div>
        
        <div className="glass-card p-8 text-left hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Privacitat</h3>
          <p className="text-slate-400">Accés segur amb contrasenya i verificació per correu electrònic.</p>
        </div>

        <div className="glass-card p-8 text-left hover:scale-[1.02] transition-transform">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Blacklist</h3>
          <p className="text-slate-400">Si t'havies donat de baixa per error, pots reactivar el teu estat en un clic.</p>
        </div>
      </div>
    </div>
  );
}
