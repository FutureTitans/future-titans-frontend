'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
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
        setLoading(true);
        const data = await admin.getStudents({
          search,
          schoolSlug: selectedSlug || undefined,
          page: pagination.page,
          limit: 50,
        });
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

  const handleDelete = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}? This will delete all their data including AI chats and submissions. This action cannot be undone.`)) return;
    try {
      await admin.deleteStudent(student._id);
      setStudents(students.filter(s => s._id !== student._id));
    } catch (error) {
      alert('Failed to delete student: ' + (error?.error || error?.message || 'Unknown error'));
    }
  };

  if (loading && students.length === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Students</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total || students.length} registered students</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 flex items-center gap-2 glass-input !py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(p => ({ ...p, page: 1 }));
              }}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="glass-input !py-2.5 text-sm sm:w-56"
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

      {/* Students Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-semibold text-gray-600">Student</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">School</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden lg:table-cell">Slug</th>
                <th className="text-center p-4 font-semibold text-gray-600">SSI</th>
                <th className="text-center p-4 font-semibold text-gray-600">Status</th>
                <th className="text-center p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No students found</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-50 hover:bg-[#D4AF37]/[0.03] transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">{student.school || '-'}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                        {student.schoolSlug || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-[#D4AF37]/10 to-[#F5D76E]/10 text-[#B8952E] border border-[#D4AF37]/20">
                        {student.ssiScore || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {student.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                          title="View details"
                          onClick={() => router.push(`/admin/students/${student._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                          title="Delete student"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
