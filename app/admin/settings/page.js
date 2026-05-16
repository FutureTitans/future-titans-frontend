'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Save, Mail, CheckCircle, XCircle, Loader, MessageSquare } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [formData, setFormData] = useState({
    host: 'smtp.gmail.com', port: 587, secure: false,
    auth: { user: '', pass: '' },
    from: 'noreply@futuretitans.com', fromName: 'Future Titans', isActive: false,
  });

  const [chatSettings, setChatSettings] = useState({ chatMessageLimit: 200, chatResetHours: 24 });
  const [chatSaving, setChatSaving] = useState(false);
  const [chatSaveResult, setChatSaveResult] = useState(null);

  useEffect(() => { fetchSMTPConfig(); fetchChatSettings(); }, []);

  const fetchSMTPConfig = async () => {
    try { setLoading(true); const config = await admin.getSMTPConfig(); setFormData(config); }
    catch (error) { console.error('Failed to fetch SMTP config:', error); }
    finally { setLoading(false); }
  };

  const fetchChatSettings = async () => {
    try { const settings = await admin.getChatSettings(); setChatSettings(settings); }
    catch (error) { console.error('Failed to fetch chat settings:', error); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setFormData(prev => ({ ...prev, auth: { ...prev.auth, [authField]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setTestResult(null);
    try { await admin.updateSMTPConfig(formData); alert('SMTP configuration saved!'); await fetchSMTPConfig(); }
    catch (error) { alert('Failed to save: ' + (error?.error || error?.message || 'Unknown error')); }
    finally { setSaving(false); }
  };

  const handleTest = async () => {
    setTesting(true); setTestResult(null);
    try { const result = await admin.testSMTPConfig(); setTestResult({ success: true, message: result.message }); }
    catch (error) { setTestResult({ success: false, message: error?.error || error?.message || 'Test failed' }); }
    finally { setTesting(false); }
  };

  const handleChatSettingsSave = async (e) => {
    e.preventDefault();
    setChatSaving(true); setChatSaveResult(null);
    try {
      const result = await admin.updateChatSettings(chatSettings);
      setChatSettings({ chatMessageLimit: result.chatMessageLimit, chatResetHours: result.chatResetHours });
      setChatSaveResult({ success: true, message: 'Chat settings saved!' });
    } catch (error) {
      setChatSaveResult({ success: false, message: error?.error || error?.message || 'Failed to save' });
    } finally { setChatSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Loading settings..." />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform configuration and integrations</p>
      </div>

      {/* AI Chat Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-purple-50">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800">AI Chat Settings</h2>
            <p className="text-xs text-gray-500">Rate limiting for Zunnova AI conversations</p>
          </div>
        </div>

        <form onSubmit={handleChatSettingsSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message Limit</label>
              <input
                type="number" value={chatSettings.chatMessageLimit}
                onChange={(e) => setChatSettings(prev => ({ ...prev, chatMessageLimit: parseInt(e.target.value, 10) || 0 }))}
                className="glass-input" min="1" max="10000" required
              />
              <p className="text-xs text-gray-500 mt-1">Max messages per student within the reset window</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reset Window (hours)</label>
              <input
                type="number" value={chatSettings.chatResetHours}
                onChange={(e) => setChatSettings(prev => ({ ...prev, chatResetHours: parseInt(e.target.value, 10) || 0 }))}
                className="glass-input" min="1" max="720" required
              />
              <p className="text-xs text-gray-500 mt-1">Rolling window after which counter resets</p>
            </div>
          </div>

          <button type="submit" disabled={chatSaving} className="glass-button !px-5 !py-2.5 text-sm flex items-center gap-2">
            {chatSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {chatSaving ? 'Saving...' : 'Save Chat Settings'}
          </button>

          {chatSaveResult && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${chatSaveResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {chatSaveResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {chatSaveResult.message}
            </div>
          )}
        </form>
      </div>

      {/* SMTP Configuration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-blue-50">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800">SMTP Configuration</h2>
            <p className="text-xs text-gray-500">Email delivery for password resets and notifications</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
              <input type="text" name="host" value={formData.host} onChange={handleChange} className="glass-input" placeholder="smtp.gmail.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Port</label>
              <input type="number" name="port" value={formData.port} onChange={handleChange} className="glass-input" placeholder="587" required />
              <p className="text-xs text-gray-500 mt-1">587 for TLS, 465 for SSL</p>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="secure" checked={formData.secure} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Use SSL/TLS</span>
            <span className="text-xs text-gray-500">(enable for port 465)</span>
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username / Email</label>
              <input type="email" name="auth.user" value={formData.auth.user} onChange={handleChange} className="glass-input" placeholder="your-email@gmail.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / App Password</label>
              <input type="password" name="auth.pass" value={formData.auth.pass === '***' ? '' : formData.auth.pass} onChange={handleChange} className="glass-input" placeholder="Enter password" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From Email</label>
              <input type="email" name="from" value={formData.from} onChange={handleChange} className="glass-input" placeholder="noreply@futuretitans.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From Name</label>
              <input type="text" name="fromName" value={formData.fromName} onChange={handleChange} className="glass-input" placeholder="Future Titans" required />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Activate SMTP</span>
            <span className="text-xs text-gray-500">(enable to start sending emails)</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="glass-button !px-5 !py-2.5 text-sm flex items-center gap-2">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            <button type="button" onClick={handleTest} disabled={testing || !formData.isActive} className="glass-button-secondary !px-5 !py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
              {testing ? <Loader className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {testing ? 'Testing...' : 'Send Test Email'}
            </button>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${testResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult.message}
            </div>
          )}
        </form>

        <div className="mt-6 glass-subtle rounded-xl p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Gmail Setup</h3>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-500">
            <li>Enable 2-Step Verification in Google Account</li>
            <li>Generate an App Password (Security {'>'} App Passwords)</li>
            <li>Use Gmail as username, App Password as SMTP password</li>
            <li>Host: smtp.gmail.com, Port: 587, Secure: off</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
