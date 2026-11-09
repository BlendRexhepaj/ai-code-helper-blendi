import React, { useState } from 'react';
import { User, Mail, ShieldAlert, Trash2, X } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8085/api';

export default function ProfileModal({ isDark, userName, userEmail, onClose, onUpdateProfile }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' ose 'security'
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(name, email);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone!'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        alert('Your account has been deleted permanently.');
        localStorage.clear();
        window.location.reload(); // Rifreskon aplikacionin dhe kthen te Login
      }
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative transition-all ${
        isDark ? 'bg-[#1e1e1e] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold">{userName || 'User Profile'}</h2>
              <p className="text-xs text-slate-400">Account & Security Settings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/40 rounded-xl mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'security' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & Danger Zone
          </button>
        </div>

        {message && (
          <div className="mb-3 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium">
            ✅ {message}
          </div>
        )}

        {/* Tab 1: Profile Info */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">FULL NAME / USERNAME</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Delete Account */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold mb-1">
                <ShieldAlert className="w-5 h-5" /> Delete Account
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Once you delete your account, there is no going back. All your data and saved workspace code prompts will be permanently removed.
              </p>
              
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}