import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

function AuthModal({ isLoginView, setIsLoginView, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const url = isLoginView ? 'http://127.0.0.1:8085/api/login' : 'http://127.0.0.1:8085/api/register';
    const payload = isLoginView 
      ? { email, password } 
      : { name, email, password, password_confirmation: passwordConfirmation };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (!isLoginView) {
          // Pasi regjistrohet me sukses, bëjmë login automatik për të marrë token-in
          const loginResponse = await fetch('http://127.0.0.1:8085/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const loginData = await loginResponse.json();
          
          if (loginResponse.ok && loginData.success) {
            localStorage.setItem('token', loginData.access_token);
            localStorage.setItem('user_name', loginData.user.name);
            localStorage.setItem('user_email', loginData.user.email);
            onAuthSuccess(loginData.user.name, loginData.user.email);
          } else {
            setIsLoginView(true);
            setError('Account created successfully! Please sign in now.');
          }
        } else {
          // Nëse ishte thjesht Login i zakonshëm
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user_name', data.user.name);
          localStorage.setItem('user_email', data.user.email);
          onAuthSuccess(data.user.name, data.user.email);
        }
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || 'An error occurred. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('Server connection failed. Make sure the backend is running.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        
        <h2 className="text-xl font-bold text-white mb-1">
          {isLoginView ? 'Sign In to Platform' : 'Create a New Account'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">Cybersecurity Protected Application.</p>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLoginView && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLoginView && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                  placeholder="••••••••" 
                  value={passwordConfirmation} 
                  onChange={(e) => setPasswordConfirmation(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg cursor-pointer transition">
            {isLoginView ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center border-t border-slate-800/60 pt-3">
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer">
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;