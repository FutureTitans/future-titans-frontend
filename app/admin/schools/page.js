'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Link2, Plus, Users, Pencil, Trash2, X, School, Shield } from 'lucide-react';

export default function SchoolSlugsPage() {
  const [slugs, setSlugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: 1500,
    requiresPayment: true, isActive: true,
    pocName: '', pocEmail: '', pocPassword: '',
  });

  useEffect(() => { fetchSlugs(); }, []);

  const fetchSlugs = async () => {
    try {
      setLoading(true);
      const data = await admin.getSchoolSlugs();
      setSlugs(data.map((item) => item.slug ? item : item._doc ? { ...item._doc, studentCount: item.studentCount || 0 } : item));
    } catch (error) {
      console.error('Failed to fetch school slugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingSlug(null);
    setFormData({ name: '', slug: '', description: '', price: 1500, requiresPayment: true, isActive: true, pocName: '', pocEmail: '', pocPassword: '' });
    setFormOpen(true);
  };

  const openEditForm = (slug) => {
    setEditingSlug(slug);
    setFormData({
      name: slug.name, slug: slug.slug, description: slug.description || '',
      price: slug.price, requiresPayment: slug.requiresPayment !== undefined ? slug.requiresPayment : true,
      isActive: slug.isActive, pocName: slug.pocName || '', pocEmail: slug.pocEmail || '', pocPassword: '',
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.price) { alert('Name, slug and price are required.'); return; }
    try {
      if (editingSlug) {
        await admin.updateSchoolSlug(editingSlug._id, { ...formData, price: Number(formData.price) });
      } else {
        await admin.createSchoolSlug({ ...formData, price: Number(formData.price) });
      }
      setFormOpen(false);
      setEditingSlug(null);
      await fetchSlugs();
    } catch (error) {
      alert(error?.error || 'Failed to save school slug');
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Delete slug "${slug.slug}"? This will not remove existing students.`)) return;
    try { await admin.deleteSchoolSlug(slug._id); await fetchSlugs(); }
    catch (error) { alert('Failed to delete'); }
  };

  const handleReviewProof = async (slugId, status) => {
    if (!confirm(`${status} this school's proof of acceptance?`)) return;
    try { await admin.reviewSchoolProof(slugId, { status }); await fetchSlugs(); }
    catch (error) { alert(error?.error || 'Failed to review proof'); }
  };

  const getRegistrationLink = (slugValue) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/signup?slug=${encodeURIComponent(slugValue)}`;
  };

  if (loading) return <LoadingSpinner message="Loading school slugs..." />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">School Slugs</h1>
          <p className="text-sm text-gray-500 mt-1">{slugs.length} school cohorts configured</p>
        </div>
        <button onClick={openCreateForm} className="glass-button flex items-center gap-2 !px-4 !py-2.5 text-sm">
          <Plus className="w-4 h-4" />
          New School Slug
        </button>
      </div>

      {/* Create/Edit Form */}
      {formOpen && (
        <div className="card border-2 border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-gray-800">{editingSlug ? 'Edit School Slug' : 'Create School Slug'}</h3>
            <button onClick={() => { setFormOpen(false); setEditingSlug(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input" placeholder="Delhi Public School - Indiranagar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL-safe) *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="glass-input" placeholder="dps-indiranagar-2026" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
                <input type="number" min={0} value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment</label>
                <select value={formData.requiresPayment ? 'yes' : 'no'} onChange={(e) => setFormData({ ...formData, requiresPayment: e.target.value === 'yes' })} className="glass-input">
                  <option value="yes">Required</option>
                  <option value="no">Free Access</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select value={formData.isActive ? 'active' : 'inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })} className="glass-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="glass-input resize-none h-20" placeholder="Notes about this school or cohort" />
            </div>

            {/* POC Section */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-semibold text-sm text-gray-700">POC Login Credentials</h4>
                <span className="text-xs text-gray-400">(optional)</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">POC Name</label>
                  <input type="text" value={formData.pocName} onChange={(e) => setFormData({ ...formData, pocName: e.target.value })} className="glass-input" placeholder="Principal Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">POC Email</label>
                  <input type="email" value={formData.pocEmail} onChange={(e) => setFormData({ ...formData, pocEmail: e.target.value })} className="glass-input" placeholder="poc@school.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">POC Password {editingSlug && <span className="text-xs text-gray-400">(blank = keep)</span>}</label>
                  <input type="password" value={formData.pocPassword} onChange={(e) => setFormData({ ...formData, pocPassword: e.target.value })} className="glass-input" placeholder="********" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">POC can login at <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">/school-poc/login</code></p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="glass-button !px-6 !py-2.5 text-sm">{editingSlug ? 'Save Changes' : 'Create Slug'}</button>
              <button type="button" onClick={() => { setFormOpen(false); setEditingSlug(null); }} className="glass-button-secondary !px-6 !py-2.5 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Slugs List */}
      {slugs.length === 0 ? (
        <div className="card text-center py-12">
          <School className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No school slugs yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slugs.map((slug) => (
            <div key={slug._id} className="card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-bold text-gray-800">{slug.name}</h4>
                    {!slug.isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">Inactive</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{slug.slug}</span>
                    <span className="font-semibold text-gray-700">{slug.price}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${slug.requiresPayment === false ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                      {slug.requiresPayment === false ? 'Free' : 'Paid'}
                    </span>
                    <span className="flex items-center gap-1 text-xs"><Users className="w-3 h-3" />{slug.studentCount || 0} students</span>
                  </div>
                  {slug.description && <p className="text-sm text-gray-500 line-clamp-2">{slug.description}</p>}

                  {/* Approval Status */}
                  {slug.approvalStatus !== 'Approved' && (
                    <div className="mt-3 glass-subtle rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Registration: <span className="text-amber-600">{slug.approvalStatus}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slug.proofOfAcceptance && (
                          <a href={slug.proofOfAcceptance} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">View Proof</a>
                        )}
                        <button onClick={() => handleReviewProof(slug._id, 'Approved')} className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">Approve</button>
                        <button onClick={() => handleReviewProof(slug._id, 'Rejected')} className="text-xs px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">Reject</button>
                      </div>
                    </div>
                  )}

                  {/* Copy Link */}
                  {typeof window !== 'undefined' && (
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(getRegistrationLink(slug.slug)); alert('Registration link copied!'); }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-[#B8952E] hover:text-[#D4AF37] font-medium transition"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      Copy signup link
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEditForm(slug)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#B8952E] transition" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(slug)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
