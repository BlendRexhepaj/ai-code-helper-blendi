import React, { useState } from 'react';
import { Copy, Check, Edit3, Save } from 'lucide-react';

export default function CodeBlock({ initialCode, language }) {
    const [isEditing, setIsEditing] = useState(false);
    const [code, setCode] = useState(initialCode);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-200 text-sm">
                <span className="font-mono uppercase text-xs text-purple-400">{language || 'code'}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition text-white"
                    >
                        {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition text-white"
                    >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
            </div>
            <div className="p-4">
                {isEditing ? (
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 bg-gray-950 text-green-400 font-mono text-sm p-3 rounded border border-purple-500 focus:outline-none resize-y"
                    />
                ) : (
                    <pre className="text-gray-100 font-mono text-sm overflow-x-auto p-2">
                        <code>{code}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}