'use client';

import { useEffect, useState } from 'react';
import { submission } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Download, Eye, X, ChevronLeft, ChevronRight, FileText, Trophy, Ban } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailedSubmission, setDetailedSubmission] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await submission.getAll({ status: filter, page: pagination.page, limit: 50 });
      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        setSubmissions(data.submissions || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination({ page: 1, totalPages: 1, total: 0 });
    fetchSubmissions();
  }, [filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [pagination.page]);

  const fetchSubmissionDetails = async (submissionId) => {
    try {
      setLoadingDetails(true);
      const data = await submission.getDetails(submissionId);
      setDetailedSubmission(data);
    } catch (error) {
      console.error('Failed to fetch submission details:', error);
      setDetailedSubmission(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = async (sub) => {
    setSelectedSubmission(sub);
    await fetchSubmissionDetails(sub._id);
  };

  const handleDownloadPDF = async (submissionId) => {
    try {
      const details = detailedSubmission || await submission.getDetails(submissionId);
      if (details?.pdfFile) {
        let downloadUrl = details.pdfFile;
        if (downloadUrl.startsWith('http')) {
          if (downloadUrl.includes('public.blob.vercel-storage.com') && !downloadUrl.includes('download=1')) {
            downloadUrl += (downloadUrl.includes('?') ? '&' : '?') + 'download=1';
          }
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `submission-${submissionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';
          const token = getAuthToken();
          const response = await fetch(`${API_URL}/submission/admin/${submissionId}/download/pdf`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            redirect: 'follow',
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `submission-${submissionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            throw new Error('Failed to download PDF');
          }
        }
      } else {
        alert('No PDF file available for this submission');
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF: ' + (error.error || error.message || 'Unknown error'));
    }
  };

  const handleShortlist = async (submissionId) => {
    if (!confirm('Shortlist this submission?')) return;
    try {
      await submission.score(submissionId, { submissionStatus: 'shortlisted' });
      setSubmissions(submissions.map(sub =>
        sub._id === submissionId ? { ...sub, submissionStatus: 'shortlisted' } : sub
      ));
      if (detailedSubmission && selectedSubmission?._id === submissionId) {
        setDetailedSubmission({ ...detailedSubmission, submissionStatus: 'shortlisted' });
        setSelectedSubmission({ ...selectedSubmission, submissionStatus: 'shortlisted' });
      }
    } catch (error) {
      alert('Failed to shortlist: ' + (error.error || error.message || 'Unknown error'));
    }
  };

  const handleReject = async (submissionId) => {
    if (!confirm('Reject and permanently delete this submission? This cannot be undone.')) return;
    try {
      await submission.reject(submissionId);
      setSubmissions(submissions.filter(sub => sub._id !== submissionId));
      setSelectedSubmission(null);
      setDetailedSubmission(null);
    } catch (error) {
      alert('Failed to reject: ' + (error.error || error.message || 'Unknown error'));
    }
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setDetailedSubmission(null);
  };

  if (loading && submissions.length === 0) return <LoadingSpinner message="Loading submissions..." />;

  const statusColors = {
    submitted: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage student idea submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {['submitted', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-md'
                : 'glass-subtle text-gray-600 hover:text-gray-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-semibold text-gray-600">Project</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">Student</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden lg:table-cell">Category</th>
                <th className="text-center p-4 font-semibold text-gray-600">Status</th>
                <th className="text-center p-4 font-semibold text-gray-600">Score</th>
                <th className="text-center p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No {filter} submissions</p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="border-b border-gray-50 hover:bg-[#D4AF37]/[0.03] transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-800 line-clamp-1">{sub.projectTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5 md:hidden">{sub.studentId?.name || 'N/A'}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-gray-700">{sub.studentId?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{sub.studentId?.email}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-600">{sub.primaryCategory || sub.category}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors[sub.submissionStatus] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {sub.submissionStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-[#B8952E]">{sub.adminScore || '-'}</span>
                      <span className="text-gray-400 text-xs">/100</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewDetails(sub)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(sub._id)}
                          className="p-2 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition"
                          title="Download PDF"
                          disabled={!sub.pdfFile}
                        >
                          <Download className="w-4 h-4" />
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
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] z-50 overflow-y-auto" onClick={closeModal}>
          <div className="glass-strong rounded-2xl max-w-3xl w-full shadow-2xl border border-white/30 my-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{selectedSubmission.projectTitle}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors[selectedSubmission.submissionStatus] || ''}`}>
                    {selectedSubmission.submissionStatus}
                  </span>
                  {selectedSubmission.adminScore && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-[#B8952E] border border-[#D4AF37]/20">
                      Score: {selectedSubmission.adminScore}/100
                    </span>
                  )}
                </div>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition ml-3">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-5">
              {loadingDetails ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Loading details..." />
                </div>
              ) : (
                <>
                  {/* Student Info */}
                  <div className="glass-subtle rounded-xl p-4">
                    <h3 className="font-semibold text-sm text-gray-700 mb-2">Student</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{detailedSubmission?.studentId?.name || selectedSubmission.studentId?.name || 'N/A'}</span></div>
                      <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800">{detailedSubmission?.studentId?.email || selectedSubmission.studentId?.email || 'N/A'}</span></div>
                      <div><span className="text-gray-500">School:</span> <span className="font-medium text-gray-800">{detailedSubmission?.studentId?.school || 'N/A'}</span></div>
                      <div><span className="text-gray-500">Submitted:</span> <span className="font-medium text-gray-800">{selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleDateString() : 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {detailedSubmission?.teamMembers?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-2">Team Members</h3>
                      <div className="space-y-2">
                        {detailedSubmission.teamMembers.map((member, idx) => (
                          <div key={idx} className="glass-subtle rounded-lg p-3 text-sm">
                            <span className="font-medium text-gray-800">{member.name}</span>
                            <span className="text-gray-500"> — {member.email} ({member.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Sections */}
                  {[
                    { label: 'Elevator Pitch', value: detailedSubmission?.elevatorPitch || selectedSubmission.elevatorPitch },
                    { label: 'Problem Statement', value: detailedSubmission?.problemStatement || selectedSubmission.problemStatement },
                    { label: 'Existing Solutions', value: detailedSubmission?.existingSolutions },
                    { label: 'Solution Overview', value: detailedSubmission?.solutionOverview || selectedSubmission.solutionOverview },
                    { label: 'Prototype', value: detailedSubmission?.prototypeDescription },
                    { label: 'Business Model', value: detailedSubmission?.businessModel },
                    { label: 'Impact', value: detailedSubmission?.impactDescription },
                    { label: 'User Types', value: detailedSubmission?.userTypes },
                    { label: 'Reach Strategy', value: detailedSubmission?.reachStrategy },
                    { label: 'Team Skills', value: detailedSubmission?.teamSkills },
                    { label: 'Want to Learn', value: detailedSubmission?.wantToLearn },
                    { label: 'Improvement Plan', value: detailedSubmission?.improvementPlan },
                    { label: 'Inspiration', value: detailedSubmission?.inspiration },
                    { label: 'Previous Work', value: detailedSubmission?.previousWork },
                  ].filter(s => s.value).map((section, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1.5">{section.label}</h3>
                      <p className="text-sm text-gray-600 glass-subtle rounded-lg p-3">{section.value}</p>
                    </div>
                  ))}

                  {/* Biggest Costs */}
                  {detailedSubmission?.biggestCosts?.filter(c => c).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-gray-700 mb-1.5">Biggest Costs</h3>
                      <ul className="list-disc list-inside glass-subtle rounded-lg p-3 space-y-1">
                        {detailedSubmission.biggestCosts.filter(c => c).map((cost, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{cost}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Files */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">Attachments</h3>
                    <div className="flex flex-wrap gap-3">
                      {detailedSubmission?.pdfFile && (
                        <button
                          onClick={() => handleDownloadPDF(selectedSubmission._id)}
                          className="glass-button !px-4 !py-2.5 text-sm flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                      )}
                      {detailedSubmission?.videoFile && (
                        <a
                          href={detailedSubmission.videoFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button-secondary !px-4 !py-2.5 text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Video
                        </a>
                      )}
                      {!detailedSubmission?.pdfFile && !detailedSubmission?.videoFile && (
                        <p className="text-sm text-gray-500">No files attached</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex gap-3 p-5 sm:p-6 border-t border-gray-100">
              <button
                onClick={() => handleReject(selectedSubmission._id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm transition"
              >
                <Ban className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleShortlist(selectedSubmission._id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white font-semibold text-sm shadow-md hover:shadow-lg transition"
              >
                <Trophy className="w-4 h-4" />
                Shortlist
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-xl glass-subtle text-gray-700 font-semibold text-sm hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
