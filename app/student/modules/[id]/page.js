'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { modules, aiChat, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Play, CheckCircle, ArrowLeft, ArrowRight, Trophy, Target, Lightbulb, Lock, Bell, Settings, LayoutDashboard, UserCircle, PlayCircle, Brain, Search, MessageSquare, Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AIChatComponent from '@/components/student/AIChat';
import ChapterQuiz from '@/components/student/ChapterQuiz';
import ModuleFaceGuard from '@/components/shared/ModuleFaceGuard';
import TopupPopup from '@/components/student/TopupPopup';

export default function ModulePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id;

  const [module, setModule] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState(null);
  const [showAIChat, setShowAIChat] = useState(true); 
  const [loading, setLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState({});
  const [markingComplete, setMarkingComplete] = useState(false);
  const [navigatingNext, setNavigatingNext] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [wordBalance, setWordBalance] = useState(null);
  const [showTopup, setShowTopup] = useState(false);
  const lastFetchedChapterRef = useRef(null);
  const completingChapterRef = useRef(false);

  useEffect(() => {
    if (!module || !moduleId) return;
    const interval = setInterval(() => {
      modules.trackTime(moduleId, 60).catch(err => console.debug('Failed to track time', err));
    }, 60000);
    return () => clearInterval(interval);
  }, [module, moduleId]);

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }
    const currentUser = getUser();
    if (currentUser?.email === 'demo@futuretitans.com') {
      setIsDemo(true);
    }
    fetchModule();
  }, [router, moduleId]);

  useEffect(() => {
    if (!module || !module.chapters || module.chapters.length === 0) return;
    const chapterId = module.chapters[currentChapter]._id;
    let cancelled = false;

    // Only re-fetch chapter content when the actual chapter changed, not on module data refreshes
    if (lastFetchedChapterRef.current !== chapterId) {
      lastFetchedChapterRef.current = chapterId;
      fetchChapterContent(chapterId);
      setShowQuiz(false);
      setQuizCompleted(false);
    }

    // Don't re-check completion from chat history if we're in the middle of marking complete
    // (the completeChapter function handles state updates itself)
    if (!completingChapterRef.current) {
      const checkChapterComplete = async () => {
        try {
          const history = await aiChat.getChatHistory(moduleId, chapterId);
          if (cancelled) return;
          if (history.conversation && history.conversation.length > 0) {
            setChapterCompleted(prev => ({ ...prev, [chapterId]: true }));
          }
        } catch (e) {
          // Silently ignore — completion state is also loaded from profile
        }
      };
      checkChapterComplete();
    }

    return () => { cancelled = true; };
  }, [module, currentChapter]);

  useEffect(() => {
    if (!module || !module.chapters || module.chapters.length === 0) return;
    const current = module.chapters[currentChapter];
    if (!current || current.content?.type !== 'video') return;
    if (typeof window === 'undefined') return;

    const onYouTubeIframeAPIReady = () => {
      if (!window.YT || !window.YT.Player) return;
      new window.YT.Player('chapter-video-player', {
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {}
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      let existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        existingScript = document.createElement('script');
        existingScript.id = 'youtube-iframe-api';
        existingScript.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(existingScript);
      }
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, [module, currentChapter, moduleId]);

  // Demo user: Auto-complete video chapters after 120 seconds
  useEffect(() => {
    if (!isDemo || currentChapter > 0) return; // Only auto-complete the FIRST chapter

    if (!module || !module.chapters || module.chapters.length === 0) return;
    const current = module.chapters[currentChapter];
    if (current?.content?.type !== 'video') return;

    if (chapterCompleted[current._id]) return;

    const timer = setTimeout(async () => {
      try {
        // Force pause the video player
        const iframe = document.getElementById('chapter-video-player');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
        const html5Video = document.querySelector('video');
        if (html5Video) {
          html5Video.pause();
        }

        setMarkingComplete(true);
        completingChapterRef.current = true;
        await aiChat.completeChapter(moduleId, current._id);
        setChapterCompleted(prev => ({ ...prev, [current._id]: true }));
        await fetchModule(current._id);
        setShowQuiz(true);
        setShowAIChat(false);
      } catch (err) {
        console.error('Failed to auto-complete demo chapter:', err);
      } finally {
        setMarkingComplete(false);
        completingChapterRef.current = false;
      }
    }, 90000); // 1 minute 30 seconds

    return () => clearTimeout(timer);
  }, [module, currentChapter, chapterCompleted, moduleId, isDemo]);

  const fetchModule = async (preserveChapterId) => {
    try {
      const data = await modules.getById(moduleId);
      setModule(data);

      aiChat.getWordBalance().then(wb => setWordBalance(wb.wordBalance)).catch(() => {});

      try {
        const profile = await auth.getProfile();
        const moduleProgress = profile?.modulesProgress?.find(
          (mp) => (mp.moduleId?._id || mp.moduleId)?.toString() === moduleId
        );
        if (moduleProgress?.completedChapters?.length > 0) {
          const completed = {};
          moduleProgress.completedChapters.forEach((id) => {
            completed[id.toString()] = true;
          });
          // Preserve the just-completed chapter in case the server hasn't propagated yet
          if (preserveChapterId) {
            completed[preserveChapterId.toString()] = true;
          }
          setChapterCompleted(completed);
        } else if (preserveChapterId) {
          // Server returned no completions yet, but we just completed one locally
          setChapterCompleted(prev => ({ ...prev, [preserveChapterId.toString()]: true }));
        }
      } catch (e) {
        console.error('Failed to load completion state:', e);
        // Even if profile fetch fails, preserve the local completion
        if (preserveChapterId) {
          setChapterCompleted(prev => ({ ...prev, [preserveChapterId.toString()]: true }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch module:', error);
      router.push('/student/modules');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterContent = async (chapterId) => {
    try {
      setChapterLoading(true);
      const content = await modules.getChapter(moduleId, chapterId);
      setChapterContent(content);
    } catch (error) {
      console.error('Failed to fetch chapter content:', error);
    } finally {
      setChapterLoading(false);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < module.chapters.length - 1) {
      setNavigatingNext(true);
      setTimeout(() => {
        setCurrentChapter(currentChapter + 1);
        setNavigatingNext(false);
      }, 800);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const completeChapter = async () => {
    if (markingComplete) return; // Guard against rapid double-clicks
    setMarkingComplete(true);
    completingChapterRef.current = true;
    try {
      const chapterId = module.chapters[currentChapter]._id;
      await aiChat.completeChapter(moduleId, chapterId);

      setChapterCompleted(prev => ({ ...prev, [chapterId]: true }));
      await fetchModule(chapterId);

      setShowQuiz(true);
      setShowAIChat(false);
    } catch (error) {
      console.error('Failed to complete chapter:', error);
      alert('Failed to mark chapter as complete: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setMarkingComplete(false);
      completingChapterRef.current = false;
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
    const current = module.chapters[currentChapter];
    if (current?.aiInteractionEnabled) {
      setShowAIChat(true);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      let baseUrl = url;

      if (parsed.hostname.includes('youtu.be')) {
        const id = parsed.pathname.replace('/', '');
        baseUrl = `https://www.youtube.com/embed/${id}`;
      } else if (parsed.hostname.includes('youtube.com')) {
        const id = parsed.searchParams.get('v');
        if (id) {
          baseUrl = `https://www.youtube.com/embed/${id}`;
        }
      }

      if (baseUrl.includes('youtube.com/embed/')) {
        const separator = baseUrl.includes('?') ? '&' : '?';
        if (!baseUrl.includes('rel=0')) {
          baseUrl = `${baseUrl}${separator}rel=0`;
        }
        const separator2 = baseUrl.includes('?') ? '&' : '?';
        if (!baseUrl.includes('enablejsapi=1')) {
          baseUrl = `${baseUrl}${separator2}enablejsapi=1`;
        }
      }

      return baseUrl;
    } catch {
      return url;
    }
  };

  const renderChapterContent = () => {
    if (!chapterContent) return null;

    const { content } = chapterContent;

    switch (content.type) {
      case 'text':
        return (
          <div className="prose prose-lg max-w-none text-gray-700">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.text }}
            />
          </div>
        );

      case 'video':
        const isHTML5Video = content.videoUrl && (content.videoUrl.includes('amazonaws.com') || content.videoUrl.endsWith('.mp4'));
        return (
          <div className="aspect-video bg-[#111] rounded-3xl overflow-hidden shadow-sm relative group w-full max-w-[900px] border-[8px] border-black">
            {isHTML5Video ? (
              <video
                controls
                src={content.videoUrl}
                className="w-full h-full absolute inset-0 object-contain"
                controlsList="nodownload"
                onEnded={() => console.log('Video ended')}
              />
            ) : (
              <iframe
                id="chapter-video-player"
                src={getYouTubeEmbedUrl(content.videoUrl)}
                className="w-full h-full absolute inset-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={chapterContent.title}
              />
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-6">🎧</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={content.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'pdf':
        return (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-6">📄</div>
            <p className="text-lg text-gray-700 mb-6 font-medium">PDF Document provided for this chapter</p>
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 inline-flex items-center gap-2 bg-[#D4AF37] text-white rounded-full font-semibold hover:bg-[#B8952E] transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Open PDF
            </a>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 font-medium">Content type not supported</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <LoadingSpinner message="Loading module..." />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Module not found</h2>
          <button
            onClick={() => router.push('/student/modules')}
            className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-semibold"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const currentChapterData = module.chapters[currentChapter];
  const completedCount = Object.keys(chapterCompleted).length;
  const progressPercentage = module.chapters.length > 0 ? Math.round((completedCount / module.chapters.length) * 100) : 0;
  const ZunnovaAvailable = currentChapterData?.aiInteractionEnabled;
  const isCompleted = chapterCompleted[currentChapterData?._id];

  return (
    <ModuleFaceGuard>
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FDFDFD] font-sans text-gray-900 pb-12 flex flex-col">
      <div className="bg-[#FDFDFD] sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 sm:py-4 flex justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => router.push('/student/modules')}
              className="text-gray-400 hover:text-gray-700 transition flex-shrink-0 p-1"
              aria-label="Back to modules"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                <span className="text-[#B8952E]">MODULE {(module?.moduleNumber || 1).toString().padStart(2, '0')}</span>
                <span className="text-gray-300 hidden xs:inline">&bull;</span>
                <span className="hidden xs:inline">Ch. {currentChapter + 1}/{module.chapters.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-16 sm:w-48 bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#D4AF37] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className="text-[10px] font-bold text-[#A87B1E] tracking-widest whitespace-nowrap">
                {progressPercentage}%
              </div>
            </div>
            {wordBalance !== null && (
              <button
                onClick={() => setShowTopup(true)}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                  wordBalance <= 0
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : wordBalance <= 500
                      ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{wordBalance.toLocaleString()}</span>
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              </button>
            )}
            {ZunnovaAvailable && (
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="hidden lg:flex items-center gap-2 bg-[#212121] text-[#D4AF37] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors border border-black"
              >
                <div className="w-5 h-5 bg-[#D4AF37] rounded-md flex items-center justify-center text-[#212121]">
                  <Brain className="w-3 h-3" />
                </div>
                Zunnova AI
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Chapters */}
        <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Course Chapters</h3>
            <p className="text-xs text-gray-500 mb-6">Curriculum Overview</p>

            <div className="space-y-1">
              {module.chapters.map((chapter, index) => {
                const completed = chapterCompleted[chapter._id];
                const isActive = index === currentChapter;
                const isLockedForDemo = isDemo && index > 0;
                const Icon = chapter.content?.type === 'video' ? PlayCircle : BookOpen;

                return (
                  <button
                    key={chapter._id}
                    disabled={isLockedForDemo}
                    onClick={() => {
                      if (!isLockedForDemo) {
                        setCurrentChapter(index);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20' 
                        : isLockedForDemo ? 'opacity-60 cursor-not-allowed bg-gray-50'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                      isActive ? 'bg-[#212121] text-[#D4AF37]' : isLockedForDemo ? 'bg-gray-100 text-gray-400' : completed ? 'text-[#D4AF37]' : 'text-gray-400 border border-gray-200'
                    }`}>
                      {isLockedForDemo ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : completed && !isActive ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isActive ? (
                        <Icon className="w-3.5 h-3.5" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'font-semibold' : ''}`}>
                      {chapter.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FDFBF5] border border-[#F2E5C5] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-[#A87B1E]">Pro Tip</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Focus on pain points you experience personally to find high-value problems.
            </p>
          </div>

          {wordBalance !== null && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-bold text-sm text-gray-900">AI Word Balance</h4>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-2xl font-light ${wordBalance <= 0 ? 'text-red-500' : 'text-gray-900'}`}>
                  {wordBalance.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">words</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${wordBalance <= 0 ? 'bg-red-400' : wordBalance <= 500 ? 'bg-orange-400' : 'bg-[#D4AF37]'}`}
                  style={{ width: `${Math.min((wordBalance / 2000) * 100, 100)}%` }}
                />
              </div>
              <button
                onClick={() => setShowTopup(true)}
                className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  wordBalance <= 0
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white hover:shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {wordBalance <= 0 ? 'Top Up Now' : 'View Packages'}
              </button>
            </div>
          )}
        </div>

        {/* Center: Main Content */}
        <div className="w-full lg:flex-1 flex flex-col min-w-0">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-[1.1] mb-3 sm:mb-6 max-w-3xl">
              {currentChapterData?.title}
            </h1>
            {currentChapterData?.description && (
              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl">
                {currentChapterData.description}
              </p>
            )}
          </div>

          {chapterLoading ? (
            <div className="flex-1 flex justify-center items-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <LoadingSpinner message="Loading chapter..." />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-start w-full">
              {renderChapterContent()}
            </div>
          )}

          {/* Chapter Quiz — appears after marking complete, before Zunnova */}
          {showQuiz && isCompleted && !quizCompleted && (
            <ChapterQuiz
              chapterOrder={currentChapter}
              studentClass={getUser()?.class || '8'}
              onQuizComplete={handleQuizComplete}
            />
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-gray-100">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapter === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              {!isCompleted && (
                <button
                  onClick={completeChapter}
                  disabled={markingComplete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium disabled:opacity-80 shadow-sm text-sm"
                >
                  {markingComplete ? (
                    <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {markingComplete ? 'Completing...' : 'Mark Complete'}
                </button>
              )}

              {currentChapter < module.chapters.length - 1 ? (
                <button
                  onClick={handleNextChapter}
                  disabled={navigatingNext || isDemo}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-colors font-medium shadow-sm text-sm ${isDemo ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-white hover:bg-[#B8952E]'}`}
                >
                  {navigatingNext ? (
                    <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Next Chapter
                      {isDemo ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setShowCompletionModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B8952E] transition-colors font-medium shadow-sm text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  Complete Module
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Chat — only after quiz or on revisit */}
        {showAIChat && isCompleted && ZunnovaAvailable && !showQuiz && (
          <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 flex flex-col h-[500px] sm:h-[600px] lg:h-[calc(100vh-180px)] lg:sticky lg:top-32">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 flex-1 flex flex-col overflow-hidden">
              <AIChatComponent
                moduleId={moduleId}
                chapterId={currentChapterData._id}
                module={module}
              />
            </div>
          </div>
        )}

        {/* Mobile Zunnova button */}
        {ZunnovaAvailable && isCompleted && !showAIChat && !showQuiz && (
          <button
            onClick={() => setShowAIChat(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#212121] text-[#D4AF37] shadow-xl shadow-black/20 flex items-center justify-center border-2 border-[#D4AF37]/30"
            aria-label="Open AI Assistant"
          >
            <Brain className="w-6 h-6" />
          </button>
        )}
      </div>

      <TopupPopup
        isOpen={showTopup}
        onClose={() => setShowTopup(false)}
        onSuccess={(newBalance) => setWordBalance(newBalance)}
      />

      {/* ─── Completion Modal ─── */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-[#FDFBF5] border-2 border-[#F2E5C5] flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Congratulations on finishing <span className="font-semibold text-gray-800">{module.title}</span>!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/student/submission')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4AF37] text-white rounded-xl font-semibold shadow-sm hover:bg-[#B8952E] transition-colors"
              >
                Submit Your Idea
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="w-full px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ModuleFaceGuard>
  );
}
