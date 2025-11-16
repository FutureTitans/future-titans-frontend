'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Link2, Plus, Users, Pencil, Trash2 } from 'lucide-react';

export default function SchoolSlugsPage() {
  const [slugs, setSlugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 499,
    isActive: true,
  });

  useEffect(() => {
    fetchSlugs();
  }, []);

  const fetchSlugs = async () => {
    try {
      setLoading(true);
      const data = await admin.getSchoolSlugs();
      // some backends return {slug: {...}}, but our controller returns docs directly
      setSlugs(
        data.map((item) =>
          item.slug ? item : item._doc ? { ...item._doc, studentCount: item.studentCount || 0 } : item
        )
      );
    } catch (error) {
      console.error('Failed to fetch school slugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingSlug(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 499,
      isActive: true,
    });
    setFormOpen(true);
  };

  const openEditForm = (slug) => {
    setEditingSlug(slug);
    setFormData({
      name: slug.name,
      slug: slug.slug,
      description: slug.description || '',
      price: slug.price,
      isActive: slug.isActive,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.price) {
      alert('Name, slug and price are required.');
      return;
    }

    try {
      if (editingSlug) {
        await admin.updateSchoolSlug(editingSlug._id, {
          ...formData,
          price: Number(formData.price),
        });
      } else {
        await admin.createSchoolSlug({
          ...formData,
          price: Number(formData.price),
        });
      }
      setFormOpen(false);
      setEditingSlug(null);
      await fetchSlugs();
    } catch (error) {
      console.error('Failed to save school slug:', error);
      alert(error?.error || 'Failed to save school slug');
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Delete slug "${slug.slug}"? This will not remove existing students, only the slug config.`)) {
      return;
    }
    try {
      await admin.deleteSchoolSlug(slug._id);
      await fetchSlugs();
    } catch (error) {
      console.error('Failed to delete school slug:', error);
      alert('Failed to delete');
    }
  };

  const getRegistrationLink = (slugValue) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/signup?slug=${encodeURIComponent(slugValue)}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading school slugs..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">School Slugs & Cohorts</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition"
        >
          <Plus className="w-5 h-5" />
          New School Slug
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="card mb-8">
          <h3 className="font-bold text-lg mb-4">
            {editingSlug ? 'Edit School Slug' : 'Create School Slug'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                  placeholder="e.g. Delhi Public School - Indiranagar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug (URL-safe, lowercase) *
                  <span className="block text-xs text-neutral-medium">
                    Used in signup link: /signup?slug=&lt;slug&gt;
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                  }
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                  placeholder="e.g. dps-indiranagar-2025"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discounted Price (₹) *
                  <span className="block text-xs text-neutral-medium">
                    Students registering via this slug will pay this price (default is ₹999).
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === 'active' })
                  }
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-20"
                placeholder="Notes about this school/cohort or special terms."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditingSlug(null);
                }}
                className="px-4 py-2 bg-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-border transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-darkRed transition"
              >
                {editingSlug ? 'Save Changes' : 'Create Slug'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slugs List */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Active School Slugs</h3>
        {slugs.length === 0 ? (
          <p className="text-neutral-medium text-sm">No school slugs yet. Create one to get started.</p>
        ) : (
          <div className="space-y-4">
            {slugs.map((slug) => (
              <div
                key={slug._id}
                className="border border-neutral-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{slug.name}</h4>
                    {!slug.isActive && (
                      <span className="badge badge-red text-xs">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-medium mb-1">
                    Slug: <span className="font-mono">{slug.slug}</span>
                  </p>
                  <p className="text-sm text-neutral-medium mb-1">
                    Price: <span className="font-semibold">₹{slug.price}</span> (default: ₹999)
                  </p>
                  {slug.description && (
                    <p className="text-sm text-neutral-medium line-clamp-2">{slug.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {slug.studentCount || 0} students
                    </span>
                    {typeof window !== 'undefined' && (
                      <button
                        type="button"
                        onClick={() => {
                          const link = getRegistrationLink(slug.slug);
                          navigator.clipboard.writeText(link);
                          alert('Registration link copied to clipboard');
                        }}
                        className="flex items-center gap-1 text-primary-red hover:text-primary-darkRed transition"
                      >
                        <Link2 className="w-3 h-3" />
                        Copy signup link
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(slug)}
                    className="flex items-center gap-1 px-3 py-2 text-primary-red hover:bg-primary-lightRed rounded-lg transition text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slug)}
                    className="flex items-center gap-1 px-3 py-2 text-semantic-error hover:bg-red-50 rounded-lg transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


