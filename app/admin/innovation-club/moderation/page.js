'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Check, Trash2, Star } from 'lucide-react';
import { adminICPanel } from '@/lib/api';

const TYPE_TABS = [
  { key: '',           label: 'All' },
  { key: 'post',       label: 'Reported posts' },
  { key: 'question',   label: 'Live questions' },
  { key: 'confession', label: 'Confessions' },
];

const STATUS_TABS = ['pending', 'approved', 'removed', 'selected_for_live', 'all'];

const statusColor = (s) => ({
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  removed: 'bg-gray-100 text-gray-600',
  selected_for_live: 'bg-yellow-100 text-yellow-800',
}[s] || 'bg-gray-50 text-gray-500');

export default function AdminModerationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('pending');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { status };
      if (type) params.type = type;
      const data = await adminICPanel.listModeration(params);
      setItems(data);
    } catch {
      setError('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [type, status]);

  const act = async (id, action) => {
    try {
      if (action === 'approve') await adminICPanel.approveModeration(id);
      else if (action === 'remove') await adminICPanel.removeModeration(id);
      else if (action === 'select_for_live') await adminICPanel.selectForLive(id);
      load();
    } catch (e) {
      alert(e?.error || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">Reported posts, live-session questions and anonymous confessions.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key || 'all'}
            onClick={() => setType(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs border ${type === t.key ? 'bg-[#0C3B2E] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-2" />
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs border ${status === s ? 'bg-[#D4AF37] text-black border-transparent' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Queue is empty. Nothing needs attention.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it._id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500 uppercase">{it.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(it.status)}`}>{it.status}</span>
                    {it.selectedForLive && <span className="text-xs text-yellow-700 flex items-center gap-1"><Star className="w-3 h-3" /> selected</span>}
                    {it.anonymous && <span className="text-xs text-gray-500">anonymous</span>}
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{it.content}</p>
                  {it.reason && <p className="text-xs text-gray-500 mt-1">Reported: {it.reason}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {it.authorName || (it.anonymous ? 'anonymous' : 'unknown')} · {new Date(it.createdAt).toLocaleString()}
                  </p>
                </div>
                {it.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => act(it._id, 'approve')} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50">
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button onClick={() => act(it._id, 'remove')} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                    {it.type === 'question' && (
                      <button onClick={() => act(it._id, 'select_for_live')} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-yellow-200 text-yellow-800 hover:bg-yellow-50">
                        <Star className="w-3 h-3" /> Select for live
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
