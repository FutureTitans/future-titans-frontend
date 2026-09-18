'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import {
  Send, Server, Paperclip, FileSpreadsheet, CheckCircle, XCircle,
  Mail, Eye, PlayCircle, Trash2, AlertCircle, Loader2, Upload, Save,
} from 'lucide-react';
import { adminMailSender } from '@/lib/api';
import { upload } from '@vercel/blob/client';

const BATCH_SIZE = 50;
const MAX_ATTACHMENT_TOTAL = 15 * 1024 * 1024;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultSmtp = {
  host: '',
  port: 587,
  secure: false,
  user: '',
  pass: '',
  from: '',
  fromName: '',
};

const SMTP_STORAGE_KEY = 'admin_mail_sender_smtp';
const TEMPLATE_STORAGE_KEY = 'admin_mail_sender_template';

const fmtBytes = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
};

const renderPreview = (tpl, vars) => {
  if (!tpl) return '';
  return String(tpl).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    const v = vars?.[k];
    return v === undefined || v === null ? '' : String(v);
  });
};

export default function MailSenderPage() {
  const [smtp, setSmtp] = useState(defaultSmtp);
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('<p>Hello {{name}},</p>\n<p>Write your message here.</p>');
  const [attachments, setAttachments] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [recipientColumns, setRecipientColumns] = useState([]);
  const [emailColumn, setEmailColumn] = useState('');
  const [nameColumn, setNameColumn] = useState('');
  const [rawRows, setRawRows] = useState([]);

  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [sendingTest, setSendingTest] = useState(false);

  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, sent: 0, failed: 0 });
  const [runResults, setRunResults] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');

  const fileRef = useRef(null);
  const attachRef = useRef(null);

  const attachmentTotal = useMemo(() => attachments.reduce((s, a) => s + a.size, 0), [attachments]);

  const validRecipients = useMemo(
    () => recipients.filter((r) => r.email && emailRegex.test(r.email)),
    [recipients]
  );

  const updateSmtp = (patch) => setSmtp((s) => ({ ...s, ...patch }));

  useEffect(() => {
    try {
      const rawSmtp = localStorage.getItem(SMTP_STORAGE_KEY);
      if (rawSmtp) {
        const parsed = JSON.parse(rawSmtp);
        setSmtp({ ...defaultSmtp, ...parsed });
      }
      const rawTpl = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (rawTpl) {
        const parsed = JSON.parse(rawTpl);
        if (typeof parsed.subject === 'string') setSubject(parsed.subject);
        if (typeof parsed.htmlBody === 'string') setHtmlBody(parsed.htmlBody);
      }
    } catch (err) {
      console.warn('Failed to load saved mail sender state:', err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify({ subject, htmlBody }));
    } catch (err) {
      // storage may be full or blocked; ignore
    }
  }, [subject, htmlBody, hydrated]);

  const handleSaveSmtp = () => {
    try {
      localStorage.setItem(SMTP_STORAGE_KEY, JSON.stringify(smtp));
      setSavedNotice('Saved to this browser');
      setTimeout(() => setSavedNotice(''), 2500);
    } catch (err) {
      setSavedNotice('Failed to save');
      setTimeout(() => setSavedNotice(''), 2500);
    }
  };

  const handleClearSmtp = () => {
    if (!window.confirm('Clear saved SMTP credentials from this browser?')) return;
    try {
      localStorage.removeItem(SMTP_STORAGE_KEY);
    } catch (err) {
      // ignore
    }
    setSmtp(defaultSmtp);
    setVerifyResult(null);
    setSavedNotice('Cleared');
    setTimeout(() => setSavedNotice(''), 2000);
  };

  const handleAttachmentAdd = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newTotal = attachmentTotal + files.reduce((s, f) => s + f.size, 0);
    if (newTotal > MAX_ATTACHMENT_TOTAL) {
      alert(`Total attachments would exceed 15MB (${fmtBytes(newTotal)}).`);
      if (attachRef.current) attachRef.current.value = '';
      return;
    }

    setUploadingAttachment(true);
    setAttachmentError('');
    try {
      const uploaded = await Promise.all(
        files.map(async (f) => {
          const blob = await upload(`mail-attachments/${Date.now()}-${f.name}`, f, {
            access: 'public',
            handleUploadUrl: '/api/mail-upload',
            contentType: f.type || 'application/octet-stream',
          });
          return {
            filename: f.name,
            size: f.size,
            contentType: f.type || 'application/octet-stream',
            url: blob.url,
          };
        })
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setAttachmentError(err.message || 'Upload failed');
    } finally {
      setUploadingAttachment(false);
      if (attachRef.current) attachRef.current.value = '';
    }
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRecipientFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    try {
      let rows = [];
      if (ext === 'txt') {
        const text = await file.text();
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        rows = lines.map((line) => ({ email: line }));
        setRecipientColumns(['email']);
        setEmailColumn('email');
        setNameColumn('');
      } else {
        const XLSX = await import('xlsx');
        const xlsxLib = XLSX.default || XLSX;
        const buf = new Uint8Array(await file.arrayBuffer());
        const wb = xlsxLib.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = xlsxLib.utils.sheet_to_json(ws, { defval: '' });
        if (rows.length === 0) {
          alert('No data found in the file.');
          return;
        }
        const cols = Object.keys(rows[0]);
        setRecipientColumns(cols);
        const guessedEmail = cols.find((c) => /email|mail/i.test(c)) || cols[0];
        const guessedName = cols.find((c) => /^name|full.?name|first.?name/i.test(c)) || '';
        setEmailColumn(guessedEmail);
        setNameColumn(guessedName);
      }
      setRawRows(rows);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      alert('Failed to parse file: ' + (err.message || err));
    }
  };

  const rebuildRecipients = (rows, emailCol, nameCol) => {
    const list = rows.map((row) => {
      const rec = { ...row };
      rec.email = String(row[emailCol] || '').trim();
      if (nameCol) rec.name = String(row[nameCol] || '').trim();
      else if (!rec.name) rec.name = rec.email;
      return rec;
    }).filter((r) => r.email);
    setRecipients(list);
  };

  const onEmailColumnChange = (col) => {
    setEmailColumn(col);
    rebuildRecipients(rawRows, col, nameColumn);
  };
  const onNameColumnChange = (col) => {
    setNameColumn(col);
    rebuildRecipients(rawRows, emailColumn, col);
  };

  useEffect(() => {
    if (rawRows.length > 0 && emailColumn) {
      rebuildRecipients(rawRows, emailColumn, nameColumn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawRows]);

  const clearRecipients = () => {
    setRecipients([]);
    setRawRows([]);
    setRecipientColumns([]);
    setEmailColumn('');
    setNameColumn('');
  };

  const smtpReady = smtp.host && smtp.user && smtp.pass;

  const handleVerify = async () => {
    if (!smtpReady) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      await adminMailSender.verify(smtp);
      setVerifyResult({ ok: true });
    } catch (err) {
      setVerifyResult({ ok: false, message: err.response?.data?.message || err.message || 'Verify failed' });
    } finally {
      setVerifying(false);
    }
  };

  const handleSendTest = async () => {
    if (!smtpReady || !testEmail || !emailRegex.test(testEmail)) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      await adminMailSender.test({
        smtp,
        subject,
        htmlBody,
        to: testEmail,
        attachments,
      });
      setTestResult({ ok: true });
    } catch (err) {
      setTestResult({ ok: false, message: err.response?.data?.message || err.message || 'Test failed' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendAll = async () => {
    if (!smtpReady || validRecipients.length === 0 || !subject) return;
    if (!window.confirm(`Send email to ${validRecipients.length} recipients?`)) return;

    setSending(true);
    setRunResults([]);
    setProgress({ current: 0, total: validRecipients.length, sent: 0, failed: 0 });

    const allResults = [];
    let sentTotal = 0;
    let failedTotal = 0;

    try {
      for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
        const batch = validRecipients.slice(i, i + BATCH_SIZE);
        try {
          const res = await adminMailSender.send({
            smtp,
            subject,
            htmlBody,
            recipients: batch,
            attachments,
          });
          sentTotal += res.sent || 0;
          failedTotal += res.failedCount || 0;
          allResults.push(...(res.results || []));
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Batch failed';
          failedTotal += batch.length;
          allResults.push(...batch.map((r) => ({ email: r.email, ok: false, error: msg })));
        }
        setProgress({
          current: Math.min(i + BATCH_SIZE, validRecipients.length),
          total: validRecipients.length,
          sent: sentTotal,
          failed: failedTotal,
        });
        setRunResults([...allResults]);
      }
    } finally {
      setSending(false);
    }
  };

  const previewVars = validRecipients[0] || { email: 'sample@example.com', name: 'Sample User' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Mail Sender</h1>
        <p className="text-sm text-gray-500 mt-1">Send bulk emails with your own SMTP, attachments and a spreadsheet of recipients.</p>
      </div>

      {/* SMTP config */}
      <div className="card !p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-[#B8952E]" />
          <h2 className="font-semibold text-gray-800">SMTP Configuration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Host *</label>
            <input type="text" value={smtp.host} onChange={(e) => updateSmtp({ host: e.target.value })} className="glass-input w-full" placeholder="smtp.gmail.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Port *</label>
            <input type="number" value={smtp.port} onChange={(e) => updateSmtp({ port: Number(e.target.value) || 0 })} className="glass-input w-full" placeholder="587" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <input type="checkbox" checked={smtp.secure} onChange={(e) => updateSmtp({ secure: e.target.checked })} className="rounded border-gray-300" />
              Use TLS/SSL (secure)
            </label>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Username *</label>
            <input type="text" value={smtp.user} onChange={(e) => updateSmtp({ user: e.target.value })} className="glass-input w-full" placeholder="user@example.com" autoComplete="off" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Password *</label>
            <input type="password" value={smtp.pass} onChange={(e) => updateSmtp({ pass: e.target.value })} className="glass-input w-full" placeholder="app password" autoComplete="new-password" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">From Address</label>
            <input type="text" value={smtp.from} onChange={(e) => updateSmtp({ from: e.target.value })} className="glass-input w-full" placeholder="defaults to username" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">From Name</label>
            <input type="text" value={smtp.fromName} onChange={(e) => updateSmtp({ fromName: e.target.value })} className="glass-input w-full" placeholder="Future Titans" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button onClick={handleVerify} disabled={!smtpReady || verifying} className="glass-button-secondary text-sm disabled:opacity-50 flex items-center gap-2">
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Verify Connection
          </button>
          <button onClick={handleSaveSmtp} disabled={!smtpReady} className="glass-button text-sm disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Credentials
          </button>
          <button onClick={handleClearSmtp} className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
            Clear Saved
          </button>
          {savedNotice && <span className="text-xs text-green-600 font-semibold">{savedNotice}</span>}
          {verifyResult && (
            verifyResult.ok
              ? <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> SMTP verified</span>
              : <span className="text-xs text-red-600 font-semibold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> {verifyResult.message}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">Credentials are saved to <span className="font-semibold">this browser only</span> (localStorage) and sent to your admin backend just for each send. Nothing is stored on the server.</p>
      </div>

      {/* Email content */}
      <div className="card !p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-[#B8952E]" />
          <h2 className="font-semibold text-gray-800">Email Template</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject *</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="glass-input w-full" placeholder="Subject (supports {{name}}, {{email}} etc.)" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">HTML Body *</label>
            <textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} rows={12} className="glass-input w-full font-mono text-sm" placeholder="Paste your HTML template here. Use {{name}}, {{email}} or any spreadsheet column name for personalization." />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Placeholders: <code className="text-[#B8952E]">{'{{name}}'}</code>, <code className="text-[#B8952E]">{'{{email}}'}</code>, or any spreadsheet column key.</p>
            <button onClick={() => setShowPreview(true)} disabled={!htmlBody} className="text-xs text-[#B8952E] hover:text-[#D4AF37] font-semibold flex items-center gap-1 disabled:opacity-50">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="card !p-5">
        <div className="flex items-center gap-2 mb-4">
          <Paperclip className="w-4 h-4 text-[#B8952E]" />
          <h2 className="font-semibold text-gray-800">Attachments</h2>
          <span className="text-xs text-gray-400 ml-auto">{fmtBytes(attachmentTotal)} / 15 MB</span>
        </div>
        <input ref={attachRef} type="file" multiple onChange={handleAttachmentAdd} disabled={uploadingAttachment} className="block text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer cursor-pointer disabled:opacity-50" />
        {uploadingAttachment && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Uploading attachment to secure storage…
          </div>
        )}
        {attachmentError && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
            <XCircle className="w-3.5 h-3.5" /> {attachmentError}
          </div>
        )}
        {attachments.length > 0 && (
          <ul className="mt-3 space-y-2">
            {attachments.map((a, i) => (
              <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{a.filename}</span>
                  <span className="text-xs text-gray-400 shrink-0">{fmtBytes(a.size)}</span>
                </div>
                <button onClick={() => removeAttachment(i)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recipients */}
      <div className="card !p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="w-4 h-4 text-[#B8952E]" />
          <h2 className="font-semibold text-gray-800">Recipients</h2>
          {recipients.length > 0 && (
            <span className="text-xs text-gray-500 ml-auto">
              {validRecipients.length} valid / {recipients.length} total
            </span>
          )}
        </div>

        {recipients.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">Upload a spreadsheet of recipients</p>
            <p className="text-xs text-gray-400 mb-3">CSV, XLSX, XLS or plain TXT (one email per line)</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              onChange={handleRecipientFile}
              className="block mx-auto text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer cursor-pointer"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Column *</label>
                <select value={emailColumn} onChange={(e) => onEmailColumnChange(e.target.value)} className="glass-input w-full text-sm">
                  {recipientColumns.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Name Column (optional)</label>
                <select value={nameColumn} onChange={(e) => onNameColumnChange(e.target.value)} className="glass-input w-full text-sm">
                  <option value="">-- none --</option>
                  {recipientColumns.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-64 border border-gray-100 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-600">Email</th>
                    <th className="text-left p-2 font-semibold text-gray-600">Name</th>
                    <th className="text-left p-2 font-semibold text-gray-600 w-16">Valid</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.slice(0, 100).map((r, i) => {
                    const valid = r.email && emailRegex.test(r.email);
                    return (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="p-2 text-gray-700">{r.email || <span className="text-red-400 italic">empty</span>}</td>
                        <td className="p-2 text-gray-500">{r.name || '-'}</td>
                        <td className="p-2">
                          {valid ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {recipients.length > 100 && (
              <p className="text-xs text-gray-400 mt-2">Showing first 100 of {recipients.length}.</p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleRecipientFile}
                className="hidden"
              />
              <button onClick={() => fileRef.current?.click()} className="glass-button-secondary text-xs">Replace file</button>
              <button onClick={clearRecipients} className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Clear</button>
            </div>
          </>
        )}
      </div>

      {/* Test send */}
      <div className="card !p-5">
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="w-4 h-4 text-[#B8952E]" />
          <h2 className="font-semibold text-gray-800">Send a Test Email</h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
            className="glass-input flex-1 min-w-[240px]"
          />
          <button
            onClick={handleSendTest}
            disabled={!smtpReady || !testEmail || !emailRegex.test(testEmail) || sendingTest || uploadingAttachment}
            className="glass-button-secondary text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Send Test
          </button>
          {testResult && (
            testResult.ok
              ? <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sent</span>
              : <span className="text-xs text-red-600 font-semibold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> {testResult.message}</span>
          )}
        </div>
      </div>

      {/* Send controls */}
      <div className="card !p-5 border-2 border-[#D4AF37]/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Ready to send</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {validRecipients.length} valid recipient{validRecipients.length === 1 ? '' : 's'}
              {attachments.length > 0 ? ` · ${attachments.length} attachment${attachments.length === 1 ? '' : 's'} (${fmtBytes(attachmentTotal)})` : ''}
            </p>
          </div>
          <button
            onClick={handleSendAll}
            disabled={sending || !smtpReady || validRecipients.length === 0 || !subject || !htmlBody || uploadingAttachment}
            className="glass-button text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending...' : `Send to ${validRecipients.length}`}
          </button>
        </div>

        {(sending || progress.total > 0) && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-semibold">
                {progress.current} / {progress.total} processed
              </span>
              <span className="text-gray-500">
                <span className="text-green-600">{progress.sent} sent</span>
                {progress.failed > 0 && <span className="text-red-600 ml-2">{progress.failed} failed</span>}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] transition-all duration-300"
                style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
            {sending && (
              <p className="text-xs text-gray-400">Do not close this tab while sending is in progress.</p>
            )}
          </div>
        )}

        {runResults.length > 0 && !sending && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Results ({runResults.length})</p>
            <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-600">Email</th>
                    <th className="text-left p-2 font-semibold text-gray-600">Status</th>
                    <th className="text-left p-2 font-semibold text-gray-600">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {runResults.map((r, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="p-2 text-gray-700">{r.email}</td>
                      <td className="p-2">
                        {r.ok
                          ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" /> sent</span>
                          : <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="w-3 h-3" /> failed</span>}
                      </td>
                      <td className="p-2 text-gray-500 truncate max-w-md">{r.ok ? (r.messageId || '') : (r.error || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="glass-strong rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold gradient-text">Preview</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Rendered with values from first recipient (or sample data)</p>
                </div>
                <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">Subject</p>
                <p className="text-sm text-gray-800 p-2 bg-gray-50 rounded">{renderPreview(subject, previewVars) || <span className="text-gray-400 italic">(empty)</span>}</p>
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Body</p>
              <div className="border border-gray-200 rounded-lg bg-white p-4 max-h-[60vh] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: renderPreview(htmlBody, previewVars) }} />
              </div>
              {!validRecipients[0] && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> No recipients loaded — using sample data.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
