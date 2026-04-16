'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface List {
  id: number;
  name: string;
}

interface UserStatus {
  email: string;
  isSubscribed: boolean;
  blacklisted: boolean;
  userLists: number[];
  availableLists: List[];
}

export default function Dashboard() {
  const router = useRouter();
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/brevo/status');
      if (!res.ok) throw new Error('No s\'ha pogut carregar l\'estat');
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('autoritzat')) router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const toggleList = async (listId: number) => {
    if (!status || updating) return;
    setUpdating(true);
    
    const isSubscribed = status.userLists.includes(listId);
    const newListIds = isSubscribed 
      ? status.userLists.filter(id => id !== listId)
      : [...status.userLists, listId];

    try {
      const res = await fetch('/api/brevo/update-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listIds: isSubscribed ? [] : [listId],
          unlinkListIds: isSubscribed ? [listId] : [],
        }),
      });

      if (!res.ok) throw new Error('Error actualitzant llistes');
      
      setStatus({ ...status, userLists: newListIds });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleReactivate = async () => {
    if (!confirm('Vols tornar a rebre correus nostres?')) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/brevo/reactivate', { method: 'POST' });
      if (!res.ok) throw new Error('Error reactivant el compte');
      await fetchStatus();
      alert('Compte reactivat correctament!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    // Basic logout: we could call an API to clear the cookie, 
    // or just redirect and let the server handle it if the cookie was expiring.
    // For now, we'll just redirect to a login page that clears the state.
    document.cookie = "user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-up">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold font-outfit mb-1">El teu perfil</h1>
          <p className="text-slate-400">{status?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-sm">
          Tanca la sessió
        </button>
      </div>

      {status?.blacklisted && (
        <div className="glass-card border-red-500/30 bg-red-500/5 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400">Estàs a la llista d'exclusió</h3>
              <p className="text-slate-400">Actualment no estàs rebent cap dels nostres correus massius.</p>
            </div>
          </div>
          <button 
            onClick={handleReactivate}
            disabled={updating}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50"
          >
            Reactivar subscripció
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 font-outfit flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Llistes de subscripció
          </h2>
          
          <div className="space-y-4">
            {status?.availableLists.length === 0 && <p className="text-slate-500">No hi ha llistes disponibles.</p>}
            {status?.availableLists.map(list => (
              <div key={list.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className="font-medium">{list.name}</span>
                <button
                  onClick={() => toggleList(list.id)}
                  disabled={updating}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    status.userLists.includes(list.id) ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      status.userLists.includes(list.id) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 font-outfit flex items-center gap-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Informació útil
          </h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p>
              Les subscripcions tenen efecte immediat. Pots canviar les teves preferències en qualsevol moment.
            </p>
            <p>
              Si et dónes de baixa d'una llista, deixaras de rebre els correus associats a aquest grup, però podràs seguir rebent altres comunicacions.
            </p>
            <p className="pt-4 border-t border-white/10">
              Tens algun dubte? Contacta amb <a href="mailto:informatica@intersindical-csc.cat" className="text-blue-400 underline">suport tècnic</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
