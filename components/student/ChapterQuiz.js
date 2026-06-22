'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Brain, Loader, AlertCircle, RotateCcw } from 'lucide-react';

const SURGE_LABELS = {
  0: 'Spot & Shift',
  1: 'Unbundle & Understand',
  2: 'Reframe & Run',
  3: 'Generate & Go',
  4: 'Evaluate & Empower',
};

export default function ChapterQuiz({ chapterOrder, studentClass, onQuizComplete }) {
  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setPhase('loading');
    setError(null);
    try {
      const res = await fetch(
        `/api/quiz/questions?chapterOrder=${chapterOrder}&studentClass=${encodeURIComponent(studentClass)}`
      );
      if (!res.ok) throw new Error('Failed to load quiz');
      const data = await res.json();
      if (!data.questions?.length) throw new Error('No questions available');
      setQuestions(data.questions);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setResults(null);
      setPhase('answering');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  }, [chapterOrder, studentClass]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === questions.length;
  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setPhase('submitting');
    try {
      const answers = questions.map(q => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[q.id],
      }));
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error('Failed to submit quiz');
      const data = await res.json();
      setResults(data);
      setPhase('results');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreMessage = (pct) => {
    if (pct >= 90) return 'Outstanding. You have a strong grasp of this chapter.';
    if (pct >= 70) return 'Great work. Solid understanding of the key concepts.';
    if (pct >= 50) return 'Good effort. Review the explanations below to strengthen your understanding.';
    return 'Keep learning. Go through the explanations to build your understanding.';
  };

  // --- Loading ---
  if (phase === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center gap-4 mt-6">
        <Loader className="w-7 h-7 text-[#D4AF37] animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Preparing your chapter quiz...</p>
      </div>
    );
  }

  // --- Error ---
  if (phase === 'error') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center gap-4 mt-6">
        <AlertCircle className="w-7 h-7 text-red-400" />
        <p className="text-gray-600 text-sm">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={fetchQuestions}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
          <button
            onClick={onQuizComplete}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Skip to Zunnova
          </button>
        </div>
      </div>
    );
  }

  // --- Results ---
  if (phase === 'results' && results) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
        {/* Score header */}
        <div className="px-6 py-8 border-b border-gray-100 text-center bg-gradient-to-b from-gray-50 to-white">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
            {SURGE_LABELS[chapterOrder]} — Quiz Results
          </p>
          <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <span className={`text-3xl font-bold ${getScoreColor(results.percentage)}`}>
              {results.percentage}%
            </span>
          </div>
          <p className="text-gray-900 font-semibold text-lg">
            {results.score} of {results.totalQuestions} correct
          </p>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            {getScoreMessage(results.percentage)}
          </p>
        </div>

        {/* Results list */}
        <div className="px-5 py-5 max-h-[420px] overflow-y-auto space-y-3">
          {results.results.map((r, i) => (
            <div
              key={r.questionId}
              className={`rounded-xl p-4 border-l-4 ${
                r.isCorrect
                  ? 'border-l-emerald-500 bg-emerald-50/50'
                  : 'border-l-red-400 bg-red-50/40'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-2">
                {r.isCorrect ? (
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4.5 h-4.5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  {i + 1}. {r.question}
                </p>
              </div>
              {!r.isCorrect && (
                <div className="ml-7 mb-2 space-y-1">
                  <p className="text-xs text-red-600">
                    Your answer: {r.options[r.selectedIndex]?.letter}. {r.options[r.selectedIndex]?.text}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Correct: {r.correctAnswer}. {r.options[r.correctIndex]?.text}
                  </p>
                </div>
              )}
              <p className="ml-7 text-xs text-gray-500 leading-relaxed">{r.explanation}</p>
            </div>
          ))}
        </div>

        {/* Continue button */}
        <div className="px-5 py-5 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onQuizComplete}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#D4AF37] text-white rounded-xl font-semibold text-sm hover:bg-[#B8952E] transition-colors shadow-sm"
          >
            <Brain className="w-4.5 h-4.5" />
            Continue to Zunnova
          </button>
        </div>
      </div>
    );
  }

  // --- Answering / Submitting ---
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
            {SURGE_LABELS[chapterOrder]} Quiz
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {answeredCount}/{questions.length} answered
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? 'bg-[#D4AF37] scale-125'
                  : selectedAnswers[q.id] !== undefined
                  ? 'bg-[#D4AF37]/40'
                  : 'bg-gray-200'
              }`}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="px-5 py-5">
          <p className="text-xs text-gray-400 font-semibold mb-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-base font-semibold text-gray-900 leading-relaxed mb-5">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentQuestion.id] === i;
              return (
                <button
                  key={opt.letter}
                  onClick={() => handleSelect(currentQuestion.id, i)}
                  disabled={phase === 'submitting'}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#FDFBF5] ring-1 ring-[#D4AF37]/30'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed pt-0.5">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentIndex(prev => prev - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="flex-1" />

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || phase === 'submitting'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-white text-sm font-semibold hover:bg-[#B8952E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {phase === 'submitting' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {phase === 'submitting'
                ? 'Submitting...'
                : allAnswered
                ? 'Submit Quiz'
                : `Answer all (${answeredCount}/${questions.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
