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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: ''
    },
    from: 'noreply@futuretitans.com',
    fromName: 'Future Titans',
    isActive: false
  });

  // Chat settings state
  const [chatSettings, setChatSettings] = useState({
    chatMessageLimit: 200,
    chatResetHours: 24,
  });
  const [chatSaving, setChatSaving] = useState(false);
  const [chatSaveResult, setChatSaveResult] = useState(null);

  useEffect(() => {
    fetchSMTPConfig();
    fetchChatSettings();
  }, []);

  const fetchSMTPConfig = async () => {
    try {
      setLoading(true);
      const config = await admin.getSMTPConfig();
      setFormData(config);
    } catch (error) {
      console.error('Failed to fetch SMTP config:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatSettings = async () => {
    try {
      const settings = await admin.getChatSettings();
      setChatSettings(settings);
    } catch (error) {
      console.error('Failed to fetch chat settings:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          [authField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTestResult(null);

    try {
      await admin.updateSMTPConfig(formData);
      alert('SMTP configuration saved successfully!');
      await fetchSMTPConfig();
    } catch (error) {
      console.error('Failed to save SMTP config:', error);
      alert('Failed to save SMTP configuration: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await admin.testSMTPConfig();
      setTestResult({ success: true, message: result.message });
    } catch (error) {
      setTestResult({
        success: false,
        message: error?.error || error?.message || 'Test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleChatSettingsSave = async (e) => {
    e.preventDefault();
    setChatSaving(true);
    setChatSaveResult(null);

    try {
      const result = await admin.updateChatSettings(chatSettings);
      setChatSettings({
        chatMessageLimit: result.chatMessageLimit,
        chatResetHours: result.chatResetHours,
      });
      setChatSaveResult({ success: true, message: 'Chat settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save chat settings:', error);
      setChatSaveResult({
        success: false,
        message: error?.error || error?.message || 'Failed to save chat settings',
      });
    } finally {
      setChatSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">Settings</h1>

      {/* ─── AI Chat Settings ─── */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          AI Chat Settings
        </h2>
        <p className="text-neutral-medium mb-6">
          Configure the message limit and reset window for Zunnova AI chat. These settings apply to all students.
        </p>

        <form onSubmit={handleChatSettingsSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Message Limit (per student)
              </label>
              <input
                type="number"
                value={chatSettings.chatMessageLimit}
                onChange={(e) => setChatSettings(prev => ({ ...prev, chatMessageLimit: parseInt(e.target.value, 10) || 0 }))}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                min="1"
                max="10000"
                required
              />
              <p className="text-xs text-neutral-medium mt-1">
                Maximum number of messages a student can send within the reset window (1–10,000)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Reset Window (hours)
              </label>
              <input
                type="number"
                value={chatSettings.chatResetHours}
                onChange={(e) => setChatSettings(prev => ({ ...prev, chatResetHours: parseInt(e.target.value, 10) || 0 }))}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                min="1"
                max="720"
                required
              />
              <p className="text-xs text-neutral-medium mt-1">
                Rolling window in hours after which the message count resets (1–720, i.e. up to 30 days)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={chatSaving}
              className="flex items-center gap-2 bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-primary-darkRed transition font-semibold disabled:opacity-50"
            >
              {chatSaving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Chat Settings
                </>
              )}
            </button>
          </div>

          {chatSaveResult && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${chatSaveResult.success
              ? 'bg-semantic-success bg-opacity-10 border border-semantic-success'
              : 'bg-semantic-error bg-opacity-10 border border-semantic-error'
              }`}>
              {chatSaveResult.success ? (
                <CheckCircle className="w-5 h-5 text-semantic-success" />
              ) : (
                <XCircle className="w-5 h-5 text-semantic-error" />
              )}
              <p className={chatSaveResult.success ? 'text-semantic-success' : 'text-semantic-error'}>
                {chatSaveResult.message}
              </p>
            </div>
          )}
        </form>

        <div className="mt-6 p-4 bg-neutral-light rounded-lg">
          <h3 className="font-semibold mb-2">💡 How it works</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-medium">
            <li>Each student has a rolling message counter tracked across all their AI chats.</li>
            <li>Once they hit the limit, they must wait for the reset window to pass before sending more messages.</li>
            <li>Changes take effect within 60 seconds (settings are cached for performance).</li>
          </ul>
        </div>
      </div>

      {/* ─── SMTP Configuration ─── */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          SMTP Configuration
        </h2>
        <p className="text-neutral-medium mb-6">
          Configure SMTP settings to send password reset emails and other notifications.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="smtp.gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="587"
                required
              />
              <p className="text-xs text-neutral-medium mt-1">
                Use 587 for TLS, 465 for SSL
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="secure"
                checked={formData.secure}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">Use SSL/TLS (secure)</span>
            </label>
            <p className="text-xs text-neutral-medium">
              Enable this for port 465 (SSL), disable for port 587 (TLS)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                SMTP Username / Email
              </label>
              <input
                type="email"
                name="auth.user"
                value={formData.auth.user}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="your-email@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                SMTP Password / App Password
              </label>
              <input
                type="password"
                name="auth.pass"
                value={formData.auth.pass === '***' ? '' : formData.auth.pass}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="Enter password"
                required
              />
              <p className="text-xs text-neutral-medium mt-1">
                For Gmail, use an App Password (not your regular password)
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                From Email Address
              </label>
              <input
                type="email"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="noreply@futuretitans.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                From Name
              </label>
              <input
                type="text"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red"
                placeholder="Future Titans"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">Activate SMTP Configuration</span>
            </label>
            <p className="text-xs text-neutral-medium">
              Enable this to start sending emails using these SMTP settings
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-primary-darkRed transition font-semibold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !formData.isActive}
              className="flex items-center gap-2 bg-accent-gold text-white px-6 py-3 rounded-lg hover:bg-accent-amber transition font-semibold disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Test Configuration
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${testResult.success
              ? 'bg-semantic-success bg-opacity-10 border border-semantic-success'
              : 'bg-semantic-error bg-opacity-10 border border-semantic-error'
              }`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-semantic-success" />
              ) : (
                <XCircle className="w-5 h-5 text-semantic-error" />
              )}
              <p className={testResult.success ? 'text-semantic-success' : 'text-semantic-error'}>
                {testResult.message}
              </p>
            </div>
          )}
        </form>

        <div className="mt-8 p-4 bg-neutral-light rounded-lg">
          <h3 className="font-semibold mb-2">📧 Gmail Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-medium">
            <li>Go to your Google Account settings</li>
            <li>Enable 2-Step Verification</li>
            <li>Go to App Passwords and generate a new app password</li>
            <li>Use your Gmail address as the SMTP Username</li>
            <li>Use the generated App Password as the SMTP Password</li>
            <li>Set Host: smtp.gmail.com, Port: 587, Secure: false</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
