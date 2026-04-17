'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (searchParams.get('verified')) {
      setSuccess('Compte verificat correctament! Ara pots iniciar sessió.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Si us plau, completa el sistema de seguretat.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken: token }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Credencials incorrectes');

      // In a real app, we'd use NextAuth. For this POC, we'll redirect to dashboard.
      // The session should be handled by the server (HttpOnly cookie).
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setToken(null); // Reset on error to force re-verification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 animate-fade-up">
      <div className="glass-card w-full max-w-md p-8 md:p-10">
        <h2 className="text-3xl font-bold font-outfit mb-2">Benvingut de nou</h2>
        <p className="text-slate-400 mb-8">Introdueix les teves dades per accedir.</p>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Correu electrònic</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="joan@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Contrasenya</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center py-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setToken(token)}
              options={{ theme: 'dark' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Iniciant sessió...' : 'Inicia sessió'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          No tens compte?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Registra't
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        Carregant...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
