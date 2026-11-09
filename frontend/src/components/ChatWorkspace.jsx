import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatWorkspace({
  isDark,
  activeSession,
  selectedAction,
  copiedId,
  handleCopyText,
  loading,
  chatEndRef,
  textareaRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  selectedLanguage,
  setSelectedLanguage
}) {
  const currentAction = activeSession?.action || selectedAction;

  const renderMessageContent = (text, currentLang = 'javascript') => {
    if (!text) return null;

    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <p key={lastIndex} className={`whitespace-pre-wrap mb-2 ${isDark ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>
            {text.substring(lastIndex, match.index)}
          </p>
        );
      }

      const lang = match[1] || currentLang || 'javascript';
      const codeString = match[2].trim();

      parts.push(
        <div key={match.index} className="my-3 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="bg-[#2d2d2d] px-4 py-1.5 text-[11px] text-purple-400 font-mono font-semibold flex items-center justify-between border-b border-slate-700 select-none">
            <span>{lang.toUpperCase()}</span>
          </div>
          <SyntaxHighlighter
            language={lang.toLowerCase()}
            style={vscDarkPlus}
            showLineNumbers={true}
            lineNumberStyle={{ color: '#858585', fontSize: '11px', paddingRight: '1em', minWidth: '2.5em', textAlign: 'right' }}
            customStyle={{ margin: 0, padding: '1rem', fontSize: '12px', background: '#1e1e1e', lineHeight: '1.6' }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      
      if (parts.length === 0) {
        return (
          <div className="my-2 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="bg-[#2d2d2d] px-4 py-1.5 text-[11px] text-purple-400 font-mono font-semibold flex items-center justify-between border-b border-slate-700 select-none">
              <span>{(currentLang || 'CODE').toUpperCase()}</span>
            </div>
            <SyntaxHighlighter
              language={(currentLang || 'javascript').toLowerCase()}
              style={vscDarkPlus}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#858585', fontSize: '11px', paddingRight: '1em', minWidth: '2.5em', textAlign: 'right' }}
              customStyle={{ margin: 0, padding: '1rem', fontSize: '12px', background: '#1e1e1e', lineHeight: '1.6' }}
            >
              {text.trim()}
            </SyntaxHighlighter>
          </div>
        );
      }

      parts.push(
        <p key={lastIndex} className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>
          {remainingText}
        </p>
      );
    }

    return parts;
  };

  return (
    <main className={`flex-1 flex flex-col relative h-full overflow-hidden transition-colors premium-bg code-grid-bg ${isDark ? 'bg-[#151518]' : 'bg-[#d9dbe3]'}`}>
      
      {/* Stilët e brendshme statike për sfondin premium */}
      <style>{`
        .premium-bg {
          position: relative;
          overflow: hidden;
        }
        .premium-bg::before,
        .premium-bg::after {
          content: '';
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          z-index: 0;
          opacity: 0.12;
          pointer-events: none;
        }
        .premium-bg::before {
          top: 10%;
          left: 20%;
          background: #9333ea;
        }
        .premium-bg::after {
          bottom: 10%;
          right: 20%;
          background: #4f46e5;
        }
        .code-grid-bg {
          background-image: radial-gradient(rgba(147, 51, 234, 0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto relative z-10">
        {!activeSession || activeSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl backdrop-blur-md ${
              isDark ? 'bg-purple-900/30 border border-purple-700/40 text-purple-300' : 'bg-[#c4c7d4] border border-slate-400 text-purple-800'
            }`}>
              ✨
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                How can I help you with your code today?
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Active mode: <strong className="text-purple-600 dark:text-purple-400 uppercase">{currentAction}</strong>. Type your request below!
              </p>
            </div>
          </div>
        ) : (
          activeSession.messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-3xl w-full rounded-2xl p-4 text-sm shadow-xl backdrop-blur-sm ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none max-w-2xl shadow-purple-500/20 font-medium'
                  : isDark 
                    ? 'bg-[#212124]/90 border border-slate-700/80 text-slate-200 rounded-bl-none' 
                    : 'bg-[#c4c7d4]/90 border border-slate-400 text-slate-900 rounded-bl-none shadow-sm'
              }`}>
                <div className={`flex items-center justify-between mb-2 pb-2 border-b text-[11px] font-bold ${
                  isDark ? 'border-slate-700/80 text-purple-400' : 'border-slate-400 text-purple-800'
                }`}>
                  <span className="uppercase tracking-wider">
                    {msg.sender === 'user' ? 'Your Request' : 'AI Assistant'}
                  </span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="hover:underline transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? '✔ Copied!' : '📋 Copy Code'}
                    </button>
                  )}
                </div>
                
                <div className="font-mono text-xs leading-relaxed">
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderMessageContent(msg.text, selectedLanguage)
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-start">
            <div className={`rounded-2xl p-4 rounded-bl-none flex items-center gap-3 border backdrop-blur-sm ${
              isDark ? 'bg-[#212124]/90 border-slate-700 text-slate-300' : 'bg-[#c4c7d4] border-slate-400 text-slate-900 shadow-sm'
            }`}>
              <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
              <p className="text-xs animate-pulse font-medium">Ollama is generating response...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t backdrop-blur-xl shrink-0 transition-colors relative z-20 ${
        isDark ? 'bg-[#18181b]/95 border-slate-800/80' : 'bg-[#d0d3df]/95 border-slate-400/50'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Mode: <strong className="text-purple-600 dark:text-purple-400 uppercase">{currentAction}</strong>
            </span>

            {/* Language Dropdown shfaqet VETËM kur aksioni është 'generate' */}
            {currentAction === 'generate' ? (
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`text-xs px-3 py-1.5 pr-8 rounded-xl border outline-none appearance-none cursor-pointer font-semibold transition-all duration-200 ${
                    isDark 
                      ? 'bg-[#252526] border-slate-700 text-slate-200 hover:border-purple-500' 
                      : 'bg-[#c4c7d4] border-slate-400 text-slate-900 hover:border-purple-600 shadow-sm'
                  }`}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="php">PHP (Laravel)</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : (
              /* Kur aksioni nuk është generate (Explain, Refactor, Audit), tregon që gjuha detektohet automatikisht */
              <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/50 px-2.5 py-1 rounded-lg">
                Language: Auto-Detect
              </span>
            )}
          </div>

          <div className={`relative flex items-center rounded-2xl p-2 border shadow-xl transition-all ${
            isDark 
              ? 'bg-[#212124] border-slate-700 focus-within:border-purple-500 shadow-black/30' 
              : 'bg-[#c4c7d4] border-slate-400 focus-within:border-purple-600 shadow-md'
          }`}>
            <textarea
              ref={textareaRef}
              rows="1"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your request here (Press Enter to send)..."
              className={`w-full bg-transparent text-sm px-3 py-2 focus:outline-none resize-none max-h-[180px] font-medium ${
                isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-900 placeholder-slate-700'
              }`}
            />

            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition cursor-pointer ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}