import React, { useState } from 'react';
import { Lock, Mail, User, X } from 'lucide-react';

function AuthModal({ isLoginView, setIsLoginView, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const url = isLoginView ? 'http://localhost:8085/api/login' : 'http://localhost:8085/api/register';
    const payload = isLoginView 
      ? { email, password } 
      : { name, email, password, password_confirmation: passwordConfirmation };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Ruajtja e Token-it dhe emrit në LocalStorage për Session/Auth persistent
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_name', data.user.name);
        onAuthSuccess(data.user.name);
      } else {
        setError(data.message || 'Ndodhi një gabim. Kontrolloni të dhënat.');
      }
    } catch (err) {
      setError('S\'ka komunikim me serverin.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        
        <h2 className="text-xl font-bold text-white mb-1">
          {isLoginView ? 'Identifikohu në Platformë' : 'Krijo një Llogari të Re'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">A aplikacion i mbrojtur me Siguri Kibernetike.</p>

        {error && <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLoginView && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Emri i Plotë</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Blendi Rexhepaj" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Email Adresa</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="blendi@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Fjalëkalimi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          {!isLoginView && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Konfirmo Fjalëkalimin</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="••••••••" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg cursor-pointer transition">
            {isLoginView ? 'Kyçu' : 'Regjistrohu'}
          </button>
        </form>

        <div className="mt-4 text-center border-t border-slate-800/60 pt-3">
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            {isLoginView ? 'S\'keni llogari? Regjistrohuni këtu' : 'Keni llogari? Kyçuni këtu'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
