import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import ChatWorkspace from './components/ChatWorkspace';
import FolderModal from './components/FolderModal';
import ProfileModal from './components/ProfileModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8085/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function App() {
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chat_sessions')) || []; } catch { return []; }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem('active_session_id') || null;
  });

  const [folders, setFolders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chat_folders')) || []; } catch { return []; }
  });

  const [sessionFolderMap, setSessionFolderMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('session_folder_map')) || {}; } catch { return {}; }
  });

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('generate');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copiedId, setCopiedId] = useState(null);

  const [newFolderName, setNewFolderName] = useState('');
  const [activeFolderMenu, setActiveFolderMenu] = useState(null);
  const [selectedFolderForModal, setSelectedFolderForModal] = useState(null);
  const [modalSelectedSessionIds, setModalSelectedSessionIds] = useState([]);

  // States për Profilin dhe Modalin e Profilit (Dinamike pa email statik)
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || '');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  useEffect(() => { localStorage.setItem('app_theme', theme); }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  useEffect(() => { localStorage.setItem('chat_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('chat_folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('session_folder_map', JSON.stringify(sessionFolderMap)); }, [sessionFolderMap]);
  useEffect(() => {
    if (activeSessionId) localStorage.setItem('active_session_id', activeSessionId);
    else localStorage.removeItem('active_session_id');
  }, [activeSessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputMessage]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Funksioni për Refresh / New Chat
  const handleNewChat = (actionType = 'generate') => {
    setActiveSessionId(null);
    setSelectedAction(actionType);
    setInputMessage('');
    setLoading(false);
  };

  const generateSmartTitle = (text, action) => {
    const cleanText = text.replace(/[\n\r]+/g, ' ').trim();
    if (cleanText.length > 0 && cleanText.length < 30 && !cleanText.includes('<!DOCTYPE')) {
      return cleanText;
    }
    const actionFormatted = action.charAt(0).toUpperCase() + action.slice(1);
    return `${actionFormatted}: ${cleanText.substring(0, 16)}...`;
  };

  const handleSendMessage = async () => {
    if (!localStorage.getItem('token')) {
      setShowAuthModal(true);
      return;
    }
    const textToSend = inputMessage.trim();
    if (!textToSend) return;

    let currentSession = activeSession;
    let targetSessionId = activeSessionId;
    const currentActionToUse = currentSession ? currentSession.action : selectedAction;
    const smartTitle = generateSmartTitle(textToSend, currentActionToUse);

    if (!currentSession) {
      targetSessionId = 'session_' + Date.now();
      currentSession = {
        id: targetSessionId,
        title: smartTitle,
        action: selectedAction,
        language: selectedAction === 'generate' ? selectedLanguage : 'auto',
        messages: []
      };
      setSessions((prev) => [currentSession, ...prev]);
      setActiveSessionId(targetSessionId);
    }

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    const updatedMessages = [...currentSession.messages, userMsg];
    
    setSessions((prev) =>
      prev.map((s) => 
        s.id === targetSessionId 
          ? { ...s, title: s.title === 'New Workspace' ? smartTitle : s.title, messages: updatedMessages } 
          : s
      )
    );

    setInputMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const response = await api.post(
        '/ai/process',
        {
          action_type: currentSession.action,
          user_input: textToSend,
          language_used: currentSession.action === 'generate' ? currentSession.language : 'auto'
        },
        { headers: getAuthHeader() }
      );

      if (response.data?.success && response.data?.data) {
        const aiResponseText = response.data.data.ai_response || response.data.response || 'No response';
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiResponseText };
        setSessions((prev) =>
          prev.map((s) => s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s)
        );
      } else {
        const errAiMsg = { id: Date.now() + 1, sender: 'ai', text: '// Error: Invalid server response.' };
        setSessions((prev) =>
          prev.map((s) => s.id === targetSessionId ? { ...s, messages: [...s.messages, errAiMsg] } : s)
        );
      }
    } catch (error) {
      const errAiMsg = { id: Date.now() + 1, sender: 'ai', text: '// Error connecting to server.' };
      setSessions((prev) =>
        prev.map((s) => s.id === targetSessionId ? { ...s, messages: [...s.messages, errAiMsg] } : s)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    if (!confirm('Delete this workspace?')) return;
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setLoading(false);
    }
    setSessionFolderMap((prev) => {
      const copy = { ...prev };
      delete copy[sessionId];
      return copy;
    });
  };

  const handleCreateFolder = () => {
    const folderName = newFolderName.trim();
    if (!folderName || folders.includes(folderName)) return;
    setFolders((prev) => [...prev, folderName]);
    setNewFolderName('');
  };

  const handleDeleteFolder = (folderName) => {
    if (!confirm(`Delete folder "${folderName}"?`)) return;
    const sessionIdsToDelete = Object.keys(sessionFolderMap).filter(
      (sessionId) => sessionFolderMap[sessionId] === folderName
    );
    setSessions((prev) => prev.filter((s) => !sessionIdsToDelete.includes(s.id)));
    if (sessionIdsToDelete.includes(activeSessionId)) {
      setActiveSessionId(null);
      setLoading(false);
    }
    setSessionFolderMap((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => { if (copy[k] === folderName) delete copy[k]; });
      return copy;
    });
    setFolders((prev) => prev.filter((f) => f !== folderName));
  };

  const openFolderSelectionModal = (folderName) => {
    setSelectedFolderForModal(folderName);
    const currentInFolder = sessions
      .filter((s) => sessionFolderMap[s.id] === folderName)
      .map((s) => s.id);
    setModalSelectedSessionIds(currentInFolder);
    setActiveFolderMenu(null);
  };

  const handleSaveModalSelection = () => {
    setSessionFolderMap((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((sessionId) => {
        if (copy[sessionId] === selectedFolderForModal) delete copy[sessionId];
      });
      modalSelectedSessionIds.forEach((sessionId) => {
        copy[sessionId] = selectedFolderForModal;
      });
      return copy;
    });
    setSelectedFolderForModal(null);
  };

  const handleCopyText = async (text, id) => {
    const cleanText = text.replace(/```[a-z]*\n/gi, '').replace(/```/g, '');
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      alert('Failed to copy');
    }
  };

  const [showAuthModal, setShowAuthModal] = useState(!localStorage.getItem('token'));
  const [isLoginView, setIsLoginView] = useState(true);

  // Përditësim i handleAuthSuccess për të marrë emrin dhe e-mailin e vërtetë nga backend
  const handleAuthSuccess = (name, email) => {
    setUserName(name || 'User');
    setUserEmail(email || '');
    if (name) localStorage.setItem('user_name', name);
    if (email) localStorage.setItem('user_email', email);
    setShowAuthModal(false);
  };

  const handleUpdateProfile = (newFullName, newEmail) => {
    setUserName(newFullName);
    setUserEmail(newEmail);
    localStorage.setItem('user_name', newFullName);
    localStorage.setItem('user_email', newEmail);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserName('');
    setUserEmail('');
    setSessions([]);
    setActiveSessionId(null);
    setFolders([]);
    setSessionFolderMap({});
    setLoading(false);
    setShowAuthModal(true);
    setIsLoginView(true);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden ${isDark ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-[#d9dbe3] text-[#333333]'}`}>
      
      {/* Navbar i Përditësuar me Profilin e Klikueshëm */}
      <Navbar 
        handleNewChat={handleNewChat} 
        isDark={isDark} 
        userName={userName}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {showAuthModal && (
        <AuthModal isLoginView={isLoginView} setIsLoginView={setIsLoginView} onAuthSuccess={handleAuthSuccess} />
      )}

      <FolderModal
        isDark={isDark}
        selectedFolderForModal={selectedFolderForModal}
        setSelectedFolderForModal={setSelectedFolderForModal}
        sessions={sessions}
        modalSelectedSessionIds={modalSelectedSessionIds}
        setModalSelectedSessionIds={setModalSelectedSessionIds}
        handleSaveModalSelection={handleSaveModalSelection}
      />

      {/* Modal-i i Profilit dhe Security */}
      {showProfileModal && (
        <ProfileModal
          isDark={isDark}
          userName={userName}
          userEmail={userEmail}
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      <div className="flex flex-1 relative z-10 overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar
          isDark={isDark}
          sessions={sessions}
          activeSessionId={activeSessionId}
          folders={folders}
          sessionFolderMap={sessionFolderMap}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          activeFolderMenu={activeFolderMenu}
          setActiveFolderMenu={setActiveFolderMenu}
          handleNewChat={handleNewChat}
          handleCreateFolder={handleCreateFolder}
          handleDeleteFolder={handleDeleteFolder}
          openFolderSelectionModal={openFolderSelectionModal}
          handleDeleteSession={handleDeleteSession}
          setActiveSessionId={setActiveSessionId}
          setSelectedAction={setSelectedAction}
          setLoading={setLoading}
          userName={userName}
          handleLogout={handleLogout}
        />

        <ChatWorkspace
          isDark={isDark}
          activeSession={activeSession}
          selectedAction={selectedAction}
          toggleTheme={toggleTheme}
          copiedId={copiedId}
          handleCopyText={handleCopyText}
          loading={loading}
          chatEndRef={chatEndRef}
          textareaRef={textareaRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setSessions={setSessions}
        />
      </div>
    </div>
  );
}

export default App;