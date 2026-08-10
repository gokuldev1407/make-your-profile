import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, MessageSquare, ArrowLeft } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { api } from '../api';
import PortfolioView from './PortfolioView';
import FormEditor from './FormEditor';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AiEditor: React.FC = () => {
  const { data, saveData, theme, setMode } = usePortfolio();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi! I'm your AI Portfolio Assistant. Tell me what you'd like to change about your resume or portfolio. For example: 'Add React to my skills', 'Rewrite my bio to sound more professional', or 'Add a new project about an e-commerce store'." }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'form'>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'ai') scrollToBottom();
  }, [messages, isProcessing, activeTab]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const updatedData = await api.aiUpdateProfile(data, userMessage.content);
      await saveData(updatedData);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've updated your profile! You should see the changes in the preview immediately."
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I ran into an error while updating your profile. Please try again."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen pt-20 pb-4 px-4 gap-4 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* ── Live Preview — bubble card ─────────────────────────── */}
      <div className="bubble-card lg:w-2/3 h-full flex-shrink-0" style={{ minHeight: 0 }}>
        <div className={`bubble-card-inner h-full overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          <PortfolioView />
        </div>
      </div>

      {/* ── Editor Sidebar — bubble card ──────────────────────── */}
      <div className="bubble-card lg:w-1/3 h-full flex-shrink-0" style={{ minHeight: 0 }}>
        <div className={`bubble-card-inner h-full flex flex-col ${
          isDark
            ? 'bg-slate-900'
            : 'bg-[linear-gradient(145deg,rgba(157,245,249,0.96),rgba(199,220,255,0.96),rgba(228,212,255,0.96),rgba(255,204,240,0.96))] backdrop-blur-xl'
        }`}>

          {/* Tabs */}
          <div className={`flex items-center border-b ${isDark ? 'border-slate-700/60' : 'border-white/40'}`}>
            <button
              onClick={() => setMode('preview')}
              className={`p-3.5 border-r transition-colors ${
                isDark ? 'border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-white/40 text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Back to Preview"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 relative transition-all duration-200 ${
                activeTab === 'ai'
                  ? isDark
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'bubble-tab-active border-b-2 border-transparent'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
                    : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
              }`}
            >
              <MessageSquare size={15} /> AI Chat
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 relative transition-all duration-200 ${
                activeTab === 'form'
                  ? isDark
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'bubble-tab-active border-b-2 border-transparent'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
                    : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
              }`}
            >
              <FileText size={15} /> Manual Form
            </button>
          </div>

          {activeTab === 'ai' ? (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar bubble */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                        : isDark
                          ? 'bg-slate-800 text-indigo-400 ring-1 ring-indigo-500/30'
                          : 'bg-white/80 text-indigo-600 shadow-indigo-100 ring-1 ring-indigo-200/50'
                    }`}>
                      {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                    </div>
                    {/* Message bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                        : isDark
                          ? 'bg-slate-800 text-slate-200 rounded-tl-sm ring-1 ring-slate-700/50'
                          : 'bg-white/80 text-slate-800 rounded-tl-sm ring-1 ring-white/80 backdrop-blur-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isDark ? 'bg-slate-800 text-indigo-400' : 'bg-white/80 text-indigo-600 ring-1 ring-indigo-200/50'
                    }`}>
                      <Bot size={15} />
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2 text-sm ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-white/80 text-slate-700 ring-1 ring-white/80'
                    }`}>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-3 border-t ${isDark ? 'border-slate-700/60 bg-slate-900/80' : 'border-white/40 bg-white/20 backdrop-blur-md'}`}>
                <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    placeholder="Ask AI to change your profile..."
                    disabled={isProcessing}
                    rows={1}
                    style={{ minHeight: '44px' }}
                    className={`flex-1 pl-4 pr-12 py-3 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/60 transition-all text-sm overflow-y-auto ${
                      isDark
                        ? 'bg-slate-800 text-white placeholder-slate-400 border border-slate-700/60'
                        : 'bg-white/70 text-slate-900 placeholder-slate-400 border border-white/60 backdrop-blur-sm shadow-inner'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !input.trim()}
                    className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                  >
                    <Send size={14} className={input.trim() && !isProcessing ? 'translate-x-[1px]' : ''} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <FormEditor />
          )}
        </div>
      </div>

    </div>
  );
};

export default AiEditor;
