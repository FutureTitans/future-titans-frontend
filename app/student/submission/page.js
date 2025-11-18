'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submission, payment, auth } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import { Save, Send, Upload, FileText, Video, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function IdeaSubmissionPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  const [formData, setFormData] = useState({
    // Participant Details
    teamMembers: [{ name: '', email: '', role: '' }],
    
    // Project Overview
    projectTitle: '',
    primaryCategory: '',
    secondaryCategory: '',
    elevatorPitch: '',
    
    // Problem Statement
    problemStatement: '',
    existingSolutions: '',
    
    // Solution Overview
    solutionOverview: '',
    prototypeDescription: '',
    
    // Market & Impact
    userTypes: '',
    reachStrategy: '',
    impactDescription: '',
    
    // Business Model
    businessModel: '',
    biggestCosts: ['', ''],
    
    // Think Like a Titan
    teamSkills: '',
    wantToLearn: '',
    improvementPlan: '',
    
    // Impact & Feasibility
    expectedShortTermOutcomes: '',
    longTermVision: '',
    successMetrics: '',
    resourcesNeeded: '',
    implementationTimeline: '',
    risks: '',
    
    // Target Audience
    primaryBeneficiaries: '',
    keyStakeholders: '',
    
    // Sustainability & Ethics
    sustainability: '',
    ethicalConsiderations: '',
    
    // Additional Info
    inspiration: '',
    previousWork: '',
  });

  const [files, setFiles] = useState({
    pdfFile: null,
    videoFile: null,
  });

  const [errors, setErrors] = useState({});

  const sections = [
    { id: 0, title: 'Participant Details', icon: '👥' },
    { id: 1, title: 'Project Overview', icon: '🎯' },
    { id: 2, title: 'Problem Statement', icon: '❓' },
    { id: 3, title: 'Solution Overview', icon: '💡' },
    { id: 4, title: 'Market & Impact', icon: '🌍' },
    { id: 5, title: 'Business Model', icon: '💰' },
    { id: 6, title: 'Think Like a Titan', icon: '🧠' },
    { id: 7, title: 'Impact & Feasibility', icon: '📊' },
    { id: 8, title: 'Target Audience', icon: '🎯' },
    { id: 9, title: 'Sustainability & Ethics', icon: '♻️' },
    { id: 10, title: 'Additional Info', icon: '📝' },
    { id: 11, title: 'File Uploads', icon: '📎' },
  ];

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }
    
    checkAccess();
  }, [router]);

  const checkAccess = async () => {
    try {
      const [paymentData, profile] = await Promise.all([
        payment.getPaymentStatus(),
        auth.getProfile(),
      ]);

      setPaymentStatus(paymentData);

      if (!paymentData.isPaid) {
        alert('Please complete payment before submitting your idea.');
        router.push('/student/dashboard');
        return;
      }

      // Check module completion using dedicated endpoint for accurate check
      try {
        const completionStatus = await auth.checkCompletionStatus();
        console.log('📊 Submission Page - Completion Status:', completionStatus);
        
        if (!completionStatus.allCompleted) {
          const incompleteDetails = completionStatus.details
            .filter(d => !d.isComplete)
            .map(d => {
              const title = d.moduleTitle || 'Unknown Module';
              const completed = d.completedChapters ?? 0;
              const total = d.totalChapters ?? 0;
              const percent = d.completionPercentage ?? 0;
              return `• ${title}: ${completed}/${total} chapters (${percent}%)`;
            })
            .join('\n');
          
          console.log('Incomplete modules details:', completionStatus.details.filter(d => !d.isComplete));
          
          alert(`Complete all learning modules before accessing the final submission form.\n\nIncomplete modules:\n${incompleteDetails || 'Unable to load module details'}`);
          router.push('/student/dashboard');
          return;
        }
      } catch (error) {
        console.error('Failed to check completion status:', error);
        // Fallback to old check
        const modulesProgress = profile?.modulesProgress || [];
        const hasModules = modulesProgress.length > 0;
        const allCompleted = hasModules && modulesProgress.every((m) => (m.completionPercentage || 0) >= 100);

        if (!allCompleted) {
          alert('Complete all learning modules before accessing the final submission form.');
          router.push('/student/dashboard');
          return;
        }
      }

      setEligible(true);

      // Load existing draft/submission if any
      try {
        const existingSubmission = await submission.get();
        if (existingSubmission) {
          if (existingSubmission.submissionStatus === 'submitted') {
            alert('You have already submitted your idea. You cannot edit the submission again.');
            router.push('/student/dashboard');
            return;
          }
          setFormData((prev) => ({ ...prev, ...existingSubmission }));
        }
      } catch (error) {
        // No existing submission, that's fine
      }
    } catch (error) {
      console.error('Failed to check access:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < 3) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', email: '', role: '' }]
      }));
    }
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > 1) {
      const newTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
    }
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      await submission.saveDraft(formData);
      alert('✅ Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('❌ Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.projectTitle) newErrors.projectTitle = 'Project title is required';
    if (!formData.primaryCategory) newErrors.primaryCategory = 'Primary category is required';
    if (!formData.elevatorPitch) newErrors.elevatorPitch = 'Elevator pitch is required';
    if (!formData.problemStatement) newErrors.problemStatement = 'Problem statement is required';
    if (!formData.solutionOverview) newErrors.solutionOverview = 'Solution overview is required';
    
    // Word limit validation
    if (formData.elevatorPitch && formData.elevatorPitch.split(' ').length > 100) {
      newErrors.elevatorPitch = 'Elevator pitch must be 100 words or less';
    }
    if (formData.problemStatement && formData.problemStatement.split(' ').length > 150) {
      newErrors.problemStatement = 'Problem statement must be 150 words or less';
    }
    if (formData.solutionOverview && formData.solutionOverview.split(' ').length > 200) {
      newErrors.solutionOverview = 'Solution overview must be 200 words or less';
    }
    if (formData.inspiration && formData.inspiration.split(' ').length > 50) {
      newErrors.inspiration = 'Inspiration must be 50 words or less';
    }
    
    // File validation
    if (!files.pdfFile) newErrors.pdfFile = 'PDF file is required';
    if (files.pdfFile && files.pdfFile.size > 10 * 1024 * 1024) {
      newErrors.pdfFile = 'PDF file must be less than 10MB';
    }
    if (files.videoFile && files.videoFile.size > 100 * 1024 * 1024) {
      newErrors.videoFile = 'Video file must be less than 100MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }
    
    setSubmitting(true);
    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'teamMembers' || key === 'biggestCosts') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add files
      if (files.pdfFile) submitData.append('pdfFile', files.pdfFile);
      if (files.videoFile) submitData.append('videoFile', files.videoFile);
      
      await submission.submit(submitData);
      alert('🎉 Idea submitted successfully!');
      router.push('/student/dashboard');
    } catch (error) {
      console.error('❌ Failed to submit idea:', error);
      console.error('Error details:', {
        message: error.message,
        error: error.error,
        status: error.response?.status,
        data: error.response?.data
      });
      alert('❌ Failed to submit idea: ' + (error.error || error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Participant Details
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">👥 Participant Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Team Members (max 3)</label>
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="border border-neutral-border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Team Member {index + 1}</h4>
                    {index > 0 && (
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-semantic-error hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                </div>
              ))}
              
              {formData.teamMembers.length < 3 && (
                <button
                  onClick={addTeamMember}
                  className="text-primary-red hover:text-primary-darkRed transition"
                >
                  + Add Team Member
                </button>
              )}
            </div>
          </div>
        );

      case 1: // Project Overview
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">🎯 Project Overview</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.projectTitle ? 'border-semantic-error' : 'border-neutral-border'}`}
                placeholder="Enter your project title"
              />
              {errors.projectTitle && <p className="text-semantic-error text-sm mt-1">{errors.projectTitle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Category *</label>
              <select
                value={formData.primaryCategory}
                onChange={(e) => handleInputChange('primaryCategory', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.primaryCategory ? 'border-semantic-error' : 'border-neutral-border'}`}
              >
                <option value="">Select a category</option>
                <option value="Sustainability & Climate Action">Sustainability & Climate Action</option>
                <option value="Technology & AI Innovation">Technology & AI Innovation</option>
                <option value="Social Impact & Equity">Social Impact & Equity</option>
                <option value="Health & Wellbeing">Health & Wellbeing</option>
                <option value="Education & Workforce Development">Education & Workforce Development</option>
              </select>
              {errors.primaryCategory && <p className="text-semantic-error text-sm mt-1">{errors.primaryCategory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Category (Optional)</label>
              <select
                value={formData.secondaryCategory}
                onChange={(e) => handleInputChange('secondaryCategory', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
              >
                <option value="">Select a secondary category</option>
                <option value="Sustainability & Climate Action">Sustainability & Climate Action</option>
                <option value="Technology & AI Innovation">Technology & AI Innovation</option>
                <option value="Social Impact & Equity">Social Impact & Equity</option>
                <option value="Health & Wellbeing">Health & Wellbeing</option>
                <option value="Education & Workforce Development">Education & Workforce Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Elevator Pitch * (Max 100 words)
                <span className="text-neutral-medium ml-2">
                  {formData.elevatorPitch ? formData.elevatorPitch.split(' ').length : 0}/100 words
                </span>
              </label>
              <textarea
                value={formData.elevatorPitch}
                onChange={(e) => handleInputChange('elevatorPitch', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg h-24 ${errors.elevatorPitch ? 'border-semantic-error' : 'border-neutral-border'}`}
                placeholder="Describe your project in a compelling elevator pitch"
              />
              {errors.elevatorPitch && <p className="text-semantic-error text-sm mt-1">{errors.elevatorPitch}</p>}
            </div>
          </div>
        );

      case 2: // Problem Statement
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">❓ Problem Statement</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                What problem are you solving? * (Max 150 words)
                <span className="text-neutral-medium ml-2">
                  {formData.problemStatement ? formData.problemStatement.split(' ').length : 0}/150 words
                </span>
              </label>
              <textarea
                value={formData.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg h-32 ${errors.problemStatement ? 'border-semantic-error' : 'border-neutral-border'}`}
                placeholder="Clearly describe the problem you're addressing"
              />
              {errors.problemStatement && <p className="text-semantic-error text-sm mt-1">{errors.problemStatement}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Existing Solutions & Gaps</label>
              <textarea
                value={formData.existingSolutions}
                onChange={(e) => handleInputChange('existingSolutions', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="What solutions already exist and what gaps do they have?"
              />
            </div>
          </div>
        );

      case 3: // Solution Overview
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">💡 Solution Overview</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Innovation * (Max 200 words)
                <span className="text-neutral-medium ml-2">
                  {formData.solutionOverview ? formData.solutionOverview.split(' ').length : 0}/200 words
                </span>
              </label>
              <textarea
                value={formData.solutionOverview}
                onChange={(e) => handleInputChange('solutionOverview', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg h-32 ${errors.solutionOverview ? 'border-semantic-error' : 'border-neutral-border'}`}
                placeholder="Describe your innovative solution"
              />
              {errors.solutionOverview && <p className="text-semantic-error text-sm mt-1">{errors.solutionOverview}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prototype / Proof of Concept (If Applicable)</label>
              <textarea
                value={formData.prototypeDescription}
                onChange={(e) => handleInputChange('prototypeDescription', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Describe any prototypes or proof of concept you've developed"
              />
            </div>
          </div>
        );

      // Market & Impact
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">🌍 Market & Impact</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Who are your target users or beneficiaries?</label>
              <textarea
                value={formData.userTypes}
                onChange={(e) => handleInputChange('userTypes', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Describe the groups of people or organizations that will benefit from your solution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">How will you reach them?</label>
              <textarea
                value={formData.reachStrategy}
                onChange={(e) => handleInputChange('reachStrategy', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Channels, strategies, or partnerships you will use to reach your users"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What impact do you want to create?</label>
              <textarea
                value={formData.impactDescription}
                onChange={(e) => handleInputChange('impactDescription', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Explain the positive change your project will create in people’s lives or society"
              />
            </div>
          </div>
        );

      // Business Model
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">💰 Business Model</h3>

            <div>
              <label className="block text-sm font-medium mb-2">How will this project sustain itself financially?</label>
              <textarea
                value={formData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Explain how you will cover costs or generate revenue (if applicable)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What are your two biggest costs?</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.biggestCosts[0]}
                  onChange={(e) =>
                    handleInputChange('biggestCosts', [e.target.value, formData.biggestCosts[1]])
                  }
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                  placeholder="Biggest cost #1"
                />
                <input
                  type="text"
                  value={formData.biggestCosts[1]}
                  onChange={(e) =>
                    handleInputChange('biggestCosts', [formData.biggestCosts[0], e.target.value])
                  }
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                  placeholder="Biggest cost #2"
                />
              </div>
            </div>
          </div>
        );

      // Think Like a Titan
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">🧠 Think Like a Titan</h3>

            <div>
              <label className="block text-sm font-medium mb-2">What skills or strengths does your team have?</label>
              <textarea
                value={formData.teamSkills}
                onChange={(e) => handleInputChange('teamSkills', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Describe your team’s skills (technical, creative, leadership, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What do you want to learn or improve through this challenge?</label>
              <textarea
                value={formData.wantToLearn}
                onChange={(e) => handleInputChange('wantToLearn', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Be honest about areas you want to grow in as an innovator or entrepreneur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">If selected, how will you improve your idea or pitch?</label>
              <textarea
                value={formData.improvementPlan}
                onChange={(e) => handleInputChange('improvementPlan', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Describe concrete steps you would take to strengthen your project and presentation"
              />
            </div>
          </div>
        );

      // Impact & Feasibility
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">📊 Impact & Feasibility</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Short-term outcomes (next 6–12 months)</label>
              <textarea
                value={formData.expectedShortTermOutcomes}
                onChange={(e) => handleInputChange('expectedShortTermOutcomes', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="What realistic outcomes do you expect in the first phase of your project?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Long-term vision (3–5 years)</label>
              <textarea
                value={formData.longTermVision}
                onChange={(e) => handleInputChange('longTermVision', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="If your idea succeeds, what does the future look like?"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key success metrics</label>
                <textarea
                  value={formData.successMetrics}
                  onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                  placeholder="How will you measure success? (users, impact, revenue, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resources needed</label>
                <textarea
                  value={formData.resourcesNeeded}
                  onChange={(e) => handleInputChange('resourcesNeeded', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                  placeholder="People, tools, funding, or support you’ll need"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Implementation timeline</label>
              <textarea
                value={formData.implementationTimeline}
                onChange={(e) => handleInputChange('implementationTimeline', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Rough timeline or phases for implementing your idea"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Risks and how you’ll handle them</label>
              <textarea
                value={formData.risks}
                onChange={(e) => handleInputChange('risks', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="What could go wrong, and how would you respond?"
              />
            </div>
          </div>
        );

      // Target Audience & Stakeholders
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">🎯 Target Audience & Stakeholders</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Primary beneficiaries</label>
              <textarea
                value={formData.primaryBeneficiaries}
                onChange={(e) => handleInputChange('primaryBeneficiaries', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Who benefits most directly from your solution?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key stakeholders (supporters, partners, etc.)</label>
              <textarea
                value={formData.keyStakeholders}
                onChange={(e) => handleInputChange('keyStakeholders', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Who else is involved or affected (schools, NGOs, companies, communities)?"
              />
            </div>
          </div>
        );

      // Sustainability & Ethics
      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">♻️ Sustainability & Ethics</h3>

            <div>
              <label className="block text-sm font-medium mb-2">How is your solution socially or environmentally sustainable?</label>
              <textarea
                value={formData.sustainability}
                onChange={(e) => handleInputChange('sustainability', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Explain how your idea supports people or planet in the long term"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ethical considerations</label>
              <textarea
                value={formData.ethicalConsiderations}
                onChange={(e) => handleInputChange('ethicalConsiderations', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Any risks around fairness, privacy, bias, or unintended harm? How will you address them?"
              />
            </div>
          </div>
        );

      // Additional Info
      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">📝 Additional Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                What inspired this idea? (Max 50 words)
                <span className="text-neutral-medium ml-2">
                  {formData.inspiration ? formData.inspiration.split(' ').length : 0}/50 words
                </span>
              </label>
              <textarea
                value={formData.inspiration}
                onChange={(e) => handleInputChange('inspiration', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg h-24 ${
                  errors.inspiration ? 'border-semantic-error' : 'border-neutral-border'
                }`}
                placeholder="A short story or moment that sparked this project"
              />
              {errors.inspiration && (
                <p className="text-semantic-error text-sm mt-1">{errors.inspiration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Previous work or supporting information (optional)</label>
              <textarea
                value={formData.previousWork}
                onChange={(e) => handleInputChange('previousWork', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Mention any earlier prototypes, experiments, or related work"
              />
            </div>
          </div>
        );

      case 11: // File Uploads
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">📎 File Uploads</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                PDF Document * (Max 5 pages, 10MB)
              </label>
              <div className="border-2 border-dashed border-neutral-border rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-neutral-medium mx-auto mb-4" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('pdfFile', e.target.files[0])}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition cursor-pointer inline-block"
                >
                  Choose PDF File
                </label>
                {files.pdfFile && (
                  <p className="mt-2 text-sm text-neutral-dark">
                    Selected: {files.pdfFile.name} ({(files.pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {errors.pdfFile && <p className="text-semantic-error text-sm mt-1">{errors.pdfFile}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Video Pitch (Optional, Max 100MB)
              </label>
              <div className="border-2 border-dashed border-neutral-border rounded-lg p-6 text-center">
                <Video className="w-12 h-12 text-neutral-medium mx-auto mb-4" />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange('videoFile', e.target.files[0])}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="bg-accent-gold text-white px-6 py-2 rounded-lg hover:bg-accent-amber transition cursor-pointer inline-block"
                >
                  Choose Video File
                </label>
                {files.videoFile && (
                  <p className="mt-2 text-sm text-neutral-dark">
                    Selected: {files.videoFile.name} ({(files.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {errors.videoFile && <p className="text-semantic-error text-sm mt-1">{errors.videoFile}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-neutral-medium">Section under development</p>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading submission form..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-white-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Idea Submission</h1>
              <p className="text-neutral-medium">Submit your innovation for the Future Titans Challenge</p>
            </div>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="text-primary-red hover:text-primary-darkRed transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container-lg py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80">
            <div className="card sticky top-8">
              <h3 className="font-bold mb-4">📋 Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-3 ${
                      currentSection === section.id
                        ? 'bg-primary-red text-white'
                        : 'hover:bg-neutral-light'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-neutral-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-medium">Progress</span>
                  <span className="text-sm font-semibold">
                    {Math.round(((currentSection + 1) / sections.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-2">
                  <div
                    className="bg-gradient-red-gold h-2 rounded-full transition-all"
                    style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="card">
              {renderSection()}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-neutral-border mt-8">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-2 bg-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-border transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={saveDraft}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-border transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>

                  {currentSection < sections.length - 1 ? (
                    <button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-darkRed transition"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2 bg-semantic-success text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Submit Idea'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
