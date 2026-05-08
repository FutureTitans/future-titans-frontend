'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import { upload } from '@vercel/blob/client';

export default function AdminAssociations() {
  const router = useRouter();
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const initialFormState = {
    name: '',
    email: '',
    password: '',
    commissionPercentage: 0,
    profilePicture: null,
    bio: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchAssociations = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/associations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchAssociations();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditMode(false);
    setEditId(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (assoc) => {
    setEditMode(true);
    setEditId(assoc._id);
    setFormData({
      name: assoc.name,
      email: assoc.email,
      password: '', // leave empty unless they want to change it
      commissionPercentage: assoc.commissionPercentage,
      profilePicture: null, // this will be uploaded if they select a new one, else backend keeps old
      bio: assoc.bio || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let profilePictureUrl = undefined;
      if (formData.profilePicture) {
        const uniqueFilename = `assoc-${Date.now()}-${formData.profilePicture.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const uploadResult = await upload(uniqueFilename, formData.profilePicture, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          addRandomSuffix: true,
        });
        profilePictureUrl = uploadResult.url;
      }

      const token = getAuthToken();
      const payload = { ...formData };
      
      if (profilePictureUrl !== undefined) {
        payload.profilePicture = profilePictureUrl;
      } else if (!editMode) {
        payload.profilePicture = ''; // explicitly clear for new creation
      } else {
        delete payload.profilePicture; // omit it during edit so backend preserves old image
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/associations${editMode ? `/${editId}` : ''}`, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${editMode ? 'update' : 'create'} association`);
      }

      setShowModal(false);
      setFormData(initialFormState);
      setEditMode(false);
      setEditId(null);
      fetchAssociations();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading associations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-dark">Association Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-primary-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          + Create Association
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-light border-b border-neutral-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-dark w-16">Image</th>
                <th className="px-6 py-4 font-semibold text-neutral-dark">Name</th>
                <th className="px-6 py-4 font-semibold text-neutral-dark">Email</th>
                <th className="px-6 py-4 font-semibold text-neutral-dark">Commission (%)</th>
                <th className="px-6 py-4 font-semibold text-neutral-dark">Created At</th>
                <th className="px-6 py-4 font-semibold text-neutral-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {associations.map((assoc) => (
                <tr key={assoc._id} className="hover:bg-neutral-light/50 transition-colors">
                  <td className="px-6 py-4">
                    {assoc.profilePicture ? (
                      <img src={assoc.profilePicture} alt={assoc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400 font-bold text-sm">
                        {assoc.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{assoc.name}</td>
                  <td className="px-6 py-4 text-neutral-medium">{assoc.email}</td>
                  <td className="px-6 py-4 text-neutral-medium">{assoc.commissionPercentage}%</td>
                  <td className="px-6 py-4 text-neutral-medium">
                    {new Date(assoc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(assoc)} 
                      className="text-[#D4AF37] hover:text-[#B8952E] font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {associations.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-neutral-medium">
                    No associations found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold mb-6">{editMode ? 'Edit Association' : 'Create Association'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Association Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                  placeholder="e.g. Edu Group India"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  placeholder="admin@edugroup.in"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password {editMode && <span className="text-xs text-neutral-400 font-normal">(Leave blank to keep current)</span>}</label>
                <input
                  type="password"
                  required={!editMode}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commission Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.commissionPercentage}
                  onChange={e => setFormData({ ...formData, commissionPercentage: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  placeholder="e.g. 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData({ ...formData, profilePicture: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio / Description (Optional)</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none h-20"
                  placeholder="Short description about the association..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-50"
                >
                  {isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
