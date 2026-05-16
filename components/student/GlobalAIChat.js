'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { aiChat, payment } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { MessageCircle, Send, Loader, Volume2, VolumeX, X, Bot, Sparkles } from 'lucide-react';
import ZunnovaAvatar from './ZunnovaAvatar';

export default function GlobalAIChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voice, setVoice] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [rateLimit, setRateLimit] = useState(null);

  const shouldHide =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/student/modules') ||
    pathname.startsWith('/student/submission');

  useEffect(() => {
    // If user is no longer a student (e.g., logged out), reset state
    if (!isStudent()) {
      if (enabled) {
        setEnabled(false);
        setMessages([]);
      }
      return;
    }

    const init = async () => {
      // Don't initialize if we're on a page where it's hidden or if already enabled
      if (shouldHide || enabled) return;

      try {
        const status = await payment.getPaymentStatus();
        if (!status.isPaid) return;

        setEnabled(true);
        const history = await aiChat.getGlobalHistory();
        setMessages(history.conversation || []);

        // Fetch rate limit status
        try {
          const rl = await aiChat.getRateLimitStatus();
          setRateLimit(rl);
        } catch (e) { /* ignore */ }
      } catch (error) {
        console.error('Failed to initialize global AI chat:', error);
      }
    };

    init();
  }, [pathname, shouldHide, enabled]);

  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);

    window.addEventListener('closeGlobalZunnova', handleClose);
    window.addEventListener('hideGlobalZunnova', handleHide);
    window.addEventListener('showGlobalZunnova', handleShow);

    return () => {
      window.removeEventListener('closeGlobalZunnova', handleClose);
      window.removeEventListener('hideGlobalZunnova', handleHide);
      window.removeEventListener('showGlobalZunnova', handleShow);
    };
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
    if (typeof window === 'undefined') return;

    if (!ttsEnabled) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || !last.message) return;

    const playTTS = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
        if (!apiKey) throw new Error("No API key");

        // Cancel existing audio
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Using user provided Indian voice
        const voiceId = "RtKOHqpmbmsUGWBJaXAM";
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: last.message,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => URL.revokeObjectURL(url);

        await audio.play();
      } catch (error) {
        console.warn('ElevenLabs TTS failed, falling back to window.speechSynthesis:', error);
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
          console.warn('Fallback TTS also not available', e);
        }
      }
    };

    playTTS();
  }, [messages, ttsEnabled, voice]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || (rateLimit && rateLimit.limitReached)) return;
    const userMessage = { role: 'user', message: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const timeoutId = setTimeout(() => { }, 35000);
      let response;
      try {
        response = await Promise.race([
          aiChat.sendGlobalMessage(input),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out. Please try again.')), 35000)),
        ]);
      } finally {
        clearTimeout(timeoutId);
      }
      const aiMessage = { role: 'assistant', message: response.aiMessage, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Global AI chat error:', error);
      const errorText = error?.name === 'AbortError' || error?.message?.includes('timed out')
        ? 'Request timed out. Please try again.'
        : error?.error || error?.message || 'Sorry, I encountered an error. Please try again.';
      const errorMessage = {
        role: 'assistant',
        message: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refresh rate limit after sending
      try {
        const rl = await aiChat.getRateLimitStatus();
        setRateLimit(rl);
      } catch (e) { /* ignore */ }
    }
  };

  if (shouldHide || !enabled || isHidden) return null;

  return (
    <>
      {/* Floating button + chat bubble - Mobile friendly */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-0">

          <div className="relative mb-[-20px] mr-20 md:mr-36 self-start animate-fade-in-up origin-bottom">
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl rounded-br-sm px-4 py-3 w-52 md:w-64 border border-white/50">
              <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-semibold">
                <span className="font-extrabold text-[#B8952E]">Zunnova:</span>{' '}
                Every great founder starts with a question. Let&apos;s find yours.
              </p>
            </div>
            <div className="absolute -right-2 bottom-3 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white/50"></div>
          </div>

          {/* Avatar button */}
          {/* Avatar button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-white rounded-full w-40 h-28 md:w-44 md:h-40 flex items-center justify-center hover:scale-110 transition-transform duration-300 hover-glow flex-shrink-0"
            title="Chat with Zunnova"
          >
            <ZunnovaAvatar
              isTalking={false}
              className="w-full h-full scale-[1.3] md:scale-150 transform origin-bottom"
            />
          </button>

        </div>
      )}

      {/* Chat panel - Mobile responsive */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-full md:max-w-sm h-[calc(100vh-8rem)] md:h-[600px] glass rounded-2xl shadow-2xl border border-white/30 flex flex-col z-50">
          {/* Premium Bot Header */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-4 flex items-center justify-between rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
            <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
              <ZunnovaAvatar
                isTalking={isLoading}
                className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 scale-110"
              />
              <div className="min-w-0 flex-1 ml-2">
                <p className="font-semibold text-sm md:text-base flex items-center gap-1 truncate">
                  Zunnova
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse flex-shrink-0" />
                </p>
                <p className="text-xs opacity-90 truncate">Your AI Friend & Startup Partner</p>
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
                  <ZunnovaAvatar isTalking={false} className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 drop-shadow-lg scale-125 origin-bottom" />
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
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-dotted border-orange-400 animate-spin" style={{ animationDuration: '1.2s' }}></div>
                    <span className="text-xs md:text-sm text-gray-500 font-medium italic">Zunnova is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-white/20 p-3 md:p-4 glass-subtle">
            {rateLimit && (
              <div className={`text-[10px] md:text-xs mb-2 font-semibold text-center ${rateLimit.limitReached ? 'text-red-500' : 'text-gray-500'}`}>
                {rateLimit.limitReached
                  ? `⚠️ Message limit reached (${rateLimit.limit}/${rateLimit.limit}). Try again ${rateLimit.windowHours ? `in ${rateLimit.windowHours}h` : 'later'}.`
                  : `💬 ${rateLimit.remaining} / ${rateLimit.limit} messages remaining${rateLimit.windowHours ? ` (resets every ${rateLimit.windowHours}h)` : ''}`}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={rateLimit?.limitReached ? 'Message limit reached...' : 'Ask anything...'}
                className="flex-1 px-3 py-2 md:px-4 md:py-2.5 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-xs md:text-sm"
                disabled={isLoading || rateLimit?.limitReached}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || rateLimit?.limitReached}
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
