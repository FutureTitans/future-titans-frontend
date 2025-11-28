'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { modules, aiChat } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { BookOpen, Play, MessageCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, Brain } from 'lucide-react';
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
  const [chapterCompleted, setChapterCompleted] = useState({}); // Track which chapters are marked complete

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
      
      // Check if this chapter was already marked complete
      // This ensures chat history loads properly
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

  // YouTube Iframe API setup (chat no longer auto-opens - must click "Mark Complete" first)
  useEffect(() => {
    if (!module || !module.chapters || module.chapters.length === 0) return;
    const current = module.chapters[currentChapter];
    if (!current || current.content?.type !== 'video') return;
    if (typeof window === 'undefined') return;

    const onYouTubeIframeAPIReady = () => {
      if (!window.YT || !window.YT.Player) return;
      // eslint-disable-next-line no-undef
      const player = new YT.Player('chapter-video-player', {
        events: {
          onStateChange: (event) => {
            // Video ended - but chat only opens after "Mark Complete" is clicked
            // This is just for tracking video completion if needed
            if (event.data === 0) {
              console.log('Video ended for chapter:', current.title);
            }
          },
        },
      });
    };

    // If API already loaded
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
      setAutoStartedChat(false);
    }
  };

  const completeChapter = async () => {
    try {
      const chapterId = module.chapters[currentChapter]._id;
      await aiChat.completeChapter(moduleId, chapterId);
      
      // Mark chapter as completed locally
      setChapterCompleted(prev => ({ ...prev, [chapterId]: true }));
      
      // Refresh module data to update progress
      await fetchModule();

      // Open AI chat ONLY after marking complete (this is the only way to open chat)
      const current = module.chapters[currentChapter];
      if (current?.aiInteractionEnabled) {
        setShowAIChat(true);
        // Auto-start the chat with a seed message
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

      // youtu.be/<id>
      if (parsed.hostname.includes('youtu.be')) {
        const id = parsed.pathname.replace('/', '');
        return `https://www.youtube.com/embed/${id}`;
      }

      // youtube.com/watch?v=<id>
      if (parsed.hostname.includes('youtube.com')) {
        const id = parsed.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;

        // already an embed URL
        if (parsed.pathname.startsWith('/embed/')) {
          return url;
        }
      }

      // Fallback to original URL
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
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {content.text}
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {/* We give the iframe an id so YouTube Iframe API can hook into it if needed */}
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
          <div className="bg-neutral-light rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <audio controls className="w-full max-w-md mx-auto">
              <source src={content.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="bg-neutral-light rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="mb-4">PDF Document</p>
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Open PDF
            </a>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-neutral-medium">Content type not supported</p>
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
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Module not found</h2>
          <button
            onClick={() => router.push('/student/modules')}
            className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const currentChapterData = module.chapters[currentChapter];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border sticky top-0 z-10">
        <div className="container-lg py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/student/modules')}
                className="text-primary-red hover:text-primary-darkRed transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-xl">{module.title}</h1>
                <p className="text-sm text-neutral-medium">
                  Chapter {currentChapter + 1} of {module.chapters.length}: {currentChapterData?.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress */}
              <div className="text-sm text-neutral-medium">
                {Math.round(((currentChapter + 1) / module.chapters.length) * 100)}% Complete
              </div>
              
              {/* AI Chat Toggle */}
              {currentChapterData?.aiInteractionEnabled && (
                <button
                  onClick={async () => {
                    const nextVisible = !showAIChat;
                    // Only allow opening chat if chapter is marked complete
                    if (nextVisible && chapterCompleted[currentChapterData._id]) {
                      setShowAIChat(true);
                    } else if (!nextVisible) {
                      setShowAIChat(false);
                    } else {
                      // Chapter not completed yet - show message
                      alert('Please mark this chapter as complete first to access the AI chat.');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    showAIChat
                      ? 'bg-primary-red text-white'
                      : 'bg-neutral-light text-neutral-dark hover:bg-neutral-border'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  AI Co-Founder
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-neutral-light rounded-full h-2">
              <div
                className="bg-gradient-red-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentChapter + 1) / module.chapters.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Chapter List */}
        <div className="w-80 bg-neutral-light border-r border-neutral-border min-h-screen p-6">
          <h3 className="font-bold mb-4">📚 Chapters</h3>
          <div className="space-y-2">
            {module.chapters.map((chapter, index) => (
              <button
                key={chapter._id}
                onClick={() => setCurrentChapter(index)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  index === currentChapter
                    ? 'bg-primary-red text-white'
                    : 'bg-white hover:bg-neutral-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index === currentChapter ? 'bg-white text-primary-red' : 'bg-neutral-border'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{chapter.title}</p>
                    <p className={`text-xs ${index === currentChapter ? 'text-white opacity-75' : 'text-neutral-medium'}`}>
                      {chapter.content?.type || 'Content'}
                    </p>
                  </div>
                  {chapter.aiInteractionEnabled && (
                    <Brain className="w-4 h-4 opacity-75" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Content Area */}
          <div className={`${showAIChat ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="p-8">
              {/* Chapter Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  {currentChapterData?.title}
                </h2>
                {currentChapterData?.description && (
                  <p className="text-neutral-medium text-lg">
                    {currentChapterData.description}
                  </p>
                )}
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
              <div className="flex justify-between items-center pt-8 border-t border-neutral-border">
                <button
                  onClick={handlePrevChapter}
                  disabled={currentChapter === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-border transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={completeChapter}
                    className="flex items-center gap-2 px-6 py-3 bg-semantic-success text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>

                      {currentChapter < module.chapters.length - 1 ? (
                        <button
                          onClick={handleNextChapter}
                          className="flex items-center gap-2 px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-primary-darkRed transition"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push('/student/dashboard')}
                          className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-white rounded-lg hover:bg-accent-amber transition"
                        >
                          Back to Dashboard
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Panel - Only show if chapter is marked complete */}
          {showAIChat && currentChapterData?.aiInteractionEnabled && chapterCompleted[currentChapterData._id] && (
            <div className="w-1/2 border-l border-neutral-border">
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
