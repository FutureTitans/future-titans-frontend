'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { aiChat, payment } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { MessageCircle, Send, Loader, Volume2, VolumeX, X, Bot, Sparkles } from 'lucide-react';
import ZunovaAvatar from './ZunovaAvatar';

export default function GlobalAIChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voice, setVoice] = useState(null);
  const messagesEndRef = useRef(null);

  const shouldHide =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    const init = async () => {
      if (!isStudent()) return;
      try {
        const status = await payment.getPaymentStatus();
        if (!status.isPaid) return;
        setEnabled(true);
        const history = await aiChat.getGlobalHistory();
        setMessages(history.conversation || []);
      } catch (error) {
        console.error('Failed to initialize global AI chat:', error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      const preferredOrder = ['Google US English', 'Google UK English', 'Microsoft Guy', 'Microsoft Aria'];
      let selected = voices.find((v) => preferredOrder.some((name) => v.name.includes(name))) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];
      setVoice(selected || null);
    };
    pickBestVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', pickBestVoice);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', pickBestVoice);
    }
  }, []);

  useEffect(() => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || !last.message) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(last.message);
      if (voice) utterance.voice = voice;
      else utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      synth.speak(utterance);
    } catch (e) {
      console.warn('TTS not available', e);
    }
  }, [messages, ttsEnabled, voice]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', message: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiChat.sendGlobalMessage(input);
      const aiMessage = { role: 'assistant', message: response.aiMessage, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Global AI chat error:', error);
      const errorMessage = {
        role: 'assistant',
        message: error?.error || error?.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (shouldHide || !enabled) return null;

  return (
    <>
      {/* Floating button - Mobile friendly */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 text-white rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 hover-glow"
          title="Chat with ZUNOVA"
        >
          <ZunovaAvatar isTalking={false} className="w-full h-full scale-125 md:scale-150 transform origin-bottom" />
        </button>
      )}

      {/* Chat panel - Mobile responsive */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-full md:max-w-sm h-[calc(100vh-8rem)] md:h-[600px] glass rounded-2xl shadow-2xl border border-white/30 flex flex-col z-50">
          {/* Premium Bot Header */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-4 flex items-center justify-between rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
            <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
              <ZunovaAvatar
                isTalking={isLoading}
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 scale-125"
              />
              <div className="min-w-0 flex-1 ml-2">
                <p className="font-semibold text-sm md:text-base flex items-center gap-1 truncate">
                  ZUNOVA
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse flex-shrink-0" />
                </p>
                <p className="text-xs opacity-90 truncate">Global AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
              <button
                type="button"
                onClick={() => setTtsEnabled((v) => !v)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white/30 min-h-0">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center px-4">
                <div className="glass-subtle p-6 rounded-2xl max-w-sm pt-8">
                  <ZunovaAvatar isTalking={false} className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 drop-shadow-lg scale-125 origin-bottom" />
                  <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">Start a conversation</p>
                  <p className="text-xs md:text-sm text-gray-500">Ask anything about ideas, mindset, or SURGE</p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                      <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] md:max-w-[80%] px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-br-sm'
                      : 'glass-subtle text-gray-800 rounded-bl-sm border border-white/30'
                      }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <span className={`text-[10px] md:text-xs mt-1 block ${msg.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                      <span className="text-white text-[10px] md:text-xs font-bold">U</span>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                  <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <div className="glass-subtle px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-bl-sm border border-white/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-white/20 p-3 md:p-4 glass-subtle">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 md:px-4 md:py-2.5 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-xs md:text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
