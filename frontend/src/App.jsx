import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { Sparkles, HelpCircle, ShieldAlert, CornerDownLeft, Trash2, Copy, Check, Code, History, LogIn, LogOut } from 'lucide-react';

const API_URL = 'http://localhost:8085/api';

function App() {
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  
  // States për Auth
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showAuthModal, setShowAuthModal] = useState(!localStorage.getItem('token'));
  const [isLoginView, setIsLoginView] = useState(true);

  // Krijimi i një instance të përshtatshme të Axios për të dërguar gjithmonë Bearer Token automatikisht
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchHistory = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const response = await axios.get(`${API_URL}/ai/history`, getAuthHeader());
      if (response.data.success) {
        setHistoryList(response.data.history);
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së historikut", error);
    }
  };

  useEffect(() => {
    if (userName) {
      fetchHistory();
    }
  }, [userName]);

  const handleProcess = async (actionType) => {
    if (!localStorage.getItem('token')) {
      setShowAuthModal(true);
      return;
    }
    if (!query.trim()) {
      alert("Ju lutem shkruani një pyetje!");
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/ai/process`, {
        action_type: actionType,
        user_input: query,
        language_used: 'javascript'
      }, getAuthHeader());

      if (response.data.success) {
        setOutput(response.data.data.ai_response);
        fetchHistory();
      }
    } catch (error) {
      setOutput("// Gabim në autentikim ose sesion i skaduar.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (name) => {
    setUserName(name);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, getAuthHeader());
    } catch (e) {
      console.error("Logout gabim");
    }
    localStorage.clear();
    setUserName('');
    setHistoryList([]);
    setOutput('');
    setQuery('');
    setShowAuthModal(true);
    setIsLoginView(true);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Navbar />

      {showAuthModal && (
        <AuthModal 
          isLoginView={isLoginView} 
          setIsLoginView={setIsLoginView} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 hidden md:flex flex-col justify-between">
          <div>
            <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <History size={14} className="text-indigo-400" /> Chat Historiku yt
            </div>
            
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {historyList.length === 0 ? (
                <div className="text-slate-600 text-xs italic p-2">Nuk ka pyetje në llogarinë tuaj.</div>
              ) : (
                historyList.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => { setQuery(item.user_input); setOutput(item.ai_response); }}
                    className="p-2.5 bg-slate-950/50 hover:bg-slate-800 rounded-xl border border-slate-800/80 text-xs cursor-pointer text-slate-300 truncate transition"
                  >
                    <span className="text-indigo-400 mr-1 font-mono">[{item.action_type.substring(0, 3).toUpperCase()}]</span>
                    {item.user_input}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {userName && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 py-2 rounded-xl text-xs font-semibold text-rose-400 transition cursor-pointer"
            >
              <LogOut size={14} /> Çkyçu nga Llogaria
            </button>
          )}
        </aside>

        {/* MAIN DASHBOARD WORKSPACE */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <section className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {userName ? `Dashboard i Mbrojtur: ${userName}` : 'Pllataforma e Siguruar'} <Sparkles className="text-indigo-400 w-5 h-5" />
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Sistemi i Sesioneve dhe Autentikimit me Token kriptografik është aktiv.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch">
            {/* INPUT PANEL */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Code size={14} className="text-indigo-400" /> Pyetja ose Kodi juaj
                  </label>
                </div>
                <textarea
                  className="w-full flex-1 min-h-[300px] bg-slate-950/80 text-emerald-400 p-4 rounded-xl font-mono text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  placeholder="// Shkruaj këtu..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <button onClick={() => handleProcess('generate')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-1.5"><Sparkles size={15} /> Gjenero</button>
                <button onClick={() => handleProcess('explain')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 rounded-xl text-sm transition border cursor-pointer flex items-center justify-center gap-1.5"><HelpCircle size={15} /> Shpjego</button>
                <button onClick={() => handleProcess('security')} className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-medium py-3 rounded-xl text-sm transition border cursor-pointer flex items-center justify-center gap-1.5"><ShieldAlert size={15} /> Audito</button>
              </div>
            </div>

            {/* OUTPUT PANEL */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">🖥️ Përgjigjja</label>
                {output && (
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 py-1 px-2.5 rounded-lg font-medium cursor-pointer">
                    {copied ? <><Check size={14} className="text-emerald-400" /> U Kopjua!</> : <><Copy size={14} /> Kopjo</>}
                  </button>
                )}
              </div>
              <div className="w-full flex-1 min-h-[300px] bg-slate-950 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-auto border border-slate-800 whitespace-pre-wrap flex">
                {loading ? (
                  <div className="flex items-center gap-3 text-indigo-400 font-medium text-center m-auto">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    Duke verifikuar Token-in dhe duke shkruar...
                  </div>
                ) : output ? (
                  <div>{output}</div>
                ) : (
                  <div className="text-slate-600 italic text-center m-auto text-xs sm:text-sm">
                    Ju lutem identifikohuni për të përdorur të gjitha funksionet e AI.
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
