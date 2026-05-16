'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/auth';
import { upload } from '@vercel/blob/client';
import { Eye, EyeOff, Plus, Pencil, Users, X } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AdminAssociations() {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = { name: '', email: '', password: '', commissionPercentage: 0, profilePicture: null, bio: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fetchAssociations = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/associations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch associations');
      const data = await res.json();
      setAssociations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssociations(); }, []);

  const openCreateModal = () => {
    setEditMode(false); setEditId(null); setFormData(initialFormState); setShowModal(true);
  };

  const openEditModal = (assoc) => {
    setEditMode(true); setEditId(assoc._id);
    setFormData({ name: assoc.name, email: assoc.email, password: '', commissionPercentage: assoc.commissionPercentage, profilePicture: null, bio: assoc.bio || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let profilePictureUrl = undefined;
      if (formData.profilePicture) {
        const uniqueFilename = `assoc-${Date.now()}-${formData.profilePicture.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const uploadResult = await upload(uniqueFilename, formData.profilePicture, { access: 'public', handleUploadUrl: '/api/upload' });
        profilePictureUrl = uploadResult.url;
      }

      const token = getAuthToken();
      const payload = { ...formData };
      if (profilePictureUrl !== undefined) { payload.profilePicture = profilePictureUrl; }
      else if (!editMode) { payload.profilePicture = ''; }
      else { delete payload.profilePicture; }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/associations${editMode ? `/${editId}` : ''}`, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) { const data = await res.json(); throw new Error(data.error || `Failed to ${editMode ? 'update' : 'create'} association`); }
      setShowModal(false); setFormData(initialFormState); setEditMode(false); setEditId(null);
      fetchAssociations();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading associations..." />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Associations</h1>
          <p className="text-sm text-gray-500 mt-1">{associations.length} partner associations</p>
        </div>
        <button onClick={openCreateModal} className="glass-button flex items-center gap-2 !px-4 !py-2.5 text-sm">
          <Plus className="w-4 h-4" />
          Create Association
        </button>
      </div>

      {error && (
        <div className="glass-subtle border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
      )}

      {/* Associations Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-semibold text-gray-600 w-12"></th>
                <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-center p-4 font-semibold text-gray-600">Commission</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden lg:table-cell">Created</th>
                <th className="text-center p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {associations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No associations yet</p>
                  </td>
                </tr>
              ) : (
                associations.map((assoc) => (
                  <tr key={assoc._id} className="border-b border-gray-50 hover:bg-[#D4AF37]/[0.03] transition-colors">
                    <td className="p-4">
                      {assoc.profilePicture ? (
                        <img src={assoc.profilePicture} alt={assoc.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center text-white font-bold text-sm">
                          {assoc.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{assoc.name}</p>
                      <p className="text-xs text-gray-500 md:hidden">{assoc.email}</p>
                    </td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">{assoc.email}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {assoc.commissionPercentage}%
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(assoc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openEditModal(assoc)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#B8952E] transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="glass-strong rounded-2xl w-full max-w-md relative z-10 shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Association' : 'Create Association'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="glass-input" placeholder="Edu Group India" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="glass-input" placeholder="admin@edugroup.in" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password {editMode && <span className="text-xs text-gray-400">(blank = keep)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editMode}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="glass-input !pr-10"
                      placeholder="Min 6 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Commission %</label>
                  <input type="number" min="0" max="100" required value={formData.commissionPercentage} onChange={e => setFormData({ ...formData, commissionPercentage: parseFloat(e.target.value) })} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Image</label>
                  <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, profilePicture: e.target.files[0] })} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="glass-input resize-none h-20" placeholder="Short description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-button-secondary !py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 glass-button !py-2.5 text-sm disabled:opacity-50">
                    {isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
