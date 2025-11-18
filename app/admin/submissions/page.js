'use client';

import { useEffect, useState } from 'react';
import { submission } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Download, Eye, Edit } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailedSubmission, setDetailedSubmission] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      // Get the submission details to access the PDF URL directly
      const details = detailedSubmission || await submission.getDetails(submissionId);
      
      if (details?.pdfFile) {
        // If it's a URL (Vercel Blob or HTTP), open directly in new tab
        if (details.pdfFile.startsWith('http://') || details.pdfFile.startsWith('https://')) {
          window.open(details.pdfFile, '_blank');
        } else {
          // Otherwise, use the download endpoint (which will redirect or download)
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';
          const token = getAuthToken();
          
          const response = await fetch(`${API_URL}/submission/admin/${submissionId}/download/pdf`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            redirect: 'follow', // Follow redirects automatically
          });
          
          if (response.ok) {
            // Check if response is a PDF blob or a redirect
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/pdf')) {
              // Download as blob
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
              // It's a redirect, open the final URL
              window.open(response.url, '_blank');
            }
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
                        onClick={() => handleViewDetails(sub)}
                        className="text-primary-red hover:text-primary-darkRed transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-primary-red hover:text-primary-darkRed transition" title="Edit score">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(sub._id)}
                        className="text-primary-red hover:text-primary-darkRed transition" 
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

      {/* Detail View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedSubmission.projectTitle}</h2>
                  <div className="flex gap-2 items-center">
                    <span className={`badge capitalize ${
                      selectedSubmission.submissionStatus === 'submitted' ? 'badge-red' :
                      selectedSubmission.submissionStatus === 'shortlisted' ? 'badge-success' :
                      selectedSubmission.submissionStatus === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-neutral-light text-neutral-dark'
                    }`}>
                      {selectedSubmission.submissionStatus}
                    </span>
                    {selectedSubmission.adminScore && (
                      <span className="text-sm font-semibold text-primary-red">
                        Score: {selectedSubmission.adminScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setDetailedSubmission(null);
                  }}
                  className="text-neutral-medium hover:text-neutral-dark text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {loadingDetails ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Loading details..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="bg-neutral-light p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Student Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-medium">Name:</span>{' '}
                        <span className="font-medium">{detailedSubmission?.studentId?.name || selectedSubmission.studentId?.name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-medium">Email:</span>{' '}
                        <span className="font-medium">{detailedSubmission?.studentId?.email || selectedSubmission.studentId?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-medium">School:</span>{' '}
                        <span className="font-medium">{detailedSubmission?.studentId?.school || selectedSubmission.studentId?.school || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-medium">Submitted:</span>{' '}
                        <span className="font-medium">
                          {selectedSubmission.submittedAt 
                            ? new Date(selectedSubmission.submittedAt).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {detailedSubmission?.teamMembers && detailedSubmission.teamMembers.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Team Members</h3>
                      <div className="space-y-2">
                        {detailedSubmission.teamMembers.map((member, idx) => (
                          <div key={idx} className="bg-neutral-light p-3 rounded-lg text-sm">
                            <span className="font-medium">{member.name}</span> - {member.email} ({member.role})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Primary Category</h3>
                      <p className="text-neutral-medium">{detailedSubmission?.primaryCategory || selectedSubmission.primaryCategory}</p>
                    </div>
                    {detailedSubmission?.secondaryCategory && (
                      <div>
                        <h3 className="font-semibold mb-2">Secondary Category</h3>
                        <p className="text-neutral-medium">{detailedSubmission.secondaryCategory}</p>
                      </div>
                    )}
                  </div>

                  {/* Core Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Elevator Pitch</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.elevatorPitch || selectedSubmission.elevatorPitch}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Problem Statement</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.problemStatement || selectedSubmission.problemStatement}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Existing Solutions</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.existingSolutions || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Solution Overview</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.solutionOverview || selectedSubmission.solutionOverview}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Prototype Description</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.prototypeDescription || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Business & Impact */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Business Model</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.businessModel || selectedSubmission.businessModel || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Impact Description</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg">{detailedSubmission?.impactDescription || selectedSubmission.impactDescription || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">User Types</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.userTypes || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Reach Strategy</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.reachStrategy || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Team Skills</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.teamSkills || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Want to Learn</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.wantToLearn || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Biggest Costs */}
                  {detailedSubmission?.biggestCosts && detailedSubmission.biggestCosts.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Biggest Costs</h3>
                      <ul className="list-disc list-inside space-y-1 bg-neutral-light p-3 rounded-lg">
                        {detailedSubmission.biggestCosts.map((cost, idx) => (
                          <li key={idx} className="text-neutral-medium text-sm">{cost}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Implementation & Vision */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Implementation Timeline</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.implementationTimeline || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Resources Needed</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.resourcesNeeded || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Expected Short-Term Outcomes</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.expectedShortTermOutcomes || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Long-Term Vision</h3>
                      <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission?.longTermVision || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    {detailedSubmission?.improvementPlan && (
                      <div>
                        <h3 className="font-semibold mb-2">Improvement Plan</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.improvementPlan}</p>
                      </div>
                    )}
                    {detailedSubmission?.successMetrics && (
                      <div>
                        <h3 className="font-semibold mb-2">Success Metrics</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.successMetrics}</p>
                      </div>
                    )}
                    {detailedSubmission?.risks && (
                      <div>
                        <h3 className="font-semibold mb-2">Risks</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.risks}</p>
                      </div>
                    )}
                    {detailedSubmission?.primaryBeneficiaries && (
                      <div>
                        <h3 className="font-semibold mb-2">Primary Beneficiaries</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.primaryBeneficiaries}</p>
                      </div>
                    )}
                    {detailedSubmission?.keyStakeholders && (
                      <div>
                        <h3 className="font-semibold mb-2">Key Stakeholders</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.keyStakeholders}</p>
                      </div>
                    )}
                    {detailedSubmission?.sustainability && (
                      <div>
                        <h3 className="font-semibold mb-2">Sustainability</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.sustainability}</p>
                      </div>
                    )}
                    {detailedSubmission?.ethicalConsiderations && (
                      <div>
                        <h3 className="font-semibold mb-2">Ethical Considerations</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.ethicalConsiderations}</p>
                      </div>
                    )}
                    {detailedSubmission?.inspiration && (
                      <div>
                        <h3 className="font-semibold mb-2">Inspiration</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.inspiration}</p>
                      </div>
                    )}
                    {detailedSubmission?.previousWork && (
                      <div>
                        <h3 className="font-semibold mb-2">Previous Work</h3>
                        <p className="text-neutral-medium bg-neutral-light p-3 rounded-lg text-sm">{detailedSubmission.previousWork}</p>
                      </div>
                    )}
                  </div>

                  {/* Files */}
                  <div className="border-t border-neutral-border pt-4">
                    <h3 className="font-semibold mb-3">Attachments</h3>
                    <div className="flex gap-4">
                      {detailedSubmission?.pdfFile && (
                        <button
                          onClick={() => handleDownloadPDF(selectedSubmission._id)}
                          className="flex items-center gap-2 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition"
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
                          className="flex items-center gap-2 bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-border transition"
                        >
                          <Download className="w-4 h-4" />
                          View Video
                        </a>
                      )}
                      {!detailedSubmission?.pdfFile && !detailedSubmission?.videoFile && (
                        <p className="text-neutral-medium text-sm">No files attached</p>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {detailedSubmission?.adminNotes && (
                    <div className="border-t border-neutral-border pt-4">
                      <h3 className="font-semibold mb-2">Admin Notes</h3>
                      <p className="text-neutral-medium bg-yellow-50 p-3 rounded-lg text-sm">{detailedSubmission.adminNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-neutral-border">
                    <button 
                      onClick={() => handleDownloadPDF(selectedSubmission._id)}
                      disabled={!detailedSubmission?.pdfFile}
                      className="flex items-center gap-2 bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button 
                      onClick={() => {
                        // TODO: Implement shortlist functionality
                        alert('Shortlist functionality coming soon');
                      }}
                      className="flex-1 bg-accent-gold text-white px-4 py-2 rounded-lg hover:bg-accent-amber transition"
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedSubmission(null);
                        setDetailedSubmission(null);
                      }}
                      className="flex-1 bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-border transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

