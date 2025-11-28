'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { aiChat, payment } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { MessageCircle, Send, Loader, Volume2, VolumeX, X } from 'lucide-react';

export default function GlobalAIChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false); // Voice off by default
  const [voice, setVoice] = useState(null);
  const messagesEndRef = useRef(null);

  // Hide on landing, auth pages, admin
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

  // Load best-available TTS voice once
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const preferredOrder = [
        'Google US English',
        'Google UK English',
        'Microsoft Guy',
        'Microsoft Aria',
      ];

      let selected =
        voices.find((v) => preferredOrder.some((name) => v.name.includes(name))) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      setVoice(selected || null);
    };

    pickBestVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', pickBestVoice);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', pickBestVoice);
      };
    }
  }, []);

  // TTS for latest assistant message
  useEffect(() => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || !last.message) return;

    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(last.message);
      if (voice) {
        utterance.voice = voice;
      } else {
        utterance.lang = 'en-US';
      }
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
      const aiMessage = {
        role: 'assistant',
        message: response.aiMessage,
        timestamp: new Date(),
      };
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
      {/* Floating button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-red text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:bg-primary-darkRed transition z-40"
          title="Chat with your AI Co-Founder"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl border border-neutral-border flex flex-col z-40">
          <div className="bg-gradient-red-gold text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">AI Co-Founder (Global)</p>
              <p className="text-xs opacity-90">
                Ask anything about ideas, mindset, or SURGE — beyond the modules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTtsEnabled((v) => !v)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                {ttsEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.length === 0 ? (
              <div className="text-center text-neutral-medium text-sm py-6">
                Start by sharing what you’re working on, or ask for help exploring an idea.
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-red text-white rounded-br-none'
                        : 'bg-neutral-light text-neutral-dark rounded-bl-none'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-[10px] opacity-70 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-light p-2 rounded-lg animate-pulse">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-neutral-border p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your idea..."
                className="flex-1 px-3 py-2 border border-neutral-border rounded-lg text-sm focus:outline-none focus:border-primary-red"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary-red text-white px-3 py-2 rounded-lg hover:bg-primary-darkRed disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}


