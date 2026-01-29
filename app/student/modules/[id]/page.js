'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { modules, aiChat } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { BookOpen, Play, MessageCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Brain, User, Trophy } from 'lucide-react';
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
      setCurrentChapter(currentChapter + 1);
      setShowAIChat(false);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setShowAIChat(false);
    }
  };

  const completeChapter = async () => {
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
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes('youtu.be')) {
        const id = parsed.pathname.replace('/', '');
        return `https://www.youtube.com/embed/${id}`;
      }

      if (parsed.hostname.includes('youtube.com')) {
        const id = parsed.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;

        if (parsed.pathname.startsWith('/embed/')) {
          return url;
        }
      }

      return url;
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
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap text-gray-700">
              {content.text}
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              id="chapter-video-player"
              src={getYouTubeEmbedUrl(content.videoUrl)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={chapterContent.title}
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="glass p-12 rounded-2xl text-center">
            <div className="text-6xl mb-6">🎧</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={content.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="glass p-12 rounded-2xl text-center">
            <div className="text-6xl mb-6">📄</div>
            <p className="text-lg text-gray-700 mb-6">PDF Document</p>
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition font-semibold inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Open PDF
            </a>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-gray-600">Content type not supported</p>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading module..." />;
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center card">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Module not found</h2>
          <button
            onClick={() => router.push('/student/modules')}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const currentChapterData = module.chapters[currentChapter];
  const progressPercentage = Math.round(((currentChapter + 1) / module.chapters.length) * 100);

  return (
    <div className="min-h-screen relative" style={{ zIndex: 1 }}>
      {/* Module Info Bar */}
      <div className="glass-strong border-b border-white/20 sticky top-0 z-50">
        <div className="container-lg py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
              <button
                onClick={() => router.push('/student/modules')}
                className="text-gray-600 hover:text-red-600 transition p-1.5 md:p-2 hover:bg-white/50 rounded-lg flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              {module.mentorProfilePicture && (
                <img 
                  src={module.mentorProfilePicture} 
                  alt="Mentor" 
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white object-cover shadow-md flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-base md:text-xl text-gray-800 truncate">{module.title}</h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Chapter {currentChapter + 1} of {module.chapters.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right sm:text-left">
                <div className="text-xs md:text-sm font-semibold text-gray-800">{progressPercentage}%</div>
                <div className="text-[10px] md:text-xs text-gray-600">Complete</div>
              </div>
              
              {currentChapterData?.aiInteractionEnabled && (
                <button
                  onClick={async () => {
                    const nextVisible = !showAIChat;
                    if (nextVisible && chapterCompleted[currentChapterData._id]) {
                      setShowAIChat(true);
                    } else if (!nextVisible) {
                      setShowAIChat(false);
                    } else {
                      alert('Please mark this chapter as complete first to access the AI chat.');
                    }
                  }}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl transition font-medium text-xs md:text-sm ${
                    showAIChat
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'glass-subtle text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">ZUNOVA</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 md:mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 md:h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Chapter List */}
        <div className="w-full lg:w-80 glass border-r-0 lg:border-r border-white/20 min-h-[200px] lg:min-h-[calc(100vh-80px)] p-4 lg:p-6 order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-4 lg:mb-6">
            <BookOpen className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-base lg:text-lg text-gray-800">Chapters</h3>
          </div>
          <div className="space-y-2 overflow-x-auto flex lg:block gap-2 lg:gap-0 pb-2 lg:pb-0">
            {module.chapters.map((chapter, index) => {
              const isCompleted = chapterCompleted[chapter._id];
              const isActive = index === currentChapter;
              
              return (
                <button
                  key={chapter._id}
                  onClick={() => setCurrentChapter(index)}
                  className={`min-w-[200px] lg:w-full text-left p-3 lg:p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : isCompleted
                      ? 'glass-subtle hover:bg-white/50 border border-green-200'
                      : 'glass-subtle hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0 ${
                      isActive ? 'bg-white text-red-600' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted && !isActive ? (
                        <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-xs lg:text-sm ${isActive ? 'text-white' : 'text-gray-800'} truncate`}>
                        {chapter.title}
                      </p>
                      <p className={`text-[10px] lg:text-xs mt-1 ${isActive ? 'text-white/75' : 'text-gray-600'}`}>
                        {chapter.content?.type || 'Content'}
                      </p>
                    </div>
                    {chapter.aiInteractionEnabled && (
                      <Brain className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-yellow-500'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row order-1 lg:order-2">
          {/* Content Area */}
          <div className={`${showAIChat ? 'lg:w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="p-4 md:p-6 lg:p-8">
              {/* Chapter Header */}
              <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg flex-shrink-0">
                    {currentChapter + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-1 break-words">
                      {currentChapterData?.title}
                    </h2>
                    {currentChapterData?.description && (
                      <p className="text-sm lg:text-base text-gray-600 break-words">
                        {currentChapterData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              {chapterLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Loading chapter..." />
                </div>
              ) : (
                <div className="mb-8">
                  {renderChapterContent()}
                </div>
              )}

              {/* Chapter Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 lg:pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevChapter}
                  disabled={currentChapter === 0}
                  className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 glass-subtle text-gray-700 rounded-xl hover:bg-white/50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm lg:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {!chapterCompleted[currentChapterData?._id] && (
                    <button
                      onClick={completeChapter}
                      className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition font-semibold text-sm lg:text-base"
                    >
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      Mark Complete
                    </button>
                  )}

                  {currentChapter < module.chapters.length - 1 ? (
                    <button
                      onClick={handleNextChapter}
                      className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition font-semibold text-sm lg:text-base"
                    >
                      Next Chapter
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/student/dashboard')}
                      className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition font-semibold text-sm lg:text-base"
                    >
                      <Trophy className="w-4 h-4 lg:w-5 lg:h-5" />
                      Complete Module
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Panel - Mobile: Full width overlay, Desktop: Side panel */}
          {showAIChat && currentChapterData?.aiInteractionEnabled && chapterCompleted[currentChapterData._id] && (
            <div className={`${showAIChat ? 'w-full lg:w-1/2' : 'hidden'} border-t lg:border-t-0 lg:border-l border-white/20 glass`}>
              <AIChatComponent 
                moduleId={moduleId} 
                chapterId={currentChapterData._id}
                module={module}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
