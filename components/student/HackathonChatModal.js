'use client';

import { useEffect, useRef, useState } from 'react';
import { aiChat } from '@/lib/api';
import { stripMarkdown } from '@/lib/utils';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';

const JUDGING_AXES = ['Problem Solving', 'Innovation', 'Impact', 'Presentation'];

const STARTER_PROMPTS = [
  'Help me brainstorm an idea for this hackathon',
  'I have an idea — score it against the judging criteria',
  'Draft an MVP plan sized to the dates',
  'Walk me through a winning pitch structure',
];

export default function HackathonChatModal({ hackathon, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const hackathonId = hackathon?._id || hackathon?.id;

  useEffect(() => {
    if (!hackathonId) return;
    let cancelled = false;
    (async () => {
      try {
        const history = await aiChat.getHackathonHistory(hackathonId);
        if (!cancelled) setMessages(history?.conversation || []);
      } catch (err) {
        if (!cancelled) console.warn('Failed to load hackathon chat history:', err);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hackathonId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    const userMessage = { role: 'user', message: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await Promise.race([
        aiChat.sendHackathonMessage(hackathonId, trimmed),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out. Please try again.')), 35000)),
      ]);
      const aiMessage = { role: 'assistant', message: response.aiMessage, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Hackathon chat error:', err);
      const text = err?.error || err?.message || 'Something went wrong. Please try again.';
      setError(text);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!hackathon) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-[90vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#123524] via-[#1B4A32] to-[#123524] text-white px-5 py-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-5 h-5 text-[#123524]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4AF37] font-bold">Hackathon Coach · Zunnova</p>
            <h3 className="text-base sm:text-lg font-bold truncate">{hackathon.title}</h3>
            <p className="text-[11px] text-white/60 mt-0.5">
              Judged on: {JUDGING_AXES.join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7EF]">
          {initializing ? (
            <div className="flex items-center justify-center h-full text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading your coaching thread…</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[#123524] flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h4 className="text-base font-bold text-[#123524] mb-1.5">
                Let&apos;s build something the judges can&apos;t ignore.
              </h4>
              <p className="text-sm text-gray-600 max-w-sm mb-5">
                Ask me anything about <span className="font-semibold">{hackathon.title}</span> — brainstorm ideas, stress-test yours, plan the MVP, or sharpen the pitch.
              </p>
              <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-left text-xs bg-white border border-[#123524]/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 rounded-xl px-3 py-2.5 text-[#123524] transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#123524] flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#123524] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? stripMarkdown(msg.message) : msg.message}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-[#123524] flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 italic">Zunnova is thinking…</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3 sm:p-4">
          {error && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                  if (words.length <= 80) setInput(e.target.value);
                }}
                placeholder={`Ask about ${hackathon.title.slice(0, 40)}…`}
                disabled={isLoading || initializing}
                className="w-full px-4 py-2.5 pr-14 bg-[#FAF7EF] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 disabled:opacity-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                {input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0}/80
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading || initializing || !input.trim()}
              className="bg-[#123524] text-white px-4 py-2.5 rounded-xl hover:bg-[#1B4A32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
