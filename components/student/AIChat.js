'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { aiChat, auth } from '@/lib/api';
import { Send, Loader, Volume2, VolumeX, CheckCircle, Trophy, Bot, Sparkles, User } from 'lucide-react';

const AUTO_SURGE_SEED = '__AUTO_SURGE_START__';

export default function AIChatComponent({ moduleId, chapterId, module }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssiScore, setSSIScore] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [allModulesCompleted, setAllModulesCompleted] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const messagesEndRef = useRef(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await aiChat.getChatHistory(moduleId, chapterId);
        setMessages(data.conversation || []);
        if (data.ssiScore) {
          setSSIScore(data.ssiScore);
        }
        setIsCompleted(data.isCompleted || false);
        if (data.timeSpent) {
          setTimeSpent(data.timeSpent);
        }
        if (data.startedAt && !data.isCompleted) {
          setStartTime(new Date(data.startedAt));
        }

        try {
          const completionStatus = await auth.checkCompletionStatus();
          setAllModulesCompleted(completionStatus.allCompleted === true);
        } catch (e) {
          setAllModulesCompleted(false);
        }

        if (!data.conversation || data.conversation.length === 0 && !data.isCompleted) {
          try {
            setIsLoading(true);
            await aiChat.sendMessage(moduleId, chapterId, AUTO_SURGE_SEED);
            const seeded = await aiChat.getChatHistory(moduleId, chapterId);
            setMessages(seeded.conversation);
            if (seeded.ssiScore) setSSIScore(seeded.ssiScore);
            setIsCompleted(seeded.isCompleted || false);
          } catch (e) {
            console.error('Failed to auto-start SURGE chat:', e);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadHistory();
  }, [moduleId, chapterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!startTime || isCompleted) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      setTimeSpent(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isCompleted) return;

    const userMessage = { role: 'user', message: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiChat.sendMessage(moduleId, chapterId, input);
      const aiMessage = { role: 'assistant', message: response.aiMessage, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
      if (response.ssiScore) {
        setSSIScore(response.ssiScore);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
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

  const handleFinishChapter = async () => {
    if (isCompleted || finishing) return;
    setFinishing(true);
    try {
      const response = await aiChat.finishChapterChat(moduleId, chapterId);
      setIsCompleted(true);
      if (response.finalSSI) {
        setSSIScore(response.finalSSI);
      }
      // Use ONLY the dedicated completion-status endpoint as the single source of truth
      let allDone = false;
      try {
        const completionStatus = await auth.checkCompletionStatus();
        allDone = completionStatus.allCompleted === true;
      } catch (e) {
        // If the endpoint fails, default to false — don't guess
        allDone = false;
      }
      setAllModulesCompleted(allDone);
      if (allDone) {
        alert('🎉 Congratulations! You\'ve completed all modules and chapters! You can now submit your idea.');
      } else {
        alert('✅ Chapter AI session completed! Your final SSI score for this chapter has been recorded.');
      }
    } catch (error) {
      console.error('Failed to finish chapter:', error);
      alert('❌ Failed to finish chapter: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setFinishing(false);
    }
  };

  const filteredMessages = messages.filter((m) => !(m.role === 'user' && m.message === AUTO_SURGE_SEED));

  return (
    <div className="flex flex-col glass-panel rounded-3xl border border-white/40 shadow-xl overflow-hidden h-full">
      {/* Premium Bot Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-white px-5 py-4 flex items-center justify-between relative overflow-hidden backdrop-blur-xl shrink-0 border-b border-white/20">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
              ZUNOVA AI
              <Sparkles className="w-4 h-4 text-white/90 animate-pulse" />
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Learning Assistant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTtsEnabled((v) => !v)}
          className="relative z-10 flex items-center gap-1.5 text-xs bg-white/20 max-h-8 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition border border-white/30 font-medium tracking-wide"
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>

      {/* SSI Score Overview (if available) */}
      {ssiScore && (
        <div className="bg-white/40 border-b border-black/5 px-4 py-3 shrink-0 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">
              SSI Score: <span className="text-[#D4AF37]">{ssiScore.overall}/100</span>
            </p>
            {timeSpent > 0 && (
              <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                ⏱️ {Math.floor(timeSpent / 60)}M {timeSpent % 60}S
              </p>
            )}
          </div>
          <div className="flex justify-between gap-1 text-[10px]">
            {[
              { label: 'S', key: 'selfAwareness', name: 'Self' },
              { label: 'U', key: 'understandingOpportunities', name: 'UI' },
              { label: 'R', key: 'resilience', name: 'Resilience' },
              { label: 'G', key: 'growthExecution', name: 'Growth' },
              { label: 'E', key: 'entrepreneurialLeadership', name: 'Lead' },
            ].map((item) => (
              <div key={item.key} className="text-center w-full max-w-[40px]">
                <p className="font-bold text-gray-600 mb-0.5">{item.label}</p>
                <div className="w-full bg-black/5 rounded-full h-1 mb-0.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] h-1 rounded-full transition-all"
                    style={{ width: `${ssiScore[item.key] || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#FAF8F3]/60 scroll-smooth">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4 animate-fade-in-up">
            <div className="bg-white/60 p-8 rounded-3xl max-w-sm border border-white/60 shadow-sm">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-gray-900 font-bold mb-2 text-lg">Hello from ZUNOVA!</p>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">I'm here to help you reflect on this module and build your SSI framework. Please say hi to get started.</p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationFillMode: 'both' }}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center mr-3 flex-shrink-0 shadow-md shadow-[#D4AF37]/20 border border-white/50 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E] text-white rounded-2xl rounded-tr-md shadow-[#D4AF37]/20'
                  : 'bg-white text-gray-800 rounded-2xl rounded-tl-md border border-black/5'
                  }`}
              >
                {msg.message}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center ml-3 flex-shrink-0 shadow-md mt-1 border border-white/10">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center mr-3 flex-shrink-0 shadow-md shadow-[#D4AF37]/20 border border-white/50">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-md border border-black/5 shadow-sm">
              <div className="flex gap-1.5 items-center justify-center h-4">
                <div className="w-2 h-2 bg-[#D4AF37]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#D4AF37]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      {!isCompleted ? (
        <div className="bg-white/80 backdrop-blur-md p-4 border-t border-black/5 shrink-0 relative">
          <form onSubmit={handleSendMessage} className="relative z-10 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Zunova anything..."
              className="flex-1 px-5 py-3.5 bg-white border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all text-sm md:text-base shadow-sm placeholder-gray-400 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white w-14 h-14 rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center flex-shrink-0 border border-white/20"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>

          {messages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <button
                onClick={handleFinishChapter}
                disabled={finishing || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1A1A1A] to-[#333333] text-white px-4 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-semibold text-sm tracking-wide"
              >
                <CheckCircle className="w-4 h-4" />
                {finishing ? 'Finishing...' : 'Submit Reflection & Finalize'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1A1A1A] text-white p-5 border-t border-black/5 shrink-0 text-center">
          {allModulesCompleted ? (
            <div>
              <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="font-bold text-[#F5D76E] mb-1">Modules Complete!</p>
              <p className="text-xs text-gray-400 mb-4">You have successfully finished all chapters.</p>
              <button
                onClick={() => router.push('/student/submission')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all font-semibold shadow-[#D4AF37]/20 border border-white/20"
              >
                Submit Your Idea
              </button>
            </div>
          ) : (
            <div className="py-2">
              <CheckCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">Session Complete</p>
              <p className="text-xs text-gray-400 font-medium">Your final SSI score is logged.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
