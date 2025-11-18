'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [schoolSlugs, setSchoolSlugs] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await admin.getStudents({
          search,
          schoolSlug: selectedSlug || undefined,
          page: pagination.page,
          limit: 50,
        });
        // Handle both old format (array) and new format (object with students and pagination)
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents(data.students || []);
          setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [search, selectedSlug, pagination.page]);

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const data = await admin.getSchoolSlugs();
        setSchoolSlugs(data);
      } catch (error) {
        console.error('Failed to fetch school slugs for filter:', error);
      }
    };
    fetchSlugs();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">Students Management</h1>

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1 flex items-center gap-2 border border-neutral-border rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-neutral-medium" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          <div className="w-full md:w-72">
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Filter by school slug
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg"
            >
              <option value="">All schools</option>
              {schoolSlugs.map((slug) => (
                <option key={slug._id} value={slug.slug}>
                  {slug.name} ({slug.slug})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-border">
            <tr className="text-left text-sm font-semibold text-neutral-dark">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">School</th>
              <th className="p-4">Slug</th>
              <th className="p-4">SSI Score</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-neutral-medium">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="border-b border-neutral-border hover:bg-neutral-light transition">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4 text-sm">{student.email}</td>
                  <td className="p-4 text-sm">{student.school}</td>
                  <td className="p-4 text-xs font-mono text-neutral-medium">{student.schoolSlug || '-'}</td>
                  <td className="p-4">
                    <span className="badge badge-red">{student.ssiScore || 0}%</span>
                  </td>
                  <td className="p-4">
                    {student.isPaid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      className="text-primary-red hover:text-primary-darkRed transition"
                      title="View details"
                      onClick={() => router.push(`/admin/students/${student._id}`)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 text-center text-neutral-medium text-sm">
        <p>Showing {students.length} students</p>
      </div>
    </div>
  );
}

