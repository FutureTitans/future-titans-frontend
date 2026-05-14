'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function OutreachFormPage({ params }) {
  const { slug } = params;

  const [form, setForm] = useState({
    name: '',
    school: '',
    email: '',
    phone: '',
    studentsCount: '',
    city: '',
    feedback: '',
    suggestions: '',
    interested: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.interested) {
      setError('Please select whether you are interested.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/association/outreach/submit/${slug}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF9EE] to-[#FAF3D8] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-[#D4AF37]/20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">Thank You!</h2>
          <p className="text-neutral-500 font-semibold leading-relaxed">
            Your response has been submitted. Our team will be in touch with you soon.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-neutral-400 font-semibold">
              Future Titans Innovation Challenge
            </p>
            <a
              href="https://youngpreneurs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#D4AF37] hover:underline"
            >
              youngpreneurs.ai
            </a>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-white';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF9EE] to-[#FAF3D8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#A88020] rounded-2xl shadow-lg shadow-[#D4AF37]/30 mb-4">
            <span className="text-white text-2xl font-black">FT</span>
          </div>
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight mb-1">
            Future Titans
          </h1>
          <p className="text-sm font-semibold text-[#A88020]">
            School Outreach &amp; Feedback Form
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/20 p-8 flex flex-col gap-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ABC High School"
                value={form.school}
                onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@school.edu"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Mumbai"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
                No. of Students (Grade 8–12)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 250"
                value={form.studentsCount}
                onChange={(e) => setForm((f) => ({ ...f, studentsCount: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Feedback
            </label>
            <textarea
              rows={3}
              placeholder="Share your thoughts about the program..."
              value={form.feedback}
              onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Suggestions
            </label>
            <textarea
              rows={3}
              placeholder="Any suggestions for improvement..."
              value={form.suggestions}
              onChange={(e) => setForm((f) => ({ ...f, suggestions: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Interested Yes/No */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-neutral-500 uppercase tracking-wider">
              Are you interested in the Future Titans Innovation Challenge?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {['Yes', 'No'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, interested: opt }))}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    form.interested === opt
                      ? opt === 'Yes'
                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200'
                      : 'border-gray-200 text-gray-500 hover:border-[#D4AF37] hover:text-[#A88020] bg-white'
                  }`}
                >
                  {opt === 'Yes' ? '✓ Yes, Interested' : '✗ Not Interested'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#A88020] text-white font-black py-4 rounded-xl text-base shadow-lg shadow-[#D4AF37]/30 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Response'
            )}
          </button>

          <p className="text-center text-xs text-neutral-400 font-semibold">
            Powered by{' '}
            <a
              href="https://youngpreneurs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A88020] hover:underline"
            >
              youngpreneurs.ai
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
