'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Alguna cosa ha anat malament');

      setMessage(data.message);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 animate-fade-up">
      <div className="glass-card w-full max-w-md p-8 md:p-10">
        <h2 className="text-3xl font-bold font-outfit mb-2">Crea un compte</h2>
        <p className="text-slate-400 mb-8">Et enviarem un correu de verificació.</p>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
            {message}
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
              placeholder="Ex: joan@exemple.com"
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
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'S\'està registrant...' : 'Registra\'t'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Ja tens un compte?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Inicia sessió
          </Link>
        </p>
      </div>
    </div>
  );
}
