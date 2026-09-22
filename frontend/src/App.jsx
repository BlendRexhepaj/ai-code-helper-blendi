import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { Sparkles, HelpCircle, ShieldAlert, Trash2, Copy, Check, Code, History, LogOut, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:8085/api';

function App() {
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showAuthModal, setShowAuthModal] = useState(!localStorage.getItem('token'));
  const [isLoginView, setIsLoginView] = useState(true);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchHistory = async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const response = await axios.get(`${API_URL}/ai/history`, getAuthHeader());
      if (response.data && response.data.success) {
        setHistoryList(response.data.history || []);
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
      alert("Ju lutem shkruani një kod ose pyetje!");
      return;
    }
    
    setLoading(true);
    setOutput('');

    try {
      const response = await axios.post(`${API_URL}/ai/process`, {
        action_type: actionType,
        user_input: query,
        language_used: selectedLanguage
      }, getAuthHeader());

      if (response.data && response.data.success) {
        setOutput(response.data.data.ai_response);
        fetchHistory();
      }
    } catch (error) {
      setOutput("```javascript\n// Gabim në autentikim ose sesion i skaduar.\n```");
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
      console.error("Logout gabim", e);
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
    const cleanText = output.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
    navigator.clipboard.writeText(cleanText);
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
        
        {/* SIDEBAR HISTORIKU */}
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
                    <span className="text-indigo-400 mr-1 font-mono">
                      [{item.action_type ? item.action_type.substring(0, 3).toUpperCase() : 'AI'}]
                    </span>
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

        {/* ZONA KRYESORE */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Blendi Smart Code Editor <Sparkles className="text-indigo-400 w-5 h-5" />
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Moduli Java 7 & 8: Ngjyrosje kodi (Syntax Highlight) dhe optimizim me Inteligjencë Artificiale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Gjuha:</span>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch">
            
            {/* INPUT PANEL */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Code size={14} className="text-indigo-400" /> Editori i Kodit të Hyrë
                  </label>
                  {query && (
                    <button onClick={() => setQuery('')} className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800/50">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-1 min-h-[350px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
                  <div className="w-10 bg-slate-900/50 text-slate-600 font-mono text-xs text-right py-4 pr-2 select-none border-r border-slate-900">
                    1 <br /> 2 <br /> 3 <br /> 4 <br /> 5 <br /> 6 <br /> 7 <br /> 8 <br /> 9 <br /> 10
                  </div>
                  <textarea
                    className="flex-1 bg-transparent text-emerald-400 p-4 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-700"
                    placeholder="// Ngjit ose shkruaj kodin tënd këtu për analizë ose refaktorim..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <button onClick={() => handleProcess('generate')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"><Sparkles size={14} /> Gjenero</button>
                <button onClick={() => handleProcess('explain')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 rounded-xl text-xs transition border border-slate-700/40 cursor-pointer flex items-center justify-center gap-1"><HelpCircle size={14} /> Shpjego</button>
                <button onClick={() => handleProcess('generate')} className="bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 font-medium py-2.5 rounded-xl text-xs transition border border-emerald-900/30 cursor-pointer flex items-center justify-center gap-1"><RefreshCw size={14} /> Refaktoro</button>
                <button onClick={() => handleProcess('security')} className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-medium py-2.5 rounded-xl text-xs transition border border-rose-900/30 cursor-pointer flex items-center justify-center gap-1"><ShieldAlert size={14} /> Audito</button>
              </div>
            </div>

            {/* OUTPUT PANEL */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🖥️ Rezultati Vizual (Colors Active)
                </label>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition bg-indigo-500/10 border border-indigo-500/20 py-1 px-2.5 rounded-lg cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">U Kopjua!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Kopjo Kodin</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="w-full flex-1 min-h-[350px] bg-slate-950 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-auto border border-slate-800/80 shadow-inner">
                {loading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-indigo-400 font-medium my-auto">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Blendi po ngjyros kodin...</span>
                  </div>
                ) : output ? (
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600 italic text-center text-xs sm:text-sm">
                    Kodi i gjeneruar ose shpjegimi do të ngjyroset automatikisht me ngjyra profesionale këtu.
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