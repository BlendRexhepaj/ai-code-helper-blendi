import React from 'react';

export default function Navbar({ handleNewChat, isDark, userName, onOpenProfile }) {
  return (
    <header className={`h-16 px-6 border-b flex items-center justify-between select-none shrink-0 backdrop-blur-xl transition-all duration-300 z-30 ${
      isDark 
        ? 'bg-[#1e1e1e]/95 border-slate-800/80 text-slate-100 shadow-lg shadow-black/20' 
        : 'bg-[#d0d3df]/95 border-slate-400/70 text-slate-900 shadow-md shadow-slate-900/5'
    }`}>
      
      {/* 1. Brand Logo & Title Area */}
      <div className="flex items-center gap-3.5">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/25 font-mono font-bold text-xl border border-white/20">
            &gt;_
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 dark:from-purple-300 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
            AI Code Helper
          </h1>
        </div>
      </div>

      {/* 2. Actions & User Profile Area */}
      <div className="flex items-center gap-3">
        
        {/* Butoni New Chat */}
        <button
          onClick={() => handleNewChat('generate')}
          title="Start a new chat (Refresh Workspace)"
          className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-sm active:scale-95 cursor-pointer ${
            isDark
              ? 'bg-[#252526] border-slate-700/80 text-slate-100 hover:bg-purple-600/20 hover:border-purple-500/80 hover:text-purple-300 shadow-purple-900/10'
              : 'bg-[#c4c7d4] border-slate-400 text-slate-950 hover:bg-[#b5b8c8] hover:border-purple-600 hover:text-purple-900 shadow-slate-900/5'
          }`}
        >
          <svg 
            className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform duration-500 group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="tracking-wide">New Chat</span>
        </button>

        {/* Separator Line */}
        <div className="h-6 w-[1px] bg-slate-400/60 dark:bg-slate-700/80 mx-1"></div>

        {/* KLIKABLE: Developer Profile Badge */}
        <div 
          onClick={onOpenProfile}
          title="Click to edit profile & account settings"
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 ${
            isDark 
              ? 'bg-[#252526]/80 border-slate-700/80 hover:border-purple-500 text-slate-200' 
              : 'bg-[#c4c7d4]/80 border-slate-400/80 hover:border-purple-600 text-slate-950 shadow-sm'
          }`}
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-purple-500/30">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#d0d3df] dark:border-[#1e1e1e] rounded-full"></span>
          </div>
          <span className="text-xs font-bold tracking-tight">
            <span className="text-slate-600 dark:text-slate-400 font-semibold mr-1">User:</span>
            <strong className="text-slate-950 dark:text-white font-extrabold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
              {userName || 'Account'}
            </strong>
          </span>
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>

      </div>
    </header>
  );
}