'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Plus, Upload, Download, Pencil, Trash2, MessageSquare,
  ChevronLeft, ChevronRight, Users, UserPlus, Phone, Mail,
  Calendar, AlertCircle, CheckCircle, XCircle, Clock, Target,
  Filter, X, FileSpreadsheet, ArrowUpDown,
} from 'lucide-react';
import { adminLeads } from '@/lib/api';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-gray-100 text-gray-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { value: 'interested', label: 'Interested', color: 'bg-amber-100 text-amber-700' },
  { value: 'demo_scheduled', label: 'Demo Scheduled', color: 'bg-purple-100 text-purple-700' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High', color: 'text-red-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'low', label: 'Low', color: 'text-gray-500' },
];

const CONTACT_METHODS = ['email', 'call', 'whatsapp', 'meeting', 'other'];
const NOTE_TYPES = ['note', 'email_sent', 'call_made', 'meeting', 'status_change'];

const statusColor = (s) => STATUS_OPTIONS.find((o) => o.value === s)?.color || 'bg-gray-100 text-gray-700';
const statusLabel = (s) => STATUS_OPTIONS.find((o) => o.value === s)?.label || s;

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d) < new Date();
}

const emptyLead = {
  name: '', designation: '', school: '', city: '', state: '', phone: '', email: '',
  leadSource: '', contactMethod: 'email', status: 'new', priority: 'medium',
  response: '', assignedTo: '', nextFollowUp: '', lastContact: '',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterAssigned, setFilterAssigned] = useState('');

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState(emptyLead);
  const [showImport, setShowImport] = useState(false);
  const [showNotes, setShowNotes] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('note');
  const [leadDetail, setLeadDetail] = useState(null);

  // Bulk
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAssign, setBulkAssign] = useState('');

  // Import
  const [importData, setImportData] = useState([]);
  const [importPreview, setImportPreview] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const filters = { page: pagination.page, limit: 50 };
      if (search) filters.search = search;
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      if (filterCity) filters.city = filterCity;
      if (filterAssigned) filters.assignedTo = filterAssigned;
      const data = await adminLeads.getAll(filters);
      setLeads(data.leads || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, filterStatus, filterPriority, filterCity, filterAssigned]);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await adminLeads.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // CRUD
  const handleSave = async () => {
    try {
      if (editingLead) {
        await adminLeads.update(editingLead._id, formData);
      } else {
        await adminLeads.create(formData);
      }
      setShowForm(false);
      setEditingLead(null);
      setFormData(emptyLead);
      fetchLeads();
      fetchDashboard();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || '',
      designation: lead.designation || '',
      school: lead.school || '',
      city: lead.city || '',
      state: lead.state || '',
      phone: lead.phone || '',
      email: lead.email || '',
      leadSource: lead.leadSource || '',
      contactMethod: lead.contactMethod || 'email',
      status: lead.status || 'new',
      priority: lead.priority || 'medium',
      response: lead.response || '',
      assignedTo: lead.assignedTo || '',
      nextFollowUp: lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().split('T')[0] : '',
      lastContact: lead.lastContact ? new Date(lead.lastContact).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await adminLeads.delete(id);
    setLeads(leads.filter((l) => l._id !== id));
    fetchDashboard();
  };

  // Notes
  const openNotes = async (lead) => {
    try {
      const full = await adminLeads.getById(lead._id);
      setLeadDetail(full);
      setShowNotes(lead._id);
      setNoteText('');
      setNoteType('note');
    } catch (err) {
      console.error('Failed to load lead notes:', err);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const updated = await adminLeads.addNote(showNotes, { text: noteText, type: noteType });
      setLeadDetail(updated);
      setNoteText('');
    } catch (err) {
      console.error('Add note failed:', err);
    }
  };

  // Bulk
  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleSelectAll = () => {
    if (selected.size === leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l._id)));
    }
  };

  const handleBulkUpdate = async () => {
    const updates = {};
    if (bulkStatus) updates.status = bulkStatus;
    if (bulkAssign) updates.assignedTo = bulkAssign;
    if (Object.keys(updates).length === 0) return;
    await adminLeads.bulkUpdate({ ids: [...selected], updates });
    setSelected(new Set());
    setBulkStatus('');
    setBulkAssign('');
    fetchLeads();
    fetchDashboard();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} leads?`)) return;
    await Promise.all([...selected].map((id) => adminLeads.delete(id)));
    setSelected(new Set());
    fetchLeads();
    fetchDashboard();
  };

  // Import
  const [importLoading, setImportLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const XLSX = await import('xlsx');
        const xlsxLib = XLSX.default || XLSX;
        const data = new Uint8Array(evt.target.result);
        const wb = xlsxLib.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = xlsxLib.utils.sheet_to_json(ws, { defval: '' });

        const colKeys = rows.length > 0 ? Object.keys(rows[0]) : [];

        const findCol = (patterns) => {
          for (const p of patterns) {
            const found = colKeys.find((k) => k.toLowerCase().trim() === p.toLowerCase().trim());
            if (found) return found;
          }
          for (const p of patterns) {
            const found = colKeys.find((k) => k.toLowerCase().includes(p.toLowerCase()));
            if (found) return found;
          }
          return null;
        };

        const nameCol = findCol(['Name', 'Principal', 'Student Name']);
        const firstNameCol = findCol(['First Name', 'FirstName']);
        const lastNameCol = findCol(['Last Name', 'LastName']);
        const designationCol = findCol(['Designation', 'Role']);
        const schoolCol = findCol(['School Name', 'School', 'SchoolName']);
        const cityCol = findCol(['City', 'Location']);
        const stateCol = findCol(['State']);
        const phoneCol = findCol(['Phone', 'Mobile', 'Contact', 'Phone Number']);
        const emailCol = findCol(['Email ID', 'Email', 'Email Address', 'EmailID']);
        const sourceCol = findCol(['Lead Source', 'Source', 'LeadSource']);
        const classCol = findCol(['Class', 'Grade', 'Standard']);
        const responseCol = findCol(['Response']);
        const assignedCol = findCol(['Assigned To', 'AssignedTo']);

        const mapped = rows.map((row) => {
          const val = (col) => {
            if (!col) return '';
            const v = row[col];
            if (v === null || v === undefined || v === '') return '';
            return String(v).trim();
          };

          let name = val(nameCol);
          if (!name && (firstNameCol || lastNameCol)) {
            name = [val(firstNameCol), val(lastNameCol)].filter(Boolean).join(' ');
          }

          const designation = val(designationCol) || (classCol ? val(classCol) : '');

          return {
            name,
            designation,
            school: val(schoolCol),
            city: val(cityCol),
            state: val(stateCol),
            phone: val(phoneCol),
            email: val(emailCol),
            leadSource: val(sourceCol),
            contactMethod: 'email',
            response: val(responseCol),
            assignedTo: val(assignedCol),
          };
        }).filter((r) => r.name);

        if (mapped.length === 0) {
          alert(`No leads found. The file has ${rows.length} rows but no name column was detected.\n\nDetected columns: ${colKeys.join(', ')}`);
        }
        setImportData(mapped);
        setImportPreview(mapped.slice(0, 5));
        setImportResult(null);
      } catch (err) {
        console.error('Excel parse error:', err);
        alert('Failed to parse file: ' + (err.message || err));
      } finally {
        setImportLoading(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      setImportLoading(false);
    };
    reader.readAsArrayBuffer(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImportSubmit = async () => {
    try {
      const result = await adminLeads.bulkImport(importData);
      setImportResult(result);
      fetchLeads();
      fetchDashboard();
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  // Export
  const handleExport = async () => {
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterCity) filters.city = filterCity;
      if (filterAssigned) filters.assignedTo = filterAssigned;
      if (filterPriority) filters.priority = filterPriority;
      const data = await adminLeads.export(filters);
      const headers = ['Name', 'Designation', 'School', 'City', 'State', 'Phone', 'Email', 'Lead Source', 'Contact Method', 'Last Contact', 'Response', 'Assigned To', 'Next Follow Up', 'Status', 'Priority'];
      const rows = data.map((l) => [
        l.name, l.designation, l.school, l.city, l.state, l.phone, l.email,
        l.leadSource, l.contactMethod, formatDate(l.lastContact), l.response,
        l.assignedTo, formatDate(l.nextFollowUp), l.status, l.priority,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${(v || '').replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const sb = dashboard?.statusBreakdown || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Lead Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all school and institution leads</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowForm(true); setEditingLead(null); setFormData(emptyLead); }} className="glass-button flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
          <button onClick={() => { setShowImport(true); setImportData([]); setImportPreview([]); setImportResult(null); }} className="glass-button-secondary flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button onClick={handleExport} className="glass-button-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Leads', value: dashboard.total, icon: Users, color: 'text-gray-700' },
            { label: 'New', value: sb.new || 0, icon: UserPlus, color: 'text-blue-600' },
            { label: 'Contacted', value: sb.contacted || 0, icon: Phone, color: 'text-indigo-600' },
            { label: 'Interested', value: sb.interested || 0, icon: Target, color: 'text-amber-600' },
            { label: 'Converted', value: sb.converted || 0, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Overdue Follow-ups', value: dashboard.overdueFollowUps, icon: AlertCircle, color: 'text-red-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card !p-4 flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="card !p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, school, city, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              className="glass-input pl-9 w-full"
            />
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="glass-input min-w-[140px]">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="glass-input min-w-[120px]">
            <option value="">All Priority</option>
            {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter by city"
            value={filterCity}
            onChange={(e) => { setFilterCity(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="glass-input min-w-[120px]"
          />
          <input
            type="text"
            placeholder="Assigned to"
            value={filterAssigned}
            onChange={(e) => { setFilterAssigned(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="glass-input min-w-[120px]"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="card !p-3 flex items-center gap-3 flex-wrap border-2 border-[#D4AF37]/30">
          <span className="text-sm font-semibold text-gray-700">{selected.size} selected</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="glass-input text-sm !py-1.5">
            <option value="">Change Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input
            type="text"
            placeholder="Assign to..."
            value={bulkAssign}
            onChange={(e) => setBulkAssign(e.target.value)}
            className="glass-input text-sm !py-1.5 w-36"
          />
          <button onClick={handleBulkUpdate} className="glass-button text-xs !py-1.5">Apply</button>
          <button onClick={handleBulkDelete} className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Delete</button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-500 hover:text-gray-700 ml-auto">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-3 w-10">
                  <input type="checkbox" checked={selected.size === leads.length && leads.length > 0} onChange={toggleSelectAll} className="rounded border-gray-300" />
                </th>
                <th className="text-left p-3 font-semibold text-gray-600">Name</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">Designation</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden lg:table-cell">School</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden md:table-cell">City</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden lg:table-cell">Phone</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden xl:table-cell">Email</th>
                <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden lg:table-cell">Follow-up</th>
                <th className="text-left p-3 font-semibold text-gray-600 hidden xl:table-cell">Assigned</th>
                <th className="text-left p-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center py-16 text-gray-400">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="11" className="text-center py-16">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400">No leads found</p>
                </td></tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="border-b border-gray-50 hover:bg-[#D4AF37]/[0.03] transition-colors">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(lead._id)} onChange={() => toggleSelect(lead._id)} className="rounded border-gray-300" />
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-400 md:hidden">{lead.designation}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{lead.designation || '-'}</td>
                  <td className="p-3 hidden lg:table-cell text-gray-600">{lead.school || '-'}</td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{lead.city || '-'}</td>
                  <td className="p-3 hidden lg:table-cell">
                    {lead.phone ? <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a> : '-'}
                  </td>
                  <td className="p-3 hidden xl:table-cell">
                    {lead.email ? <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-xs">{lead.email}</a> : '-'}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(lead.status)}`}>
                      {statusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {lead.nextFollowUp ? (
                      <span className={`text-xs font-medium ${isOverdue(lead.nextFollowUp) && lead.status !== 'converted' && lead.status !== 'lost' ? 'text-red-600' : 'text-gray-600'}`}>
                        {isOverdue(lead.nextFollowUp) && lead.status !== 'converted' && lead.status !== 'lost' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                        {formatDate(lead.nextFollowUp)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-3 hidden xl:table-cell text-gray-600 text-xs">{lead.assignedTo || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => openNotes(lead)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition" title="Notes">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} leads)</p>
            <div className="flex gap-1">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingLead(null); }} />
          <div className="glass-strong rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold gradient-text">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                <button onClick={() => { setShowForm(false); setEditingLead(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input w-full" placeholder="Full name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Designation</label>
                  <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="glass-input w-full" placeholder="Principal, Director..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">School</label>
                  <input type="text" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className="glass-input w-full" placeholder="School name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="glass-input w-full" placeholder="City" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">State</label>
                  <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="glass-input w-full" placeholder="State" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="glass-input w-full" placeholder="Phone number" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="glass-input w-full" placeholder="Email address" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Lead Source</label>
                  <input type="text" value={formData.leadSource} onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })} className="glass-input w-full" placeholder="TOI, Edushine, Referral..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="glass-input w-full">
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="glass-input w-full">
                    {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Contact Method</label>
                  <select value={formData.contactMethod} onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })} className="glass-input w-full">
                    {CONTACT_METHODS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Assigned To</label>
                  <input type="text" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} className="glass-input w-full" placeholder="Team member" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Last Contact</label>
                  <input type="date" value={formData.lastContact} onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })} className="glass-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Next Follow-up</label>
                  <input type="date" value={formData.nextFollowUp} onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })} className="glass-input w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Response / Notes</label>
                  <textarea value={formData.response} onChange={(e) => setFormData({ ...formData, response: e.target.value })} className="glass-input w-full" rows={3} placeholder="Latest response or notes..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button onClick={() => { setShowForm(false); setEditingLead(null); }} className="glass-button-secondary text-sm">Cancel</button>
                <button onClick={handleSave} disabled={!formData.name.trim()} className="glass-button text-sm disabled:opacity-50">
                  {editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && leadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNotes(null)} />
          <div className="glass-strong rounded-2xl w-full max-w-lg relative z-10 shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold gradient-text">Activity Log</h2>
                  <p className="text-sm text-gray-500">{leadDetail.name} - {leadDetail.school || leadDetail.city}</p>
                </div>
                <button onClick={() => setShowNotes(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-4">
                {(!leadDetail.notes || leadDetail.notes.length === 0) ? (
                  <p className="text-sm text-gray-400 text-center py-6">No activity logged yet</p>
                ) : [...leadDetail.notes].reverse().map((note) => (
                  <div key={note._id} className="flex gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-100">
                    <div className="mt-0.5">
                      {note.type === 'email_sent' ? <Mail className="w-4 h-4 text-blue-500" /> :
                       note.type === 'call_made' ? <Phone className="w-4 h-4 text-green-500" /> :
                       note.type === 'meeting' ? <Users className="w-4 h-4 text-purple-500" /> :
                       note.type === 'status_change' ? <ArrowUpDown className="w-4 h-4 text-amber-500" /> :
                       <MessageSquare className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(note.createdAt)} - {note.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-2 mb-2">
                  <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="glass-input text-sm !py-1.5">
                    {NOTE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className="glass-input flex-1"
                    placeholder="Add a note..."
                  />
                  <button onClick={handleAddNote} className="glass-button text-sm" disabled={!noteText.trim()}>Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowImport(false)} />
          <div className="glass-strong rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold gradient-text">Import Leads</h2>
                <button onClick={() => setShowImport(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {!importResult ? (
                <>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4">
                    <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">Upload CSV or Excel file (.csv, .xlsx, .xls)</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="block mx-auto text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer cursor-pointer"
                    />
                    {importLoading && <p className="text-sm text-[#D4AF37] mt-3 font-medium">Parsing file...</p>}
                  </div>

                  {importPreview.length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Preview ({importData.length} leads detected)</p>
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-xs border border-gray-100 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left p-2 font-semibold text-gray-600">Name</th>
                              <th className="text-left p-2 font-semibold text-gray-600">Designation</th>
                              <th className="text-left p-2 font-semibold text-gray-600">School</th>
                              <th className="text-left p-2 font-semibold text-gray-600">City</th>
                              <th className="text-left p-2 font-semibold text-gray-600">Phone</th>
                              <th className="text-left p-2 font-semibold text-gray-600">Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importPreview.map((row, i) => (
                              <tr key={i} className="border-t border-gray-50">
                                <td className="p-2">{row.name}</td>
                                <td className="p-2">{row.designation}</td>
                                <td className="p-2">{row.school}</td>
                                <td className="p-2">{row.city}</td>
                                <td className="p-2">{row.phone}</td>
                                <td className="p-2">{row.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button onClick={handleImportSubmit} className="glass-button text-sm w-full">Import {importData.length} Leads</button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-bold text-gray-900">Import Complete</p>
                  <div className="flex justify-center gap-6 mt-3">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{importResult.inserted}</p>
                      <p className="text-xs text-gray-500">Imported</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{importResult.skipped}</p>
                      <p className="text-xs text-gray-500">Skipped</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{importResult.errors?.length || 0}</p>
                      <p className="text-xs text-gray-500">Errors</p>
                    </div>
                  </div>
                  <button onClick={() => setShowImport(false)} className="glass-button text-sm mt-6">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
