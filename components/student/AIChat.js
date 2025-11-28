'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { aiChat, auth } from '@/lib/api';
import { Send, Loader, Volume2, VolumeX, CheckCircle, Trophy } from 'lucide-react';

const AUTO_SURGE_SEED = '__AUTO_SURGE_START__';

export default function AIChatComponent({ moduleId, chapterId, module }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssiScore, setSSIScore] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(false); // Voice off by default
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
        
        // Check if all modules and chapters are completed
        // This is a simplified check - the backend will verify all chapters are actually completed
        try {
          const profile = await auth.getProfile();
          const modulesProgress = profile?.modulesProgress || [];
          const hasModules = modulesProgress.length > 0;
          // Check if all modules show 100% completion (backend verifies actual chapter completion)
          const allCompleted = hasModules && modulesProgress.every((m) => (m.completionPercentage || 0) >= 100);
          setAllModulesCompleted(allCompleted);
        } catch (e) {
          console.error('Failed to check module completion:', e);
        }

        // Auto-start SURGE session: if no conversation yet, trigger the first AI question
        if (!data.conversation || data.conversation.length === 0 && !data.isCompleted) {
          try {
            setIsLoading(true);
            // Send a hidden seed message so the engine can generate the first question
            await aiChat.sendMessage(
              moduleId,
              chapterId,
              AUTO_SURGE_SEED
            );
            // Reload history so we pick up the assistant's first question
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

  // Update time spent in real-time
  useEffect(() => {
    if (!startTime || isCompleted) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      setTimeSpent(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  // Load best-available TTS voice once
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Prefer high-quality English neural voices
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
      // Slightly tuned for more natural feel
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
      
      // Always check completion status using dedicated endpoint
      try {
        const completionStatus = await auth.checkCompletionStatus();
        console.log('📊 Completion Status:', completionStatus);
        
        setAllModulesCompleted(completionStatus.allCompleted || response.allModulesCompleted);
        
        // Show detailed status in alert if not complete
        if (!completionStatus.allCompleted) {
          const incompleteModules = completionStatus.details
            .filter(d => !d.isComplete)
            .map(d => `${d.moduleTitle}: ${d.completedChapters}/${d.totalChapters} chapters (${d.completionPercentage}%)`)
            .join('\n');
          
          console.warn('⚠️ Modules incomplete:', incompleteModules);
        }
      } catch (e) {
        console.error('❌ Failed to check completion status:', e);
        // Fallback to backend response
        setAllModulesCompleted(response.allModulesCompleted || false);
      }
      
      // Show appropriate message
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

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-neutral-border/60 shadow-lg overflow-hidden h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-gradient-red-gold text-white px-4 py-3 md:p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">AI Co-Founder</h3>
          <p className="text-sm opacity-90">Your personalized learning partner</p>
        </div>
        <button
          type="button"
          onClick={() => setTtsEnabled((v) => !v)}
          className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition"
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>

      {/* Messages (own scroll, independent from page scroll) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 md:p-6 space-y-4 bg-neutral-light/40 scrollbar-thin scrollbar-thumb-neutral-border/70 scrollbar-track-transparent min-h-0">
        {messages.filter(
          (m) => !(m.role === 'user' && m.message === AUTO_SURGE_SEED)
        ).length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-neutral-medium mb-2">Start your conversation</p>
              <p className="text-sm text-neutral-medium">Ask questions and share your ideas</p>
            </div>
          </div>
        ) : (
          messages
            .filter(
              (msg) => !(msg.role === 'user' && msg.message === AUTO_SURGE_SEED)
            )
            .map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary-red text-white rounded-br-none'
                      : 'bg-neutral-light text-neutral-dark rounded-bl-none'
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-light p-4 rounded-lg animate-pulse">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* SSI Score Display */}
      {ssiScore && (
        <div className="border-t border-neutral-border p-4 bg-primary-lightRed">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-primary-red">Current SSI Score: {ssiScore.overall}/100</p>
            {timeSpent > 0 && (
              <p className="text-xs text-neutral-medium">
                Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </p>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { label: 'S', key: 'selfAwareness' },
              { label: 'U', key: 'understandingOpportunities' },
              { label: 'R', key: 'resilience' },
              { label: 'G', key: 'growthExecution' },
              { label: 'E', key: 'entrepreneurialLeadership' },
            ].map((item) => (
              <div key={item.key} className="text-center">
                <p className="text-xs font-bold text-primary-red">{item.label}</p>
                <p className="text-xs">{ssiScore[item.key] || 0}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finish Chapter Button */}
      {!isCompleted && messages.length > 0 && (
        <div className="border-t border-neutral-border p-4 bg-accent-gold bg-opacity-10">
          <button
            onClick={handleFinishChapter}
            disabled={finishing || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-accent-gold text-white px-4 py-3 rounded-lg hover:bg-accent-amber disabled:opacity-50 transition-colors font-semibold"
          >
            <CheckCircle className="w-5 h-5" />
            {finishing ? 'Finishing...' : 'Finish Chapter & Finalize SSI Score'}
          </button>
          <p className="text-xs text-neutral-medium mt-2 text-center">
            Click to end this chapter's AI session and record your final SSI score
          </p>
        </div>
      )}

      {/* All Modules Completed - Submit Idea Button */}
      {isCompleted && allModulesCompleted && (
        <div className="border-t border-neutral-border p-4 bg-semantic-success bg-opacity-10">
          <div className="text-center mb-3">
            <p className="font-semibold text-semantic-success mb-1">🎉 Congratulations!</p>
            <p className="text-sm text-neutral-medium">You've completed all modules and chapters!</p>
          </div>
          <button
            onClick={() => router.push('/student/submission')}
            className="w-full flex items-center justify-center gap-2 bg-semantic-success text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            <Trophy className="w-5 h-5" />
            Submit Your Idea
          </button>
        </div>
      )}

      {/* Input */}
      {!isCompleted && (
        <form onSubmit={handleSendMessage} className="border-t border-neutral-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* Completed Message */}
      {isCompleted && !allModulesCompleted && (
        <div className="border-t border-neutral-border p-4 bg-neutral-light text-center">
          <p className="text-sm text-neutral-medium">
            ✅ This chapter's AI session is complete. Your final SSI score has been recorded.
          </p>
        </div>
      )}
    </div>
  );
}

