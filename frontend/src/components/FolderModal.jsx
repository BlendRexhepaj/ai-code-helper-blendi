import React from 'react';

export default function FolderModal({
  isDark,
  selectedFolderForModal,
  setSelectedFolderForModal,
  sessions,
  modalSelectedSessionIds,
  setModalSelectedSessionIds,
  handleSaveModalSelection
}) {
  if (!selectedFolderForModal) return null;

  const toggleSessionSelection = (sessionId) => {
    setModalSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
        isDark ? 'bg-[#252526] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h3 className="font-semibold text-sm tracking-wide">
              Manage Chats in: <span className="text-purple-400 font-bold">{selectedFolderForModal}</span>
            </h3>
          </div>
          <button
            onClick={() => setSelectedFolderForModal(null)}
            className="text-slate-400 hover:text-white text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-slate-400 mb-3">Select the chats you want to save in this folder:</p>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No chats available to add.</p>
          ) : (
            sessions.map((session) => {
              const isChecked = modalSelectedSessionIds.includes(session.id);
              return (
                <div
                  key={session.id}
                  onClick={() => toggleSessionSelection(session.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all duration-150 ${
                    isChecked
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 shadow-sm'
                      : isDark
                      ? 'bg-[#1e1e1e] border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-slate-400">📄</span>
                    <span className="truncate font-medium">{session.title || 'Untitled Workspace'}</span>
                  </div>

                  {/* Checkmark */}
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    isChecked
                      ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                      : 'border-slate-600 bg-transparent'
                  }`}>
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => setSelectedFolderForModal(null)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveModalSelection}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-md transition cursor-pointer"
          >
            Save Selections
          </button>
        </div>

      </div>
    </div>
  );
}