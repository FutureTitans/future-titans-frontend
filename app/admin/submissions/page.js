'use client';

import { useEffect, useState } from 'react';
import { submission } from '@/lib/api';
import { Download, Eye, Edit } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      const data = await submission.getAll({ status: filter });
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading submissions..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">Submission Management</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-4 flex-wrap">
          {['submitted', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                filter === status
                  ? 'bg-primary-red text-white'
                  : 'bg-neutral-light text-neutral-dark hover:bg-neutral-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-border">
            <tr className="text-left text-sm font-semibold text-neutral-dark">
              <th className="p-4">Project Title</th>
              <th className="p-4">Team Lead</th>
              <th className="p-4">Category</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-neutral-medium">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub._id} className="border-b border-neutral-border hover:bg-neutral-light transition">
                  <td className="p-4 font-semibold">{sub.projectTitle}</td>
                  <td className="p-4">{sub.studentId?.name || 'N/A'}</td>
                  <td className="p-4 text-sm">{sub.primaryCategory}</td>
                  <td className="p-4 text-sm">{sub.studentId?.email}</td>
                  <td className="p-4">
                    <span
                      className={`badge capitalize ${
                        sub.submissionStatus === 'submitted'
                          ? 'badge-red'
                          : sub.submissionStatus === 'shortlisted'
                          ? 'badge-success'
                          : 'bg-neutral-light text-neutral-dark'
                      }`}
                    >
                      {sub.submissionStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-primary-red">{sub.adminScore || '-'}/100</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-primary-red hover:text-primary-darkRed transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-primary-red hover:text-primary-darkRed transition" title="Edit score">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-primary-red hover:text-primary-darkRed transition" title="Download PDF">
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

      {/* Detail View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedSubmission.projectTitle}</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-neutral-medium hover:text-neutral-dark"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-neutral-dark">Elevator Pitch</p>
                  <p className="text-neutral-medium">{selectedSubmission.elevatorPitch}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark">Problem Statement</p>
                  <p className="text-neutral-medium">{selectedSubmission.problemStatement}</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark">Solution</p>
                  <p className="text-neutral-medium">{selectedSubmission.solutionOverview}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-neutral-dark">Business Model</p>
                    <p className="text-neutral-medium">{selectedSubmission.businessModel}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">Impact</p>
                    <p className="text-neutral-medium">{selectedSubmission.impactDescription}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4 pt-4 border-t border-neutral-border">
                <button className="flex-1 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition">
                  Shortlist
                </button>
                <button className="flex-1 bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-border transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

