import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { Suspense } from 'react';

async function VerifyContent({ token }: { token: string | undefined }) {
  if (!token) {
    return (
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Token no trobat</h1>
        <p className="text-gray-300 mb-6">L'enllaç de verificació no és vàlid o ha expirat.</p>
        <Link href="/register" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30">
          Torna a registrar-te
        </Link>
      </div>
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return (
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Token invàlid</h1>
          <p className="text-gray-300 mb-6">Aquest token de verificació no existeix o ja ha estat utilitzat.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30">
            Vés al Login
          </Link>
        </div>
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    return (
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
        <div className="text-green-400 mb-4 animate-bounce">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Compte verificat!</h1>
        <p className="text-gray-300 mb-6">El teu correu s'ha verificat correctament. Ja pots accedir al teu panell de control.</p>
        <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30">
          Inicia sessió
        </Link>
      </div>
    );
  } catch (error) {
    console.error('Verification error:', error);
    return (
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Error inesperat</h1>
        <p className="text-gray-300 mb-6">S'ha produït un error en verificar el teu compte. Intenta-ho més tard.</p>
      </div>
    );
  }
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="max-w-md w-full">
        <Suspense
          fallback={
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-white">Verificant...</p>
            </div>
          }
        >
          <VerifyContent token={token} />
        </Suspense>
      </div>
    </main>
  );
}
