'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const diffColors = {
  easy: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

export default function MissionsListPage() {
  const router = useRouter();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try {
        const ms = await studentIC.listMissions();
        setMissions(ms);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const filtered = missions.filter((m) => {
    if (filter === 'submitted') return !!m.mySubmission;
    if (filter === 'open') return !m.mySubmission;
    return true;
  });

  if (loading) return <LoadingSpinner message="Loading missions..." />;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Command Center
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Missions
        </h1>
        <p className="text-gray-600 text-sm mt-2 max-w-2xl">
          Turn what you learn into something real. Every mission awards XP toward your next level.
        </p>

        <div className="flex gap-2 mt-6">
          {['all', 'open', 'submitted'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === f ? 'bg-[#0A2C22] text-white border-[#0A2C22]' : 'bg-white text-[#0A2C22] border-gray-200'}`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100">
            No missions to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered.map((m) => (
              <Link key={m._id} href={`/student/innovation-club/missions/${m._id}`} className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                {m.coverImage ? (
                  <div className="h-32 overflow-hidden">
                    <img src={m.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-br from-[#0A2C22] to-[#0C3B2E] flex items-center justify-center">
                    <Target className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase text-gray-500">{m.roomId?.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${diffColors[m.difficulty] || 'bg-gray-100'}`}>{m.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{m.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-lg font-bold text-[#D4AF37]">+{m.xpAward}</div>
                      <div className="text-[10px] text-gray-500 uppercase">XP</div>
                    </div>
                    {m.mySubmission ? (
                      <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Submitted
                      </span>
                    ) : (
                      <span className="text-xs text-[#0A2C22] font-semibold inline-flex items-center gap-1">Start <ArrowRight className="w-3 h-3" /></span>
                    )}
                  </div>
                  {m.deadline && (
                    <div className="text-[10px] text-gray-400 mt-2">Due {new Date(m.deadline).toLocaleDateString()}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
