'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Save, AlertCircle, RefreshCw, CheckCircle,
} from 'lucide-react';
import { adminIC } from '@/lib/api';

const emptySettings = {
  hero: {
    headline: '',
    subhead: '',
    stats: { schools: 0, experts: 0, hackathons: 0, innovations: 0 },
  },
  subNavLabels: {
    experts: 'Expert Exposure',
    hackathons: 'Hackathons',
    zunnova: 'Zunnova++',
    training: "Teachers' Training",
    resources: 'Resource Library',
  },
  phase1UnlockThreshold: 70,
};

export default function ICSettingsPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getSettings();
      setSettings({
        hero: {
          headline: data.hero?.headline || '',
          subhead: data.hero?.subhead || '',
          stats: {
            schools: data.hero?.stats?.schools || 0,
            experts: data.hero?.stats?.experts || 0,
            hackathons: data.hero?.stats?.hackathons || 0,
            innovations: data.hero?.stats?.innovations || 0,
          },
        },
        subNavLabels: {
          experts: data.subNavLabels?.experts || 'Expert Exposure',
          hackathons: data.subNavLabels?.hackathons || 'Hackathons',
          zunnova: data.subNavLabels?.zunnova || 'Zunnova++',
          training: data.subNavLabels?.training || "Teachers' Training",
          resources: data.subNavLabels?.resources || 'Resource Library',
        },
        phase1UnlockThreshold: data.phase1UnlockThreshold ?? 70,
      });
    } catch (err) {
      console.error('Error fetching IC settings:', err);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminIC.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field, value) => {
    setSettings({ ...settings, hero: { ...settings.hero, [field]: value } });
  };

  const updateStat = (field, value) => {
    setSettings({
      ...settings,
      hero: { ...settings.hero, stats: { ...settings.hero.stats, [field]: parseInt(value) || 0 } },
    });
  };

  const updateSubNavLabel = (field, value) => {
    setSettings({ ...settings, subNavLabels: { ...settings.subNavLabels, [field]: value } });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gray-400">Loading settings...</div></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button onClick={fetchSettings} className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B8952E] font-medium"><RefreshCw className="w-4 h-4" /> Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Innovation Club Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure global settings for the Innovation Club section.</p>
        </div>
        <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Settings'}
        </button>
      </div>

      {/* Hero Section Editor */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input type="text" value={settings.hero.headline} onChange={(e) => updateHero('headline', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Innovation Club headline" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subhead</label>
            <textarea value={settings.hero.subhead} onChange={(e) => updateHero('subhead', e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Subhead text" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Stat Strip Values</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Schools</label>
                <input type="number" value={settings.hero.stats.schools} onChange={(e) => updateStat('schools', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={0} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Experts</label>
                <input type="number" value={settings.hero.stats.experts} onChange={(e) => updateStat('experts', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={0} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hackathons</label>
                <input type="number" value={settings.hero.stats.hackathons} onChange={(e) => updateStat('hackathons', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={0} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Innovations</label>
                <input type="number" value={settings.hero.stats.innovations} onChange={(e) => updateStat('innovations', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={0} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Nav Labels */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sub-Navigation Labels</h2>
        <p className="text-sm text-gray-500 mb-4">Customize how section names appear to students.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(settings.subNavLabels).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1 capitalize">{key}</label>
              <input type="text" value={value} onChange={(e) => updateSubNavLabel(key, e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
            </div>
          ))}
        </div>
      </div>

      {/* Phase 1 Unlock Threshold */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Phase 1 Unlock Threshold</h2>
        <p className="text-sm text-gray-500 mb-4">
          The minimum completion percentage required for students to unlock Phase 1 Innovation Club features.
        </p>
        <div className="flex items-center gap-3">
          <input type="number" value={settings.phase1UnlockThreshold} onChange={(e) => setSettings({ ...settings, phase1UnlockThreshold: parseInt(e.target.value) || 0 })} className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={0} max={100} />
          <span className="text-sm text-gray-600">%</span>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
