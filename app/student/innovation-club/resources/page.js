'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ArrowRight,
  Lock,
  Crown,
  FileText,
  Video,
  File,
  Bookmark,
  BookMarked,
  Users,
  Star,
  Clock,
  Play,
  TrendingUp,
  Sparkles,
  Download,
  Compass,
  Boxes,
  Megaphone,
  BarChart3,
  Rocket,
  Lightbulb,
  SlidersHorizontal,
} from 'lucide-react';

const TYPES = ['All', 'Book', 'PDF', 'Worksheet', 'Video'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const STAGES = ['All', 'Discover', 'Build', 'Pitch', 'Scale'];
const SORT_OPTIONS = [
  { value: 'most_used', label: 'Most Used' },
  { value: 'newest', label: 'Newest' },
];

const TYPE_ICONS = { book: BookOpen, pdf: FileText, worksheet: File, video: Video };

const STAGE_META = {
  discover: { icon: Compass, label: 'Discover' },
  build: { icon: Boxes, label: 'Build' },
  pitch: { icon: Megaphone, label: 'Pitch' },
  scale: { icon: BarChart3, label: 'Scale' },
};

function LevelChip({ level }) {
  const styles = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-[#F5D76E]/40 text-[#8A6D1B]',
    advanced: 'bg-red-100 text-red-600',
  };
  if (!level) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold capitalize ${styles[level.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
      {level}
    </span>
  );
}

function CoverImage({ resource, className }) {
  const [failed, setFailed] = useState(false);
  const Icon = TYPE_ICONS[resource.type?.toLowerCase()] || FileText;
  return (
    <div className={`bg-gradient-to-br from-[#123524]/8 to-[#D4AF37]/15 flex items-center justify-center overflow-hidden ${className}`}>
      {resource.coverImage && !failed ? (
        <img
          src={resource.coverImage}
          alt={resource.title}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon className="w-10 h-10 text-[#123524]/25" />
      )}
    </div>
  );
}

export default function ResourceLibraryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ type: 'All', level: 'All', stage: 'All', search: '', sort: 'most_used' });
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const libraryRef = useRef(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchResources();
    fetchStats();
  }, [router]);

  const fetchResources = async (appliedFilters = {}) => {
    try {
      const params = {};
      if (appliedFilters.type && appliedFilters.type !== 'All') params.type = appliedFilters.type.toLowerCase();
      if (appliedFilters.level && appliedFilters.level !== 'All') params.level = appliedFilters.level.toLowerCase();
      if (appliedFilters.stage && appliedFilters.stage !== 'All') params.stage = appliedFilters.stage.toLowerCase();
      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.sort) params.sort = appliedFilters.sort;

      const res = await innovationClub.getResources(params);
      const resourceList = Array.isArray(res) ? res : res?.resources || [];
      setResources(resourceList);

      const bookmarked = new Set();
      resourceList.forEach((r) => {
        if (r.isBookmarked) bookmarked.add(r._id || r.id);
      });
      setBookmarkedIds(bookmarked);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await innovationClub.getResourceStats();
      setStats({
        topResources: res?.mostUsed || [],
        totalDownloads: res?.totalDownloads || 0,
        totalResources: res?.totalResources || 0,
        templateOpens: res?.templateOpens || 0,
        newThisWeek: res?.newThisWeek || 0,
        stageCounts: res?.byStage?.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}) || {},
      });
    } catch (error) {
      console.error('Failed to fetch resource stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchResources(newFilters);
  };

  const handleBookmarkToggle = async (resourceId) => {
    try {
      await innovationClub.toggleBookmark(resourceId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(resourceId)) next.delete(resourceId);
        else next.add(resourceId);
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleOpenResource = async (resource) => {
    try {
      const res = await innovationClub.openResource(resource._id || resource.id);
      const url = res?.fileUrl || resource.url || resource.fileUrl;
      if (url) window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to open resource:', error);
    }
  };

  const scrollToLibrary = () => libraryRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (loading) {
    return <LoadingSpinner message="Loading Resource Library..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Resource Library</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Access a curated library of books, worksheets, templates, and videos covering every stage of the innovation journey. Upgrade your account to browse and download.
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

  const featured = resources.find((r) => r.isFeatured) || resources[0];
  const otherResources = resources.filter((r) => r !== featured);
  const totalWeeklyOpens = (stats?.topResources || []).reduce((s, r) => s + (r.downloadCount || 0), 0);
  const maxTop = Math.max(...(stats?.topResources || []).map((r) => r.downloadCount || 0), 1);

  const ctaFor = (resource) => {
    const t = resource.type?.toLowerCase();
    const label = t === 'video' ? 'Watch' : t === 'pdf' ? 'Preview' : 'Open';
    const Icon = t === 'video' ? Play : ArrowRight;
    return (
      <button
        onClick={() => handleOpenResource(resource)}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#123524] hover:text-[#B8952E] transition-colors"
      >
        {label}
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F1E3]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto grid lg:grid-cols-2 items-center">
          <div className="px-4 sm:px-6 md:px-10 xl:px-14 py-10 sm:py-14">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Innovation Club
            </Link>
            <p className="text-[#123524] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              04 &mdash; Entrepreneurship Resource Library
            </p>
            <h1 className="font-roca text-4xl sm:text-5xl text-[#123524] leading-[1.12] mb-5">
              Find the Right Resource.<br />Start Building.
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mb-6">
              Books, worksheets, templates, and case studies &mdash; organised by type, level, and venture stage.
            </p>
            <div className="inline-flex items-center gap-2.5 border border-[#123524]/25 bg-white/60 rounded-full px-4 py-2 mb-7">
              <Users className="w-4 h-4 text-[#123524]" />
              <span className="text-[#123524] text-sm font-medium">Curated for students and teachers</span>
            </div>
            <div>
              <button
                onClick={scrollToLibrary}
                className="inline-flex items-center gap-2.5 bg-[#123524] text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-[#1B4A32] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Explore All Resources
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative composition */}
          <div className="relative hidden lg:flex items-center justify-center h-[380px] pointer-events-none" aria-hidden="true">
            <div className="absolute inset-8 border border-[#D4AF37]/20 rounded-3xl" />
            <div className="absolute inset-16 border border-[#D4AF37]/10 rounded-3xl rotate-2" />
            <div className="relative w-56 h-56 rounded-3xl bg-gradient-to-br from-[#123524] to-[#0B2418] flex items-center justify-center shadow-2xl shadow-[#123524]/20">
              <BookOpen className="w-24 h-24 text-[#D4AF37]/80" strokeWidth={1.2} />
            </div>
            <div className="absolute top-14 right-24 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float">
              <Rocket className="w-7 h-7 text-[#B8952E]" />
            </div>
            <div className="absolute bottom-16 right-40 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.6s' }}>
              <Compass className="w-6 h-6 text-[#123524]" />
            </div>
            <div className="absolute top-24 left-24 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.2s' }}>
              <BarChart3 className="w-6 h-6 text-[#B8952E]" />
            </div>
            <div className="absolute bottom-14 left-32 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.3s' }}>
              <Lightbulb className="w-5 h-5 text-[#123524]" />
            </div>
          </div>
        </div>
      </section>

      <div ref={libraryRef} className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 xl:px-14 pb-12 scroll-mt-20">
        {/* ===== SEARCH + SORT ===== */}
        <div className="bg-white rounded-2xl border border-[#123524]/10 shadow-sm p-4 sm:p-5 mb-4 relative z-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, topics, or skills"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F7F1E3]/50 border border-[#123524]/10 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 transition-all"
              />
            </div>
            <div className="relative flex items-center gap-2 bg-[#F7F1E3]/50 border border-[#123524]/10 rounded-xl px-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="py-3 pr-2 bg-transparent text-sm font-semibold text-[#123524] focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {[
              { label: 'Type', key: 'type', options: TYPES },
              { label: 'Level', key: 'level', options: LEVELS },
              { label: 'Stage', key: 'stage', options: STAGES },
            ].map((group) => (
              <div key={group.key} className="flex flex-wrap items-center gap-1.5 lg:flex-1">
                <span className="text-xs font-bold text-[#123524] mr-1">{group.label}</span>
                {group.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleFilterChange(group.key, opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      filters[group.key] === opt
                        ? 'bg-[#123524] text-white'
                        : 'text-gray-600 hover:bg-[#123524]/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ===== FEATURED RESOURCE ===== */}
        {featured && (
          <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#FBF7EA] to-[#F5EDD6] p-5 sm:p-6 mb-6 relative">
            <button
              onClick={() => handleBookmarkToggle(featured._id || featured.id)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all z-10"
            >
              {bookmarkedIds.has(featured._id || featured.id) ? (
                <BookMarked className="w-4 h-4 text-[#B8952E]" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-400" />
              )}
            </button>

            <div className="grid md:grid-cols-[minmax(220px,340px)_1fr] gap-6 items-center">
              <CoverImage resource={featured} className="h-48 md:h-56 rounded-xl shadow-md" />
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-[#123524] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg mb-3">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
                <h2 className="font-roca text-2xl sm:text-3xl text-[#123524] mb-2">{featured.title}</h2>
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">{featured.type}</span>
                  <span className="text-gray-300">&middot;</span>
                  <LevelChip level={featured.level} />
                </div>
                <p className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  Used by {(featured.usageCount || 0).toLocaleString('en-IN')} students
                </p>
                {featured.description && (
                  <p className="text-sm text-gray-600 leading-relaxed max-w-lg mb-5 line-clamp-2">{featured.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {featured.duration && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {featured.duration}
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenResource(featured)}
                    className="inline-flex items-center gap-2 bg-[#123524] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#1B4A32] transition-colors"
                  >
                    Open Resource
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== RESOURCE GRID ===== */}
        {otherResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-6">
            {otherResources.map((resource) => {
              const id = resource._id || resource.id;
              const isBookmarked = bookmarkedIds.has(id);
              return (
                <div key={id} className="bg-white rounded-2xl border border-[#123524]/10 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-[#123524]/5 transition-all duration-300">
                  <div className="relative">
                    <CoverImage resource={resource} className="h-36" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBookmarkToggle(id); }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-all"
                    >
                      {isBookmarked ? (
                        <BookMarked className="w-4 h-4 text-[#B8952E]" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-[#123524] leading-snug mb-2 line-clamp-2">{resource.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{resource.type}</span>
                      <LevelChip level={resource.level} />
                    </div>
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-4">
                      <Users className="w-3 h-3" />
                      Used by {(resource.usageCount || 0).toLocaleString('en-IN')} students
                    </p>
                    <div className="mt-auto pt-2 border-t border-gray-50">{ctaFor(resource)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !featured ? (
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-12 text-center mb-6">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Resources Found</h3>
            <p className="text-sm text-gray-500">
              {filters.type !== 'All' || filters.level !== 'All' || filters.stage !== 'All' || filters.search
                ? 'Try adjusting your filters to see more resources.'
                : 'New resources are being added. Check back soon.'}
            </p>
          </div>
        ) : null}

        {/* ===== STAGE STRIP ===== */}
        <div className="bg-white rounded-2xl border border-[#123524]/10 mb-6 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {Object.entries(STAGE_META).map(([key, meta]) => {
              const count = stats?.stageCounts?.[key] || 0;
              const active = filters.stage.toLowerCase() === key;
              return (
                <button
                  key={key}
                  onClick={() => handleFilterChange('stage', meta.label)}
                  className={`flex items-center gap-4 p-5 text-left transition-colors ${active ? 'bg-[#123524]/5' : 'hover:bg-[#F7F1E3]/50'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#123524]/10 flex items-center justify-center flex-shrink-0">
                    <meta.icon className="w-5 h-5 text-[#123524]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-roca text-lg text-[#123524]">{meta.label}</p>
                    <p className="text-xs text-gray-500">{count} resources</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== STATS ROW ===== */}
        {stats && (
          <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4 sm:gap-5 mb-8">
            {/* Most used this week */}
            <div className="bg-white rounded-2xl border border-[#123524]/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#B8952E]" />
                <h3 className="text-sm font-bold text-[#123524]">Most Used This Week</h3>
              </div>
              {stats.topResources.length > 0 ? (
                <div className="space-y-3">
                  {stats.topResources.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-3" title={`${item.title}: ${item.downloadCount || 0} opens`}>
                      <span className="w-5 text-xs font-bold text-gray-400 flex-shrink-0">{i + 1}</span>
                      <p className="text-xs text-gray-700 truncate w-32 flex-shrink-0">{item.title}</p>
                      <div className="flex-1 h-3 bg-gray-100 rounded-r-[3px] overflow-hidden">
                        <div
                          className="h-full bg-[#123524] rounded-r-[3px]"
                          style={{ width: `${Math.max(6, Math.round(((item.downloadCount || 0) / maxTop) * 100))}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#123524] w-10 text-right flex-shrink-0">
                        {(item.downloadCount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-500">Total resource opens</span>
                    <span className="font-bold text-[#123524]">{totalWeeklyOpens.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No usage data yet.</p>
              )}
            </div>

            {/* Template opens */}
            <div className="bg-white rounded-2xl border border-[#123524]/10 p-5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#123524] flex items-center justify-center mb-3">
                <File className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="font-roca text-3xl text-[#123524]">{stats.templateOpens.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Worksheet Opens</p>
            </div>

            {/* New this week */}
            <div className="bg-white rounded-2xl border border-[#123524]/10 p-5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-[#123524]" />
              </div>
              <p className="font-roca text-3xl text-[#123524]">{String(stats.newThisWeek).padStart(2, '0')}</p>
              <p className="text-xs text-gray-500 mt-1">New This Week</p>
              <button
                onClick={() => handleFilterChange('sort', 'newest')}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#123524] hover:text-[#B8952E] transition-colors"
              >
                View all new
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Total downloads */}
            <div className="bg-white rounded-2xl border border-[#123524]/10 p-5 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#123524]/5 flex items-center justify-center mb-3">
                <Download className="w-5 h-5 text-[#123524]" />
              </div>
              <p className="font-roca text-3xl text-[#123524]">{stats.totalDownloads.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Total Opens All Time</p>
              <p className="text-[10px] text-gray-400 mt-1">{stats.totalResources} resources in the library</p>
            </div>
          </div>
        )}

        {/* ===== BOTTOM CTA ===== */}
        <div className="rounded-2xl bg-gradient-to-br from-[#123524] to-[#0B2418] p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 border border-[#D4AF37]/15 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-64 h-64 border border-[#D4AF37]/10 rounded-full pointer-events-none" />
          <h2 className="font-roca text-2xl sm:text-3xl text-white mb-6 relative z-10">
            Resources Built to Be Used, Not Just Saved.
          </h2>
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            <button
              onClick={scrollToLibrary}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Open Library
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { scrollToLibrary(); handleFilterChange('level', 'Beginner'); }}
              className="inline-flex items-center gap-2 border border-white/25 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              Browse by Level
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
