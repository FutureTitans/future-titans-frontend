'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  ArrowLeft,
  FileText,
  Download,
  Search,
  Calendar,
  Lock,
  Crown,
  CheckCircle2,
  FileDown,
} from 'lucide-react';

export default function ZunnovaExportPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    // No API endpoint yet -- simulate a brief delay and show toast
    setTimeout(() => {
      setGenerating(false);
      setToast('Export generation started. You will be notified when it is ready.');
      setTimeout(() => setToast(null), 5000);
    }, 1200);
  };

  if (loading) {
    return <LoadingSpinner message="Loading Export Tool..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Export Tool</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The interaction export tool is available exclusively to paid members. Upgrade your account to compile session transcripts and progress reports.
          </p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Access
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
          <div className="glass-panel p-4 flex items-center gap-3 shadow-xl border border-green-200 bg-green-50/90 max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{toast}</p>
            <button
              onClick={() => setToast(null)}
              className="text-green-500 hover:text-green-700 ml-auto text-lg leading-none"
            >
              x
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 relative z-10">
        {/* Back + Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/student/innovation-club/zunnova"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zunnova++
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-md shadow-[#D4AF37]/20">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                Export Interaction Data
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Compile session transcripts and progress reports into downloadable PDF or CSV files.
          </p>
        </div>

        {/* Export Form */}
        <div className="glass-panel p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Generate New Export</h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Date Range */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Student/Cohort Search */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Student / Cohort
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or cohort..."
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
            </div>

            {/* Format Toggle */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Export Format
              </label>
              <div className="inline-flex bg-white/60 border border-white/40 rounded-xl p-1 gap-1">
                {['PDF', 'CSV'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      exportFormat === fmt
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {fmt}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate Export
                </>
              )}
            </button>
          </form>
        </div>

        {/* Export History */}
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Export History</h2>

          <div className="py-8 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-700 mb-2">No Exports Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Use the form above to generate your first export. Completed exports will appear here for download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
