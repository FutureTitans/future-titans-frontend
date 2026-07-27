'use client';

import { useEffect, useState } from 'react';
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
  Download,
  Bookmark,
  BookMarked,
  Eye,
  Star,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BarChart3,
  Lightbulb,
  Rocket,
  Presentation,
  Layers,
  SortAsc,
} from 'lucide-react';

const TYPES = ['All', 'Book', 'PDF', 'Worksheet', 'Video'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const STAGES = ['All', 'Discover', 'Build', 'Pitch', 'Scale'];
const SORT_OPTIONS = [
  { value: 'most_used', label: 'Most Used' },
  { value: 'newest', label: 'Newest' },
];

function TypeBadge({ type }) {
  const styles = {
    book: 'bg-purple-50 text-purple-700',
    pdf: 'bg-red-50 text-red-700',
    worksheet: 'bg-green-50 text-green-700',
    video: 'bg-blue-50 text-blue-700',
  };
  const icons = {
    book: BookOpen,
    pdf: FileText,
    worksheet: File,
    video: Video,
  };
  const Icon = icons[type?.toLowerCase()] || FileText;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${styles[type?.toLowerCase()] || 'bg-gray-50 text-gray-600'}`}>
      <Icon className="w-3 h-3" />
      {type}
    </span>
  );
}

function LevelBadge({ level }) {
  const styles = {
    beginner: 'bg-green-50 text-green-700',
    intermediate: 'bg-amber-50 text-amber-700',
    advanced: 'bg-red-50 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${styles[level?.toLowerCase()] || 'bg-gray-50 text-gray-600'}`}>
      {level}
    </span>
  );
}

const stageIcons = {
  discover: Lightbulb,
  build: Rocket,
  pitch: Presentation,
  scale: Layers,
};

export default function ResourceLibraryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ type: 'All', level: 'All', stage: 'All', search: '', sort: 'most_used' });
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

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
      if (appliedFilters.type && appliedFilters.type !== 'All') params.type = appliedFilters.type;
      if (appliedFilters.level && appliedFilters.level !== 'All') params.level = appliedFilters.level;
      if (appliedFilters.stage && appliedFilters.stage !== 'All') params.stage = appliedFilters.stage;
      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.sort) params.sort = appliedFilters.sort;

      const res = await innovationClub.getResources(params);
      const resourceList = res?.resources || [];
      setResources(resourceList);

      // Track bookmarked resources
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
      setStats(res);
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
        if (next.has(resourceId)) {
          next.delete(resourceId);
        } else {
          next.add(resourceId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleOpenResource = async (resource) => {
    try {
      await innovationClub.openResource(resource._id || resource.id);
      if (resource.url) {
        window.open(resource.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to open resource:', error);
    }
  };

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

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 relative z-10">
        {/* Back + Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/student/innovation-club"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Innovation Club
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            Resource Library
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Curated resources to support every stage of your innovation journey -- from discovery to scale.
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all shadow-sm"
            />
          </div>
          <div className="relative flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-3 bg-white/80 border border-white/40 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all appearance-none pr-8 shadow-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 sm:mb-8">
          {/* Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mr-1">Type</span>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => handleFilterChange('type', t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.type === t ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Level */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mr-1">Level</span>
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => handleFilterChange('level', l)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.level === l ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Stage */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mr-1">Stage</span>
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => handleFilterChange('stage', s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.stage === s ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Resource */}
        {featured && (
          <div className="glass-panel p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-white to-[#F5D76E]/5">
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4AF37] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Star className="w-3 h-3" />
                Featured
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start mt-6 sm:mt-4">
              {/* Cover placeholder */}
              <div className="w-full md:w-48 h-40 md:h-56 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-12 h-12 text-gray-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {featured.type && <TypeBadge type={featured.type} />}
                  {featured.level && <LevelBadge level={featured.level} />}
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {featured.title}
                </h2>

                {featured.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {featured.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                  {featured.usageCount != null && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {featured.usageCount} uses
                    </span>
                  )}
                  {featured.stage && (
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {featured.stage}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleOpenResource(featured)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                >
                  Open Resource
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {otherResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {otherResources.map((resource) => {
              const id = resource._id || resource.id;
              const isBookmarked = bookmarkedIds.has(id);

              return (
                <div key={id} className="glass-panel p-4 sm:p-5 flex flex-col group hover:shadow-glass-lg transition-all duration-300">
                  {/* Cover */}
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4 border border-gray-100 overflow-hidden relative">
                    {resource.coverImage ? (
                      <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-8 h-8 text-gray-300" />
                    )}
                    {/* Bookmark toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkToggle(id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
                    >
                      {isBookmarked ? (
                        <BookMarked className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {resource.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {resource.type && <TypeBadge type={resource.type} />}
                    {resource.level && <LevelBadge level={resource.level} />}
                  </div>

                  {resource.usageCount != null && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <Eye className="w-3 h-3" />
                      {resource.usageCount} uses
                    </p>
                  )}

                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => handleOpenResource(resource)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                    >
                      Open
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !featured ? (
          <div className="glass-panel p-12 text-center mb-10">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Resources Found</h3>
            <p className="text-sm text-gray-500">
              {filters.type !== 'All' || filters.level !== 'All' || filters.stage !== 'All' || filters.search
                ? 'Try adjusting your filters to see more resources.'
                : 'New resources are being added. Check back soon.'}
            </p>
          </div>
        ) : null}

        {/* Stage Quick Links */}
        <div className="glass-panel p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Browse by Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STAGES.filter((s) => s !== 'All').map((stage) => {
              const StageIcon = stageIcons[stage.toLowerCase()] || Lightbulb;
              const stageCount = stats?.stageCounts?.[stage.toLowerCase()] || resources.filter((r) => r.stage?.toLowerCase() === stage.toLowerCase()).length;

              return (
                <button
                  key={stage}
                  onClick={() => handleFilterChange('stage', stage)}
                  className={`p-4 rounded-2xl border transition-all duration-300 text-center group hover:shadow-sm ${
                    filters.stage === stage
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
                      : 'bg-white/60 border-white/40 hover:bg-white/80'
                  }`}
                >
                  <StageIcon className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                    filters.stage === stage ? 'text-[#B8952E]' : 'text-gray-400 group-hover:text-[#B8952E]'
                  }`} />
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{stage}</p>
                  <p className="text-[10px] text-gray-500">{stageCount} resources</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Most Used This Week */}
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#B8952E]" />
                <h3 className="text-sm font-semibold text-gray-900">Most Used This Week</h3>
              </div>
              {stats.topResources && stats.topResources.length > 0 ? (
                <div className="space-y-3">
                  {stats.topResources.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700 truncate flex-1">{item.title}</p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{item.usageCount} uses</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No data available yet.</p>
              )}
            </div>

            {/* Template Opens */}
            <div className="glass-panel p-5 sm:p-6 flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-6 h-6 text-[#B8952E] mb-3" />
              <p className="text-3xl font-light text-gray-900 tracking-tight">{stats.templateOpens || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Template Opens</p>
            </div>

            {/* New This Week */}
            <div className="glass-panel p-5 sm:p-6 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-6 h-6 text-[#B8952E] mb-3" />
              <p className="text-3xl font-light text-gray-900 tracking-tight">{stats.newThisWeek || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">New This Week</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
