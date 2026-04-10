'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { modules, aiChat, auth } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { BookOpen, Play, MessageCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Brain, User, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AIChatComponent from '@/components/student/AIChat';

export default function ModulePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id;

  const [module, setModule] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState({});
  const [showChaptersConfig, setShowChaptersConfig] = useState(true); // default open on desktop
  const [markingComplete, setMarkingComplete] = useState(false);
  const [navigatingNext, setNavigatingNext] = useState(false);

  // Time tracking heartbeat
  useEffect(() => {
    if (!module || !moduleId) return;

    // Heartbeat every 60 seconds
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

    fetchModule();
  }, [router, moduleId]);

  useEffect(() => {
    if (module && module.chapters && module.chapters.length > 0) {
      const chapterId = module.chapters[currentChapter]._id;
      fetchChapterContent(chapterId);

      const checkChapterComplete = async () => {
        try {
          const history = await aiChat.getChatHistory(moduleId, chapterId);
          if (history.conversation && history.conversation.length > 0) {
            setChapterCompleted(prev => ({ ...prev, [chapterId]: true }));
            setShowAIChat(true);
          }
        } catch (e) {
          // Chapter not started yet
        }
      };
      checkChapterComplete();
    }
  }, [module, currentChapter]);

  useEffect(() => {
    if (!module || !module.chapters || module.chapters.length === 0) return;
    const current = module.chapters[currentChapter];
    if (!current || current.content?.type !== 'video') return;
    if (typeof window === 'undefined') return;

    const onYouTubeIframeAPIReady = () => {
      if (!window.YT || !window.YT.Player) return;
      const player = new window.YT.Player('chapter-video-player', {
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              console.log('Video ended for chapter:', current.title);
            }
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

  const fetchModule = async () => {
    try {
      const data = await modules.getById(moduleId);
      setModule(data);

      // Load completion state from user's profile so it persists across refreshes
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
          setChapterCompleted(completed);
        }
      } catch (e) {
        console.error('Failed to load completion state:', e);
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
        setShowAIChat(false);
        setNavigatingNext(false);
      }, 800);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setShowAIChat(false);
    }
  };

  const completeChapter = async () => {
    setMarkingComplete(true);
    try {
      const chapterId = module.chapters[currentChapter]._id;
      await aiChat.completeChapter(moduleId, chapterId);

      setChapterCompleted(prev => ({ ...prev, [chapterId]: true }));
      await fetchModule();

      const current = module.chapters[currentChapter];
      if (current?.aiInteractionEnabled) {
        setShowAIChat(true);
        try {
          await aiChat.sendMessage(
            moduleId,
            current._id,
            'I have just completed this chapter. Please guide me with SURGE-style questions to reflect and improve my entrepreneurial mindset based on this module.'
          );
        } catch (err) {
          console.error('Failed to auto-start AI chat after completion:', err);
        }
      }
    } catch (error) {
      console.error('Failed to complete chapter:', error);
      alert('Failed to mark chapter as complete: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setMarkingComplete(false);
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
        return (
          <div className="aspect-video bg-black rounded-[24px] overflow-hidden shadow-2xl border-4 border-white/50 relative group">
            <iframe
              id="chapter-video-player"
              src={getYouTubeEmbedUrl(content.videoUrl)}
              className="w-full h-full absolute inset-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={chapterContent.title}
            />
          </div>
        );

      case 'audio':
        return (
          <div className="glass-panel p-12 text-center shadow-lg border-white/40">
            <div className="text-6xl mb-6">🎧</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={content.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'pdf':
        return (
          <div className="glass-panel p-12 text-center shadow-lg border-white/40">
            <div className="text-6xl mb-6">📄</div>
            <p className="text-lg text-gray-700 mb-6 font-medium">PDF Document provided for this chapter</p>
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-8 py-3 inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Open PDF
            </a>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 glass-panel shadow-lg border-white/40">
            <p className="text-gray-600 font-medium">Content type not supported</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading module..." />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Module not found</h2>
          <button
            onClick={() => router.push('/student/modules')}
            className="glass-button px-6 py-3"
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
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ zIndex: 1 }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-[#F5D76E]/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* ─── Top Nav Bar ─── */}
      <div className="glass-strong border-b border-white/40 sticky top-0 z-50">
        <div className="w-full px-4 md:px-8 xl:px-12 py-3 md:py-4 max-w-[1920px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
              <button
                onClick={() => router.push('/student/modules')}
                className="text-gray-600 hover:text-[#D4AF37] transition p-1.5 md:p-2 hover:bg-white/60 rounded-xl flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              {module.mentorProfilePicture && (
                <img
                  src={module.mentorProfilePicture}
                  alt="Mentor"
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-lg md:text-2xl text-gray-900 truncate">{module.title}</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                  Chapter {currentChapter + 1} of {module.chapters.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right sm:text-left">
                <div className="text-xs md:text-sm font-bold text-[#B8952E]">{progressPercentage}%</div>
                <div className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">Complete</div>
              </div>

              {ZunnovaAvailable && (
                <button
                  onClick={async () => {
                    const nextVisible = !showAIChat;
                    if (nextVisible && isCompleted) {
                      setShowAIChat(true);
                    } else if (!nextVisible) {
                      setShowAIChat(false);
                    } else {
                      alert('Please mark this chapter as complete first to access the AI chat.');
                    }
                  }}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all font-semibold text-xs md:text-sm ${showAIChat
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-md shadow-[#D4AF37]/30 border border-[#D4AF37]/10'
                    : 'bg-white/50 text-[#B8952E] hover:bg-white/80 border border-white/60'
                    }`}
                >
                  <Brain className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Zunnova AI</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="mt-3 md:mt-4">
            <div className="w-full bg-black/5 rounded-full h-1.5 md:h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] h-1.5 md:h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="flex xl:flex-row flex-col max-w-[1920px] mx-auto p-4 md:p-8 xl:p-12 gap-8 flex-1 min-h-[calc(100vh-130px)] h-full w-full">
        {/* Left Section: Chapters List */}
        <div className="xl:w-[25%] w-full flex-shrink-0">
          <div className="glass-panel p-4 sm:p-5 h-full xl:min-h-[600px] xl:sticky xl:top-[100px] flex flex-col">
            <div className="flex items-center gap-3 mb-5 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8952E]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight">Course Chapters</h3>
                <p className="text-xs text-gray-500 font-medium">{module.chapters.length} Total</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {module.chapters.map((chapter, index) => {
                const completed = chapterCompleted[chapter._id];
                const isActive = index === currentChapter;

                return (
                  <button
                    key={chapter._id}
                    onClick={() => {
                      setCurrentChapter(index);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border ${isActive
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] shadow-lg shadow-[#D4AF37]/20 border-transparent text-white'
                      : completed
                        ? 'bg-white/60 hover:bg-white/90 border-[#D4AF37]/30 text-gray-800'
                        : 'bg-white/40 hover:bg-white/70 border-white/40 text-gray-600'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isActive
                        ? 'bg-white text-[#D4AF37]'
                        : completed
                          ? 'bg-[#D4AF37] text-white'
                          : 'bg-black/5 text-gray-400'
                        }`}>
                        {completed && !isActive ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm line-clamp-2 leading-snug ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {chapter.title}
                        </p>
                        <p className={`text-[10px] mt-1 font-medium capitalize flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {chapter.content?.type === 'video' ? <Play className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                          {chapter.content?.type || 'Content'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Section: Content Area (Video) */}
        <div className={`flex-1 min-w-0 transition-all duration-300 flex flex-col xl:max-w-none ${showAIChat && isCompleted && ZunnovaAvailable ? 'xl:w-[50%]' : 'w-full'}`}>
          <div className="glass-panel p-4 sm:p-6 md:p-8 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-4 mb-6 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                {currentChapter + 1}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {currentChapterData?.title}
                </h2>
                {currentChapterData?.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {currentChapterData.description}
                  </p>
                )}
              </div>
            </div>

            {chapterLoading ? (
              <div className="flex-1 flex justify-center items-center py-16">
                <LoadingSpinner message="Loading chapter..." />
              </div>
            ) : (
              <div className="flex-1">
                {renderChapterContent()}
              </div>
            )}

            {/* Zunnova Coming Soon Cool Indicator */}
            {!isCompleted && ZunnovaAvailable && (
              <div className="mt-8 mb-2 relative overflow-hidden rounded-2xl bg-white border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10 group transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#D4AF37]/10 opacity-50"></div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_2s_infinite]"></div>

                <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    {/* Glowing Brain Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-md opacity-40 animate-pulse"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center p-3 shadow-inner">
                        <Brain className="w-full h-full text-white" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#B8952E] to-[#D4AF37] bg-clip-text text-transparent flex items-center gap-3">
                        Zunnova AI is waiting...
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base mt-1 font-medium max-w-lg leading-relaxed">
                        Ready to reflect on what you&apos;ve learned? Click <span className="font-bold text-gray-800">&quot;Mark Complete&quot;</span> below to start your personalized interactive session with Zunnova!
                      </p>
                    </div>
                  </div>

                  {/* Subtle arrow pointing down to Mark Complete */}
                  <div className="hidden sm:flex flex-shrink-0 animate-bounce">
                    <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-5 h-5 text-[#B8952E] transform rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Bar inside content area */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-black/5 shrink-0">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapter === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/50 text-gray-600 hover:bg-white/80 border border-black/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                {!isCompleted && (
                  <button
                    onClick={completeChapter}
                    disabled={markingComplete}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1B6B4C] to-[#0F5132] text-white rounded-full hover:shadow-lg transition-all font-semibold text-sm relative overflow-hidden disabled:opacity-80"
                  >
                    {markingComplete && (
                      <div className="absolute inset-0 bg-white/20">
                        <div className="h-full bg-white/30 rounded-full animate-[progressBar_1.5s_ease-in-out_infinite]" />
                      </div>
                    )}
                    {markingComplete ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </>
                    )}
                  </button>
                )}

                {currentChapter < module.chapters.length - 1 ? (
                  <button
                    onClick={handleNextChapter}
                    disabled={navigatingNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white rounded-full hover:shadow-lg transition-all font-semibold text-sm shadow-[#D4AF37]/20 relative overflow-hidden disabled:opacity-80"
                  >
                    {navigatingNext && (
                      <div className="absolute inset-0 bg-white/20">
                        <div className="h-full bg-white/30 rounded-full animate-[progressBar_0.8s_ease-in-out_forwards]" />
                      </div>
                    )}
                    {navigatingNext ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Next Chapter
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/student/dashboard')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#B8952E] to-[#D4AF37] text-white rounded-full hover:shadow-lg transition-all font-semibold text-sm shadow-[#D4AF37]/20"
                  >
                    <Trophy className="w-4 h-4" />
                    Complete Module
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: AI Chat Layout (Side Panel) */}
        {showAIChat && isCompleted && ZunnovaAvailable && (
          <div className="xl:w-[25%] w-full transition-all duration-300 flex-shrink-0 animate-fade-in-up">
            <div className="h-full max-h-[600px] xl:max-h-[calc(100vh-160px)] xl:sticky xl:top-[120px]">
              <AIChatComponent
                moduleId={moduleId}
                chapterId={currentChapterData._id}
                module={module}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
