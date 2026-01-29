'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { aiChat, auth } from '@/lib/api';
import { Send, Loader, Volume2, VolumeX, CheckCircle, Trophy, Bot, Sparkles } from 'lucide-react';

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
          const profile = await auth.getProfile();
          const modulesProgress = profile?.modulesProgress || [];
          const hasModules = modulesProgress.length > 0;
          const allCompleted = hasModules && modulesProgress.every((m) => (m.completionPercentage || 0) >= 100);
          setAllModulesCompleted(allCompleted);
        } catch (e) {
          console.error('Failed to check module completion:', e);
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
      try {
        const completionStatus = await auth.checkCompletionStatus();
        setAllModulesCompleted(completionStatus.allCompleted || response.allModulesCompleted);
      } catch (e) {
        setAllModulesCompleted(response.allModulesCompleted || false);
      }
      if (response.allModulesCompleted) {
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
    <div className="flex flex-col glass rounded-2xl border border-white/30 shadow-2xl overflow-hidden h-full max-h-[calc(100vh-120px)]">
      {/* Premium Bot Header */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white px-4 py-4 md:px-6 md:py-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
              ZUNOVA
              <Sparkles className="w-4 h-4 animate-pulse" />
            </h3>
            <p className="text-xs md:text-sm opacity-90">Your AI Learning Partner</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTtsEnabled((v) => !v)}
          className="relative z-10 flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white/30 transition border border-white/20"
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/30 min-h-0">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div className="glass-subtle p-6 rounded-2xl max-w-sm">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">Start your conversation</p>
              <p className="text-sm text-gray-500">Ask questions and share your ideas with ZUNOVA</p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-xs px-4 py-3 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-br-sm'
                    : 'glass-subtle text-gray-800 rounded-bl-sm border border-white/30'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                <span className={`text-xs mt-2 block ${msg.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-subtle px-4 py-3 rounded-2xl rounded-bl-sm border border-white/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* SSI Score Display */}
      {ssiScore && (
        <div className="border-t border-white/20 px-4 py-3 md:px-6 md:py-4 glass-subtle">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <p className="text-sm font-semibold text-gray-800">
              SSI Score: <span className="text-red-600">{ssiScore.overall}/100</span>
            </p>
            {timeSpent > 0 && (
              <p className="text-xs text-gray-600">
                ⏱️ {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </p>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { label: 'S', key: 'selfAwareness', name: 'Self' },
              { label: 'U', key: 'understandingOpportunities', name: 'Understand' },
              { label: 'R', key: 'resilience', name: 'Resilience' },
              { label: 'G', key: 'growthExecution', name: 'Growth' },
              { label: 'E', key: 'entrepreneurialLeadership', name: 'Leadership' },
            ].map((item) => (
              <div key={item.key} className="text-center">
                <p className="text-xs font-bold text-gray-700 mb-1">{item.label}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${ssiScore[item.key] || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{ssiScore[item.key] || 0}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finish Chapter Button */}
      {!isCompleted && messages.length > 0 && (
        <div className="border-t border-white/20 px-4 py-3 md:px-6 md:py-4 glass-subtle">
          <button
            onClick={handleFinishChapter}
            disabled={finishing || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-semibold"
          >
            <CheckCircle className="w-5 h-5" />
            {finishing ? 'Finishing...' : 'Finish Chapter & Finalize SSI'}
          </button>
          <p className="text-xs text-gray-600 mt-2 text-center">
            End this chapter's AI session and record your final SSI score
          </p>
        </div>
      )}

      {/* All Modules Completed */}
      {isCompleted && allModulesCompleted && (
        <div className="border-t border-white/20 px-4 py-3 md:px-6 md:py-4 glass-subtle bg-green-50/50">
          <div className="text-center mb-3">
            <p className="font-semibold text-green-700 mb-1">🎉 Congratulations!</p>
            <p className="text-sm text-gray-700">You've completed all modules and chapters!</p>
          </div>
          <button
            onClick={() => router.push('/student/submission')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <Trophy className="w-5 h-5" />
            Submit Your Idea
          </button>
        </div>
      )}

      {/* Input */}
      {!isCompleted && (
        <form onSubmit={handleSendMessage} className="border-t border-white/20 px-3 py-3 md:px-6 md:py-4 glass-subtle">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm md:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* Completed Message */}
      {isCompleted && !allModulesCompleted && (
        <div className="border-t border-white/20 px-4 py-3 md:px-6 md:py-4 glass-subtle text-center">
          <p className="text-sm text-gray-700">
            ✅ This chapter's AI session is complete. Your final SSI score has been recorded.
          </p>
        </div>
      )}
    </div>
  );
}
