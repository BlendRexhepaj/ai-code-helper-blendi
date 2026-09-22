import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Sparkles, HelpCircle, ShieldAlert, CornerDownLeft, Trash2, Copy, Check, Code } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Metoda që simulon procesimin e kërkesës në UI bazë
  const handleProcess = (actionType) => {
    if (!query.trim()) {
      alert("Ju lutem shkruani një pyetje ose vendosni kod në fushën e inputit!");
      return;
    }
    
    setLoading(true);
    setOutput('');

    setTimeout(() => {
      setLoading(false);
      if (actionType === 'generate') {
        setOutput(`// AI Kodi i Gjeneruar bazuar në kërkesën tuaj:\n\nfunction llogaritMbledhjen(a, b) {\n    // Kontrolli bazë për siguri të të dhënave\n    if (typeof a !== 'number' || typeof b !== 'number') {\n        throw new Error("Inputet duhet të jenë numra");\n    }\n    return a + b;\n}`);
      } else if (actionType === 'explain') {
        setOutput(`// AI Shpjegimi i Kodit:\n1. Funksioni pranon dy parametra (a dhe b).\n2. Ekzekutohet një kontroll sigurie kibernetike për të parandaluar gabimet e tipit të të dhënave (Type Juggling).\n3. Kthehet rezultati i mbledhjes në mënyrë të sigurt.`);
      } else if (actionType === 'security') {
        setOutput(`// Raporti i Sigurisë Digjitale v1.1:\n[STATUS] Skanimi përfundoi.\n[GJETJE] Nuk u detektuan dobësi kritike të tipit SQL Injection apo XSS.\n[SUGJERIM] Gjithmonë sanitizoni inputet përpara procesimit në Backend.`);
      }
    }, 1500);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* NAVBAR KOMPONENTI */}
      <Navbar />

      {/* HOME PAGE MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* HERO SECTION / DASHBOARD HEADER */}
        <section className="text-center md:text-left md:flex md:items-center md:justify-between border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              Mirësevini në Qendrën e Inteligjencës <Sparkles className="text-indigo-400 w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gjeneroni kod, kërkoni shpjegime të detajuara dhe auditoni sigurinë kibernetike në kohë reale.
            </p>
          </div>
        </section>

        {/* RESPONSIVE GRID WORKSPACE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1">
          
          {/* INPUT PANEL (FUSHA PËR PYETJE / KOD) */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Code size={14} className="text-indigo-400" /> Paneli i Inputit
                </label>
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-slate-800/50"
                    title="Fshij inputin"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="relative flex-1 min-h-[320px] lg:min-h-[400px] flex flex-col">
                <textarea
                  className="w-full flex-1 bg-slate-950/80 text-emerald-400 p-4 rounded-xl font-mono text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-600 shadow-inner"
                  placeholder="// Shkruaj pyetjen tënde këtu ose ngjit kodin që dëshiron të shpjegosh..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800/50">
                  Shtyp butonat më poshtë <CornerDownLeft size={10} />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (RESPONSIVE GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <button
                onClick={() => handleProcess('generate')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Sparkles size={16} /> Gjenero Kod
              </button>
              
              <button
                onClick={() => handleProcess('explain')}
                className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 border border-slate-700/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle size={16} /> Shpjegim
              </button>
              
              <button
                onClick={() => handleProcess('security')}
                className="w-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 border border-rose-900/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert size={16} /> Audito Sigurinë
              </button>
            </div>
          </div>

          {/* OUTPUT PANEL (BOX PËR PËRGJIGJE) */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                🖥️ Përgjigjja nga Asistenti
              </label>
              
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 border border-indigo-500/20 py-1 px-2.5 rounded-lg font-medium cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" /> <span className="text-emerald-400">U Kopjua!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> <span>Kopjo Kodin</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="w-full flex-1 min-h-[320px] lg:min-h-[400px] bg-slate-950 text-slate-300 p-4 rounded-xl font-mono text-sm overflow-auto border border-slate-800 whitespace-pre-wrap flex flex-col justify-between shadow-inner">
              {loading ? (
                <div className="flex items-center gap-3 text-indigo-400 font-medium text-center m-auto">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  Blendi po analizon kërkesën...
                </div>
              ) : output ? (
                <div>{output}</div>
              ) : (
                <div className="text-slate-600 italic text-center m-auto max-w-xs text-xs sm:text-sm">
                  Shkruani një pyetje në fushën e majtë dhe zgjidhni një nga veprimet për të parë rezultatin këtu.
                </div>
              )}
            </div>
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center border-t border-slate-900/80 py-4 text-xs text-slate-500 bg-slate-950">
        © 2026 AI Code Helper (Blendi) — Të gjitha të drejtat e rezervuara.
      </footer>
    </div>
  );
}

export default App;