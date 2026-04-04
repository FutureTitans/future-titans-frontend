'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, Settings, Users, School, Key, Activity, FileText, Download, Target, PlayCircle, Loader2, ArrowUpRight, Copy, CheckCircle2, ThumbsUp, ThumbsDown, Search, Medal, Shield
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper for the gauge chart (Semi-circle gradient)
const SemiCircleGauge = ({ value }) => {
  const rotation = (value / 100) * 180;
  return (
    <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center">
      <div 
        className="absolute bottom-0 w-24 h-24 rounded-full border-[10px] border-gray-200"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
      ></div>
      <div 
        className="absolute bottom-0 w-24 h-24 rounded-full border-[10px] border-t-transparent border-r-transparent border-l-[#1E293B] border-b-[#1E293B] transition-transform duration-1000 ease-out"
        style={{ transform: `rotate(${rotation - 45}deg)`, transformOrigin: 'center' }}
      ></div>
      <div className="absolute bottom-1 w-2 h-2 rounded-full bg-red-500"></div>
    </div>
  );
};

export default function AssociationDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Key code generation state
  const [schoolNameInput, setSchoolNameInput] = useState('');
  const [schoolEmailInput, setSchoolEmailInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Places Autocomplete State
  const [googlePlaceIdInput, setGooglePlaceIdInput] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce Autocomplete fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (schoolNameInput && showSuggestions && !googlePlaceIdInput) {
        fetchPlacesSuggestions(schoolNameInput);
      } else {
        setPlaceSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [schoolNameInput, showSuggestions, googlePlaceIdInput]);

  const fetchPlacesSuggestions = async (input) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/association/places/autocomplete?input=${encodeURIComponent(input)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPlaceSuggestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Availability Check State
  const [checkingSchool, setCheckingSchool] = useState(false);
  const [schoolCheckError, setSchoolCheckError] = useState(null);

  const checkSchoolAvailability = async (placeId, name) => {
    setCheckingSchool(true);
    setSchoolCheckError(null);
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/association/school/check?placeId=${placeId || ''}&name=${encodeURIComponent(name || '')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.available) {
        setSchoolCheckError(data.error);
      }
    } catch (e) {
      console.error(e);
      setSchoolCheckError('Unable to check school availability.');
    } finally {
      setCheckingSchool(false);
    }
  };

  // Proof Upload State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const openUploadModal = (id) => {
    setSelectedSchoolId(id);
    setUploadModalOpen(true);
    setProofUrlInput('');
  };

  const submitProof = async () => {
    if (!proofUrlInput) return alert('Please enter a proof document URL.');
    setUploading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/association/school/upload-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ schoolId: selectedSchoolId, proofUrl: proofUrlInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload proof');
      
      alert('Proof of acceptance uploaded successfully! Pending admin approval.');
      setUploadModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/association/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          removeAuthToken();
          router.push('/login');
          return;
        }
        throw new Error('Failed to load dashboard data');
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  const generateSchoolCode = async () => {
    if (!schoolNameInput || !schoolEmailInput) {
      alert("Please provide both School Name and Contact Email.");
      return;
    }
    setGenerating(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/association/school`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: schoolNameInput, email: schoolEmailInput, googlePlaceId: googlePlaceIdInput })
      });
      const data = await res.json();

      if (!res.ok) {
         if (data.daysLeft) {
            throw new Error(data.error);
         }
         throw new Error(data.error || 'Failed to generate code');
      }
      
      setGeneratedCode(data.keyCode);
      setGeneratedSlug(data.slug);
      setSchoolNameInput('');
      setSchoolEmailInput('');
      setGooglePlaceIdInput('');
      setShowSuggestions(false);
      setTimeout(() => fetchDashboardData(), 1000); // refresh the school list
    } catch (err) {
      setSchoolCheckError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/signup?school=${generatedSlug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadReport = (name) => {
    if (!stats) return;
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    
    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(26, 26, 26);
    doc.text(name, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${dateStr}`, 14, 30);
    doc.text(`Association: ${stats.associationName || 'Admin'}`, 14, 35);

    if (name === 'Full Association' || name === 'All Registered Schools Detail Report') {
        doc.autoTable({
            startY: 45,
            head: [['School Name', 'POC Email', 'Registered', 'Students', 'Paid', 'SSI Score']],
            body: (stats.schoolDetails || []).map(s => [
                s.schoolName,
                s.pocEmail,
                new Date(s.registeredDate).toLocaleDateString(),
                s.totalStudents,
                s.paidStudents,
                s.ssiScore
            ]),
            headStyles: { fillColor: [212, 175, 55] }
        });
    } else if (name === 'Student Registration Status Report') {
        doc.autoTable({
            startY: 45,
            head: [['School Name', 'Total Students', 'Paid Students', 'Unpaid Students', 'Registration Date']],
            body: (stats.schoolDetails || []).map(s => [
                s.schoolName,
                s.totalStudents,
                s.paidStudents,
                s.totalStudents - s.paidStudents,
                new Date(s.registeredDate).toLocaleDateString()
            ]),
            headStyles: { fillColor: [23, 92, 54] }
        });
    } else if (name === 'Multi-School SSI Performance') {
        doc.autoTable({
            startY: 45,
            head: [['School Name', 'Total Students', 'Average SSI Score', 'Completion %']],
            body: (stats.schoolDetails || []).map(s => [
                s.schoolName,
                s.totalStudents,
                s.ssiScore || '0',
                stats.avgCompletionRate + '%' // fallback to association avg if school specific isn't available
            ]),
            headStyles: { fillColor: [30, 41, 59] }
        });
    }

    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Future Titans Association Portal - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`${name.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => router.push('/login')} className="px-4 py-2 bg-neutral-dark text-white rounded-lg">Return to Login</button>
      </div>
    );
  }

  // Filter school details by search
  const filteredSchools = stats?.schoolDetails?.filter(s => 
    s.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.pocEmail.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#FDF9EE] font-sans selection:bg-[#D4AF37]/30 text-[#1A1A1A]">
      {/* Top Header Navbar */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-[#D4AF37]/20 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F5EDD6] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight filter drop-shadow-sm">Association of Registered Schools</h1>
            <p className="text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1A1A1A]">{stats?.associationName || 'Admin'}</p>
              <p className="text-xs text-neutral-500">Association Director</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E5D5A5] border-2 border-white shadow overflow-hidden">
              {stats?.profilePicture ? (
                <img src={stats.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 m-auto text-white mt-1" />
              )}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5 mx-0 my-0 mt-0 mb-0" style={{ transform: 'none' }} />
          </button>
        </div>
      </header>

      <div className="flex w-full p-6 pt-8 gap-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 flex flex-col gap-6 shrink-0">
          
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 text-center border border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border-[4px] border-[#FFFBF0] shadow-xl overflow-hidden mb-4 relative z-10">
              {stats?.profilePicture ? (
                <img src={stats.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-10 h-10 m-auto text-[#D4AF37] mt-4" />
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight">{stats?.associationName || 'Director'}</h2>
            <p className="text-sm text-[#D4AF37] font-semibold mt-1">Association Director</p>
          </div>

          {/* Average Schools Registered Per Month */}
          <div className="bg-gradient-to-br from-white to-[#FDF9EE] rounded-[2rem] p-6 border border-[#D4AF37]/20 shadow-lg">
            <h3 className="text-sm font-semibold text-neutral-600 mb-2 leading-snug">Average Schools<br/>Registered Per Month</h3>
            <div className="text-3xl font-black text-[#1A1A1A] mb-4 tracking-tighter">{stats?.averageSchoolsPerMonth} <span className="text-lg font-bold text-neutral-400">/ mo</span></div>
            <div className="h-16 w-full -ml-2 filter drop-shadow-md">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.chartData || []}>
                  <Line type="monotone" dataKey="schools" stroke="#1A1A1A" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37', strokeWidth: 2, stroke: '#FFF' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
              <span>{stats?.chartData?.[0]?.label || 'JAN'}</span>
              <span>{stats?.chartData?.[Math.floor(stats?.chartData?.length / 2)]?.label || 'JUN'}</span>
              <span>{stats?.chartData?.[stats?.chartData?.length - 1]?.label || 'DEC'}</span>
            </div>
          </div>

          {/* Total Students Registered */}
          <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 border border-[#D4AF37]/20 shadow-lg flex justify-between items-center group hover:bg-[#D4AF37]/5 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-neutral-600 mb-1 leading-snug">Total Students<br/>Registered</h3>
              <div className="text-3xl font-black text-[#1A1A1A] tracking-tighter">{stats?.totalStudents?.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-all shadow-inner">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Total Schools Registered */}
          <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 border border-[#D4AF37]/20 shadow-lg flex justify-between items-center group hover:bg-[#D4AF37]/5 transition-colors">
            <div>
              <h3 className="text-sm font-semibold text-neutral-600 mb-1 leading-snug">Total Schools<br/>Registered</h3>
              <div className="text-3xl font-black text-[#1A1A1A] tracking-tighter">{stats?.totalSchools?.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-all shadow-inner">
              <School className="w-6 h-6" />
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* Top Banner & Main Metrics */}
          <div className="flex gap-6 h-[120px]">
            {/* Banner Logo Title */}
            <div className="flex-1 bg-gradient-to-r from-white to-[#FAEDCD] rounded-[2rem] border border-[#D4AF37]/30 shadow-xl flex items-center p-8 gap-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#D4AF37]/5 backdrop-blur-3xl saturate-150"></div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border-2 border-[#D4AF37]/20 flex items-center justify-center relative z-10">
                 <Shield className="w-10 h-10 text-[#1A1A1A]" />
              </div>
              <h2 className="text-3xl font-black text-[#1A1A1A] leading-tight relative z-10 tracking-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                Association of<br/>Registered Schools
              </h2>
            </div>

            {/* Aggregated Completion Rate */}
            <div className="w-64 bg-white/90 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5"><Target className="w-32 h-32" /></div>
              <div className="flex justify-between items-start z-10">
                <h3 className="text-sm font-bold text-neutral-700 leading-tight">Aggregated<br/>Completion Rate</h3>
                <div className="bg-neutral-100 p-1.5 rounded-lg"><Target className="w-4 h-4 text-[#D4AF37]" /></div>
              </div>
              <div className="flex items-end justify-between mt-3 z-10 relative">
                <span className="text-4xl font-black tracking-tighter">{stats?.avgCompletionRate}%</span>
                <div className="opacity-80 drop-shadow-sm scale-90 origin-bottom-right absolute right-0 bottom-0"><SemiCircleGauge value={stats?.avgCompletionRate} /></div>
              </div>
            </div>

            {/* Aggregated Avg SSI Score */}
            <div className="w-64 bg-white/90 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-5"><Medal className="w-32 h-32" /></div>
               <div className="flex justify-between items-start z-10">
                <h3 className="text-sm font-bold text-neutral-700 leading-tight">Aggregated<br/>Avg. SSI Score</h3>
                <div className="bg-neutral-100 p-1.5 rounded-lg"><Medal className="w-4 h-4 text-[#D4AF37]" /></div>
              </div>
              <div className="flex items-end justify-between mt-3 z-10">
                <span className="text-4xl font-black tracking-tighter">{stats?.avgSSIScore}</span>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#EAC15A] to-[#C79A2B] shadow-lg border-[3px] border-white flex items-center justify-center text-white m-1 relative transform rotate-[10deg]">
                   <Medal className="w-7 h-7 filter drop-shadow-md" />
                   {/* Ribbons */}
                   <div className="absolute -bottom-2 -left-1 w-3 h-5 bg-[#A88020] -rotate-12 rounded-sm clip-ribbon"></div>
                   <div className="absolute -bottom-2 -right-1 w-3 h-5 bg-[#A88020] rotate-12 rounded-sm clip-ribbon"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row (Widgets) */}
          <div className="flex gap-6 min-h-[190px] relative z-50">
            
            {/* School Key Code Generator */}
            <div className="flex-1 bg-white/80 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EAC15A] to-[#C79A2B] flex items-center justify-center text-white shadow"><Key className="w-4 h-4" /></div>
                <h3 className="font-bold text-[#1A1A1A] text-lg tracking-tight">School Key Code Generator</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
                <div className="flex flex-col gap-3 justify-end relative">
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="School Name" 
                      value={schoolNameInput}
                      onChange={(e) => {
                        setSchoolNameInput(e.target.value);
                        setGooglePlaceIdInput('');
                        setShowSuggestions(true);
                        setSchoolCheckError(null);
                      }}
                      className="w-full bg-[#FAEDCD]/50 border border-[#EAC15A]/40 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                    {showSuggestions && placeSuggestions.length > 0 && (
                      <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-[#D4AF37]/20 rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="max-h-52 overflow-y-auto custom-scrollbar">
                          {placeSuggestions.map(place => (
                            <div 
                              key={place.placeId} 
                              onClick={() => {
                                setSchoolNameInput(place.name);
                                setGooglePlaceIdInput(place.placeId);
                                setShowSuggestions(false);
                                checkSchoolAvailability(place.placeId, place.name);
                              }}
                              className="px-4 py-3 hover:bg-[#FAEDCD]/50 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                              <p className="text-sm font-bold text-[#1A1A1A] truncate">{place.name}</p>
                              <p className="text-[10px] font-semibold text-neutral-500 truncate">{place.description}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Powered by Google</span>
                          <button onClick={() => setShowSuggestions(false)} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition">Close</button>
                        </div>
                      </div>
                    )}
                  </div>
                  {schoolCheckError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] px-3 py-2 rounded-xl flex items-start gap-2 shadow-sm relative z-10 w-[120%]">
                      <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                      <p className="font-medium whitespace-normal">{schoolCheckError}</p>
                    </div>
                  )}
                  {schoolNameInput.length > 0 && !googlePlaceIdInput && !schoolCheckError && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[11px] px-3 py-2 rounded-xl flex items-start gap-2 shadow-sm relative z-10 w-[100%]">
                      <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      <p className="font-medium whitespace-normal">Please select your school directly from the Google dropdown list to proceed.</p>
                    </div>
                  )}
                  <input 
                    type="email" 
                    placeholder="School Admin Email (POC)" 
                    value={schoolEmailInput}
                    onChange={(e) => setSchoolEmailInput(e.target.value)}
                    className="w-full bg-[#FAEDCD]/50 border border-[#EAC15A]/40 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-3 justify-end w-full">
                   <div className="flex w-full h-[42px] items-center text-[11px] font-bold bg-[#FAEDCD] text-[#A88020] px-3 rounded-xl border border-[#D4AF37]/20 justify-between overflow-hidden shadow-inner">
                      <span className="truncate flex-1 mr-2 opacity-80">POC Pass: {generatedCode || 'None'}</span>
                      {generatedCode && (
                        <button onClick={copyCode} className="text-[#A88020] hover:text-[#1A1A1A] transition bg-white/50 px-2 py-1 rounded shadow-sm flex items-center gap-1 font-bold shrink-0">
                           {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                           {copied ? 'Copied' : 'Copy'}
                        </button>
                      )}
                   </div>
                   <div className="flex w-full h-[42px] items-center text-[11px] font-bold bg-[#E6F4EA] text-[#175C36] px-3 rounded-xl border border-[#175C36]/20 justify-between overflow-hidden shadow-inner">
                      <span className="truncate flex-1 mr-2 opacity-80">Student Link: {generatedSlug || 'None'}</span>
                      {generatedSlug && (
                        <button onClick={copyLink} className="text-[#175C36] hover:text-[#0A2F1A] transition bg-white/50 px-2 py-1 rounded shadow-sm flex items-center gap-1 font-bold shrink-0">
                           {copiedLink ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                           {copiedLink ? 'Copied' : 'Copy'}
                        </button>
                      )}
                   </div>
                   <button 
                    onClick={generateSchoolCode}
                    disabled={generating || schoolCheckError || checkingSchool || !googlePlaceIdInput || !schoolEmailInput}
                    className="w-full h-[42px] bg-gradient-to-r from-[#175C36] to-[#0F4225] hover:from-[#0F4225] hover:to-[#0A2F1A] text-white font-bold py-2 rounded-xl text-sm border border-[#175C36]/50 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating || checkingSchool ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate New Key Code'}
                  </button>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-neutral-400 mt-3 uppercase tracking-wide">Codes valid for 30 days.</p>
            </div>

            {/* All Student Status (Live) */}
            <div className="w-[280px] bg-white/80 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-neutral-200 rotate-12"><Activity className="w-20 h-20 opacity-30" /></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4AF37] shadow-sm"><Activity className="w-4 h-4" /></div>
                <h3 className="font-bold text-[#1A1A1A] tracking-tight">All Student Status <span className="text-neutral-400 text-xs font-semibold">(Live)</span></h3>
              </div>
              
              <div className="mt-4 space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 shadow-inner">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#1A1A1A]"></div>
                     <span className="text-sm font-bold text-neutral-700">Registered:</span>
                   </div>
                   <span className="text-sm font-black text-[#1A1A1A]">{stats?.studentStatus?.registered?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 shadow-inner">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                     <span className="text-sm font-bold text-neutral-700">Online Now:</span>
                   </div>
                   <span className="text-sm font-black text-[#1A1A1A]">{stats?.studentStatus?.online?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Idea Submission Status */}
            <div className="w-[300px] bg-white/80 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 relative flex flex-col justify-between">
               <div className="absolute top-4 right-4 w-12 h-12 bg-gray-100 rounded-xl rotate-12 border border-gray-200 shadow-sm flex items-center justify-center opacity-40"><FileText className="w-6 h-6 text-gray-400" /></div>
               <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4AF37] shadow-sm"><FileText className="w-4 h-4" /></div>
                <h3 className="font-bold text-[#1A1A1A] tracking-tight">Idea Submission Status</h3>
              </div>
              
              <div className="mt-4 space-y-3 relative z-10">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Submitted: <span className="text-[#1A1A1A]">{stats?.ideaStatus?.submitted?.toLocaleString()}</span>
                    </div>
                    {/* Removed Dummy Sparkline */}
                    <div className="w-20 h-6">
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37]/30 flex items-center justify-center"><div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div></div>
                      Pending: <span className="text-[#1A1A1A]">{stats?.ideaStatus?.offline?.toLocaleString()}</span>
                    </div>
                    {/* Removed Dummy Sparkline */}
                    <div className="w-20 h-6">
                    </div>
                 </div>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="flex gap-6 flex-1 min-h-[400px]">
             
             {/* Left: Detailed Multi-School List */}
             <div className="flex-1 bg-white/80 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 flex flex-col">
                <div className="flex justify-between items-end mb-6">
                   <h3 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Multi-School Student Register <span className="text-sm text-neutral-400 font-semibold">(Detailed)</span></h3>
                   <div className="relative w-64">
                     <input 
                      type="text" 
                      placeholder="Search schools..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2 text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                     <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-neutral-400" />
                   </div>
                </div>

                <div className="flex-1 overflow-auto rounded-xl border border-gray-100 shadow-inner bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAEDCD]/30 sticky top-0 z-10 text-xs font-black text-neutral-500 tracking-wider">
                      <tr>
                        <th className="px-6 py-4 uppercase border-b border-[#D4AF37]/20">School</th>
                        <th className="px-6 py-4 uppercase border-b border-[#D4AF37]/20">Registered</th>
                        <th className="px-6 py-4 uppercase border-b border-[#D4AF37]/20">No. Students Registered</th>
                        <th className="px-6 py-4 uppercase border-b border-[#D4AF37]/20">SSI Score</th>
                        <th className="px-6 py-4 uppercase border-b border-[#D4AF37]/20 text-right">Approval Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                      {filteredSchools.map((school, i) => (
                        <tr key={i} className="hover:bg-[#FDF9EE] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <School className="w-5 h-5 text-[#A88020] opacity-70 group-hover:opacity-100 transition" />
                              <div>
                                <p className="font-bold text-sm text-[#1A1A1A] leading-tight">{school.schoolName}</p>
                                <p className="text-[10px] font-semibold text-neutral-500 truncate w-32">{school.pocEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-neutral-600">
                             {new Date(school.registeredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-[#1A1A1A] pl-16">
                             {school.totalStudents}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-sm font-black text-[#1A1A1A]">
                               <Medal className="w-4 h-4 text-[#D4AF37]" /> {school.ssiScore}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             {school.approvalStatus === 'PendingProof' && (
                                <button onClick={() => openUploadModal(school.id)} className="text-xs bg-[#D4AF37] hover:bg-[#A88020] transition text-white px-3 py-1.5 rounded-lg shadow-sm font-bold">Upload Proof</button>
                             )}
                             {school.approvalStatus === 'PendingApproval' && (
                                <span className="text-xs text-yellow-700 font-bold bg-yellow-100 border border-yellow-200 px-3 py-1.5 rounded-lg shadow-inner">Reviewing</span>
                             )}
                             {school.approvalStatus === 'Rejected' && (
                                <button onClick={() => openUploadModal(school.id)} className="text-xs bg-red-500 hover:bg-red-600 transition text-white px-3 py-1.5 rounded-lg shadow-sm font-bold">Rejected - Retry</button>
                             )}
                             {school.approvalStatus === 'Approved' && (
                                <span className="text-xs text-green-800 font-bold bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg shadow-inner">Approved</span>
                             )}
                          </td>
                        </tr>
                      ))}
                      {filteredSchools.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-neutral-400 font-semibold text-sm">
                            No schools registered or match search yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>

             {/* Right: Detailed School Reports */}
             <div className="w-[360px] bg-white/80 backdrop-blur rounded-[2rem] border border-[#D4AF37]/20 shadow-lg p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#FAEDCD] rounded-2xl flex items-center justify-center text-[#D4AF37] mb-3 shadow"><FileText className="w-6 h-6" /></div>
                <h3 className="font-bold text-[#1A1A1A] text-xl tracking-tight leading-tight">Detailed School Reports</h3>
                <p className="text-xs font-semibold text-neutral-500 mt-2 tracking-wide leading-snug">Generate and Download School<br/>and Student Reports</p>
                
                <button 
                  onClick={() => downloadReport('Full Association')}
                  className="mt-6 w-full bg-gradient-to-r from-[#175C36] to-[#0F4225] hover:from-[#0F4225] hover:to-[#0A2F1A] text-white font-bold py-3.5 rounded-xl text-sm border border-[#175C36]/50 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Generate Full Association Report (PDF) <FileText className="w-4 h-4 text-white/80" />
                </button>

                <div className="mt-8 w-full flex-1">
                   <div className="flex justify-between text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-2 px-2">
                     <span className="flex-1 text-left">Report Name</span>
                     <span className="w-24 text-center">Date Generated</span>
                     <span className="w-16 text-right">Download</span>
                   </div>
                   
                   <div className="space-y-2">
                     {[
                       { name: 'All Registered Schools Detail Report', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                       { name: 'Student Registration Status Report', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                       { name: 'Multi-School SSI Performance', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                     ].map((doc, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-neutral-50/50 hover:bg-[#FAEDCD]/30 transition-colors p-3 rounded-xl border border-neutral-100 group shadow-sm">
                          <span className="flex-1 text-left text-xs font-bold text-[#1A1A1A] leading-tight pr-2">{doc.name} (PDF)</span>
                          <span className="w-24 text-center text-[10px] font-bold text-neutral-500">{doc.date}</span>
                          <span className="w-10 text-right flex justify-end">
                            <button onClick={() => downloadReport(doc.name)} className="text-[#A88020] hover:text-[#1A1A1A] transition bg-white p-1.5 rounded-md shadow border border-[#D4AF37]/20">
                              <Download className="w-4 h-4" />
                            </button>
                          </span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="mt-6 w-full pt-4 border-t border-[#D4AF37]/20 flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Total Earnings</span>
                  <span className="text-xl font-black text-green-700 tracking-tighter">₹ {stats?.earnings?.toLocaleString()}</span>
                </div>
             </div>

          </div>

        </main>
      </div>

      {/* Upload Proof Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative border border-[#D4AF37]/20 flex flex-col gap-6">
            <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Upload Proof of Acceptance</h3>
            <p className="text-sm font-semibold text-neutral-500 leading-relaxed -mt-2">
              Please provide a Google Drive / OneDrive URL or an image link containing the written acceptance from the school administration. Our admins will review this to finalize the school allocation.
            </p>
            
            <div className="flex flex-col gap-4 w-full">
               <input 
                 type="text" 
                 placeholder="https://..." 
                 value={proofUrlInput}
                 onChange={(e) => setProofUrlInput(e.target.value)}
                 className="w-full bg-[#FAEDCD]/30 border border-[#EAC15A]/40 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
               />

               <div className="flex gap-4 w-full mt-2">
                  <button 
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-xl transition shadow-sm text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitProof}
                    disabled={uploading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#175C36] to-[#0F4225] hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition flex w-full items-center justify-center text-sm"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Proof'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .clip-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(212, 175, 55, 0.3);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
