import React, { useState } from 'react';

export default function Sidebar({
  isDark,
  sessions,
  activeSessionId,
  folders,
  sessionFolderMap,
  newFolderName,
  setNewFolderName,
  handleNewChat,
  handleCreateFolder,
  handleDeleteFolder,
  openFolderSelectionModal,
  handleDeleteSession,
  setActiveSessionId,
  setSelectedAction,
  setLoading,
  userName,
  handleLogout
}) {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolderExpand = (folderName) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const unassignedSessions = sessions.filter((s) => !sessionFolderMap[s.id]);

  return (
    <aside className={`w-72 flex flex-col justify-between border-r select-none h-full shrink-0 transition-colors ${
      isDark ? 'bg-[#1e1e1e] border-slate-800 text-slate-300' : 'bg-[#d9dbe3] border-slate-400/50 text-slate-900'
    }`}>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        
        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2.5 px-1">NEW SESSION:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'generate', label: 'Generate', icon: '✨' },
              { id: 'explain', label: 'Explain', icon: '📖' },
              { id: 'refactor', label: 'Refactor', icon: '⚡' },
              { id: 'audit', label: 'Audit', icon: '🛡️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNewChat(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#252526] border-slate-700 text-slate-300 hover:border-purple-500 hover:text-purple-400'
                    : 'bg-[#c4c7d4] border-slate-400/60 text-slate-900 shadow-sm hover:border-purple-600 hover:text-purple-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-1">FOLDERS</p>
          
          <div className="flex items-center gap-1.5 mb-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              placeholder="New folder..."
              className={`w-full text-xs px-3 py-2 rounded-xl border outline-none font-medium ${
                isDark 
                  ? 'bg-[#252526] border-slate-700 text-slate-200 placeholder-slate-500 focus:border-purple-500' 
                  : 'bg-[#c4c7d4] border-slate-400 text-slate-900 placeholder-slate-600 focus:border-purple-600 shadow-sm'
              }`}
            />
            <button
              onClick={handleCreateFolder}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-sm"
            >
              +
            </button>
          </div>

          <div className="space-y-1.5">
            {folders.map((folder) => {
              const isOpen = openFolders[folder];
              const folderSessions = sessions.filter((s) => sessionFolderMap[s.id] === folder);

              return (
                <div key={folder} className={`rounded-xl overflow-hidden border ${
                  isDark ? 'border-slate-800 bg-[#252526]/50' : 'border-slate-400/50 bg-[#cdd0dc] shadow-sm'
                }`}>
                  <div 
                    className={`flex items-center justify-between p-2.5 text-xs font-medium cursor-pointer transition ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-[#c4c7d4]'
                    }`}
                    onClick={() => toggleFolderExpand(folder)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-purple-700 dark:text-purple-400">{isOpen ? '📂' : '📁'}</span>
                      <span className={`truncate font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{folder}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-[#b8bcd0] text-slate-800'}`}>
                        {folderSessions.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFolderSelectionModal(folder);
                        }}
                        title="Add/Manage Chats"
                        className="p-1 hover:bg-purple-600/20 text-purple-700 dark:text-purple-400 rounded-lg transition font-bold"
                      >
                        ➕
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder);
                        }}
                        title="Delete Folder"
                        className="p-1 hover:bg-red-500/10 text-slate-600 hover:text-red-600 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className={`pl-6 pr-2 py-1.5 space-y-1 border-t ${
                      isDark ? 'border-slate-800 bg-[#1e1e1e]/60' : 'border-slate-400/40 bg-[#c4c7d4]'
                    }`}>
                      {folderSessions.length === 0 ? (
                        <p className="text-[11px] text-slate-600 italic py-1">Kliko + për të shtuar biseda</p>
                      ) : (
                        folderSessions.map((session) => (
                          <div
                            key={session.id}
                            onClick={() => {
                              setActiveSessionId(session.id);
                              setSelectedAction(session.action);
                              setLoading(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition font-medium ${
                              activeSessionId === session.id
                                ? 'bg-purple-600/30 text-purple-900 dark:text-purple-300 font-bold'
                                : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-900 hover:bg-[#b8bcd0] hover:text-black'
                            }`}
                          >
                            <span className="truncate">{session.title}</span>
                            <button
                              onClick={(e) => handleDeleteSession(e, session.id)}
                              className="text-slate-600 hover:text-red-600 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-1">EXPLORER HISTORY</p>
          <div className="space-y-1">
            {unassignedSessions.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-1 py-1">Nuk ka biseda jashtë folderave.</p>
            ) : (
              unassignedSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setSelectedAction(session.action);
                    setLoading(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition font-medium ${
                    activeSessionId === session.id
                      ? 'bg-purple-600/30 border-purple-500 text-purple-900 dark:text-purple-300 font-bold'
                      : isDark 
                        ? 'bg-[#252526] border-slate-800 text-slate-300 hover:bg-slate-800' 
                        : 'bg-[#c4c7d4] border-slate-400 text-slate-900 shadow-sm hover:bg-[#b8bcd0]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>📄</span>
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="text-slate-600 hover:text-red-600 text-xs px-1 transition"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className={`p-4 border-t ${isDark ? 'border-slate-800 bg-[#252526]' : 'border-slate-400/50 bg-[#d0d3df]'}`}>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold transition text-center cursor-pointer border border-red-500/30"
        >
          [→ Sign Out ({userName || 'Blend Rexhepaj'})
        </button>
      </div>

    </aside>
  );
}