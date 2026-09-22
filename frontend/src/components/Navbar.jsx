import React from 'react';
import { Terminal, Code2, ShieldCheck, User } from 'lucide-react';

function Navbar() {
  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Terminal size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              AI Code Helper <span className="text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">v1.1</span>
            </span>
          </div>
        </div>

        {/* MIDDLE LINKS - VISIBLE ON DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#home" className="text-indigo-400 border-b-2 border-indigo-500 pb-1 px-1 transition-all">Asistenti</a>
          <a href="#security" className="hover:text-slate-200 transition-all flex items-center gap-1"><ShieldCheck size={16} /> Auditimi</a>
          <a href="#docs" className="hover:text-slate-200 transition-all flex items-center gap-1"><Code2 size={16} /> Dokumentacioni</a>
        </div>

        {/* USER PROFILE INFO */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 py-1.5 px-3 rounded-full">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Developer: Blendi</span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;