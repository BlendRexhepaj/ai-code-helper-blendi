import React, { useState } from 'react';
import { Code, Terminal, ShieldAlert, Sparkles, History, HelpCircle } from 'lucide-react';

function App() {
  const [inputCode, setInputCode] = useState('');
  const [output, setOutput] = useState('Rezultati nga AI do të shfaqet këtu pasi të zgjidhni një opsion...');
  const [loading, setLoading] = useState(false);

  const handleAction = (actionType) => {
    setLoading(true);
    setOutput(`Duke procesuar kërkesën për: [${actionType.toUpperCase()}]...`);
    
    // Simulim për Java 1 (Në javët e ardhshme do të lidhet me Laravel API)
    setTimeout(() => {
      setLoading(false);
      if (actionType === 'explain') {
        setOutput(`// AI Shpjegimi:\nKy kod ekzekuton një funksion asinkron. \nJu keni përdorur strukturën e duhur por sigurohuni të menaxhoni gabimet me try-catch.`);
      } else if (actionType === 'generate') {
        setOutput(`// AI Kodi i Gjeneruar:\nfunction salutation(emri) {\n    return "Përshëndetje " + emri + ", mirësevini në AI Code Helper!";\n}`);
      } else {
        setOutput(`// Raporti i Sigurisë Kibernetike:\n[OK] Nuk u gjetën injektime direkte.\n[KSHILLË] Sigurohuni që variablat mos të ekspozohen globalisht.`);
      }
    }, 1200);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-slate-100">
      {/* SIDEBAR FOR HISTORY */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Terminal className="text-indigo-400 w-6 h-6" />
            <h1 className="text-xl font-bold tracking-wider text-white">AI Helper <span className="text-indigo-400 text-xs">v1.0</span></h1>
          </div>
          
          <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <History size={14} /> Historiku i Kodit
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50 text-xs cursor-pointer hover:bg-slate-800 text-slate-300 truncate">
              🚀 Llogaritja e TVSH-së në JS
            </div>
            <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50 text-xs cursor-pointer hover:bg-slate-800 text-slate-300 truncate">
              🔒 Validimi i Formës në PHP
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-4">
          Zhvilluar nga: <span className="text-slate-300 font-medium">Blendi</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Mirësevini Blendi <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
            </h2>
            <p className="text-slate-400 text-sm">Shkruani kodin tuaj dhe lejoni AI të bëjë pjesën tjetër.</p>
          </div>
        </header>

        {/* WORKSPACE: INPUT & OUTPUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {/* INPUT PANEL */}
          <div className="bg-editorBg rounded-xl border border-slate-700/60 p-4 flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Code size={16} className="text-indigo-400" /> Shkruaj ose Ngjit Kodin/Prompt-in këtu:
            </label>
            <textarea
              className="w-full flex-1 min-h-[300px] bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none border border-slate-800"
              placeholder="// Shkruaj një kërkesë ose vendos kodin këtu..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            
            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button 
                onClick={() => handleAction('generate')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-1">
                <Sparkles size={16} /> Gjenero
              </button>
              <button 
                onClick={() => handleAction('explain')}
                className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-1">
                <HelpCircle size={16} /> Shpjego
              </button>
              <button 
                onClick={() => handleAction('security')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition flex items-center justify-center gap-1">
                <ShieldAlert size={16} /> Audito Sigurinë
              </button>
            </div>
          </div>

          {/* OUTPUT PANEL */}
          <div className="bg-editorBg rounded-xl border border-slate-700/60 p-4 flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-2">
              🖥️ Rezultati nga Asistenti AI:
            </label>
            <div className="w-full flex-1 min-h-[300px] bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-sm overflow-auto border border-slate-800 whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-2 text-indigo-400">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  Duke u menduar...
                </div>
              ) : output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;