'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, Users, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await admin.getStudents({
          search: debouncedSearch || undefined,
          school: selectedSchool || undefined,
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
  }, [debouncedSearch, selectedSchool, pagination.page]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await admin.getStudentSchools();
        if (Array.isArray(data) && data.length > 0) {
          setSchoolOptions(data);
          return;
        }
      } catch (error) {
        // New endpoint not deployed yet — fall through to slug-based list.
      }
      try {
        const slugs = await admin.getSchoolSlugs();
        setSchoolOptions(
          (Array.isArray(slugs) ? slugs : []).map((s) => ({
            name: s.name,
            count: s.studentCount || 0,
            slug: s.slug,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch schools for filter:', error);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    if (!students.length) return;
    setSchoolOptions((prev) => {
      const map = new Map(prev.map((s) => [s.name, s]));
      students.forEach((st) => {
        if (st.school && !map.has(st.school)) {
          map.set(st.school, { name: st.school, count: 0, slug: st.schoolSlug || null });
        }
      });
      const merged = Array.from(map.values());
      if (merged.length === prev.length) return prev;
      return merged.sort((a, b) => a.name.localeCompare(b.name));
    });
  }, [students]);

  const formatExportDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toISOString().split('T')[0];
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const baseFilters = {
        search: debouncedSearch || undefined,
        school: selectedSchool || undefined,
        limit: 100,
      };

      const all = [];
      let page = 1;
      while (true) {
        const data = await admin.getStudents({ ...baseFilters, page });
        const batch = Array.isArray(data) ? data : (data.students || []);
        all.push(...batch);
        const totalPages = Array.isArray(data) ? 1 : (data.pagination?.totalPages || 1);
        if (Array.isArray(data) || page >= totalPages || batch.length === 0) break;
        page += 1;
      }

      if (all.length === 0) {
        alert('No students to export.');
        return;
      }

      const rows = all.map((s) => ({
        Name: s.name || '',
        Email: s.email || '',
        Phone: s.phone || '',
        School: s.school || '',
        'School Slug': s.schoolSlug || '',
        Class: s.class || s.grade || '',
        City: s.city || '',
        State: s.state || '',
        Country: s.country || '',
        'SSI Score': s.ssiScore ?? 0,
        'Self Awareness': s.ssiBreakdown?.selfAwareness ?? '',
        Understanding: s.ssiBreakdown?.understanding ?? '',
        Resilience: s.ssiBreakdown?.resilience ?? '',
        Growth: s.ssiBreakdown?.growth ?? '',
        'Entrepreneurial Leadership': s.ssiBreakdown?.entrepreneurialLeadership ?? '',
        'Is Paid': s.isPaid ? 'Yes' : 'No',
        'Modules Started': Array.isArray(s.modulesProgress) ? s.modulesProgress.length : 0,
        'Modules Completed': Array.isArray(s.modulesProgress)
          ? s.modulesProgress.filter((m) => m.completedAt).length
          : 0,
        'Registered On': formatExportDate(s.createdAt),
        'Last Updated': formatExportDate(s.updatedAt),
      }));

      const XLSX = await import('xlsx');
      const xlsxLib = XLSX.default || XLSX;
      const ws = xlsxLib.utils.json_to_sheet(rows);
      const wb = xlsxLib.utils.book_new();
      xlsxLib.utils.book_append_sheet(wb, ws, 'Students');
      const filenameParts = ['students'];
      if (selectedSchool) filenameParts.push(selectedSchool.replace(/[^a-z0-9]+/gi, '_'));
      filenameParts.push(new Date().toISOString().split('T')[0]);
      xlsxLib.writeFile(wb, `${filenameParts.join('_')}.xlsx`);
    } catch (error) {
      console.error('Failed to export students:', error);
      alert('Failed to export students: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Students</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total || students.length} registered students</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || students.length === 0}
          className="glass-button-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download students as XLSX"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Download XLSX'}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 flex items-center gap-2 glass-input !py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, or school..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(p => ({ ...p, page: 1 }));
              }}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          <select
            value={selectedSchool}
            onChange={(e) => {
              setSelectedSchool(e.target.value);
              setPagination(p => ({ ...p, page: 1 }));
            }}
            className="glass-input !py-2.5 text-sm sm:w-56"
          >
            <option value="">All schools ({schoolOptions.length})</option>
            {schoolOptions.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.count})
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
