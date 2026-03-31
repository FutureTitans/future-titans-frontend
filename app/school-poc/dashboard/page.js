'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { schoolPoc } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
    School, LogOut, Search, ChevronDown, ChevronUp, MapPin, Phone, Mail, Award, MonitorPlay, X, ThumbsUp, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SchoolPocDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [pocUser, setPocUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('registeredAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'registered', 'unregistered', 'online', 'offline', 'submitted', 'pending'

    useEffect(() => {
        const token = getAuthToken();
        const storedUser = localStorage.getItem('schoolPocUser');

        if (!token || !storedUser) {
            router.push('/school-poc/login');
            return;
        }

        try {
            setPocUser(JSON.parse(storedUser));
        } catch {
            router.push('/school-poc/login');
            return;
        }

        fetchDashboard();
    }, [router]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const data = await schoolPoc.getDashboard();
            setDashboardData(data);
        } catch (err) {
            setError(err?.error || 'Failed to load dashboard');
            if (err?.error?.includes('token') || err?.error?.includes('expired')) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeAuthToken();
        localStorage.removeItem('schoolPocUser');
        router.push('/school-poc/login');
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleFilterToggle = (filterName) => {
        setStatusFilter(prev => prev === filterName ? 'all' : filterName);
    };

    const filteredStudents = dashboardData?.students
        ?.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesFilter = true;
            if (statusFilter === 'registered') matchesFilter = student.isPaid;
            if (statusFilter === 'unregistered') matchesFilter = !student.isPaid;
            if (statusFilter === 'online') matchesFilter = student.isOnline;
            if (statusFilter === 'offline') matchesFilter = !student.isOnline;
            if (statusFilter === 'submitted') matchesFilter = student.ideaSubmissionStatus === 'submitted';
            if (statusFilter === 'pending') matchesFilter = student.ideaSubmissionStatus !== 'submitted';

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'registeredAt') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        }) || [];

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5EDD6]">
                <div className="glass-panel p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4 flex justify-center"><AlertCircle className="w-16 h-16" /></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="glass-button px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white font-bold transition shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const unRegisteredCount = dashboardData?.stats?.totalStudents - dashboardData?.stats?.paidStudents;

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F5EDD6] text-gray-800 font-sans pb-12">
            {/* Background blobs for warm cream glassmorphism directly matching student dashboard */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden pb-12">
                <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/60 rounded-full filter blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full filter blur-[100px]"></div>
            </div>

            {/* Header - Glassmorphic matching Student Dashboard Style */}
            <div className="relative z-40 bg-white/40 backdrop-blur-md border-b border-white/50 shadow-sm">
                <div className="w-full max-w-[1920px] mx-auto py-4 flex items-center justify-between px-4 sm:px-8 xl:px-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 border border-white/50">
                            <School className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-900 tracking-wide">{dashboardData?.school?.name || 'School POC Dashboard'}</h1>
                            <p className="text-sm text-gray-600 font-medium">Administration Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <span className="text-sm font-semibold text-gray-600 block">Welcome, <span className="text-gray-900">{pocUser?.name}</span></span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-500 hover:bg-white/50 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${pocUser?.name}&backgroundColor=F5D76E&textColor=1a1a1a`} alt="Avatar" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-8 xl:px-12 py-4 sm:py-6 md:py-8 relative z-10 space-y-6 sm:space-y-8">
                
                {/* Intro Title */}
                <div className="mb-4 sm:mb-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-2">
                            Overview, <span className="font-medium text-gray-800">{pocUser?.name?.split(' ')[0] || 'Admin'}</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl">
                            Welcome to the Analytics Dashboard. Monitor your school's engagement and student performance in real-time.
                        </p>
                    </div>
                </div>

                {/* Top Row: 4 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                    <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <img src="/images/total students.png" alt="" className="absolute right-2 bottom-1 w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <span className="font-semibold text-xs sm:text-sm tracking-widest uppercase text-gray-500">Total Students</span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight relative z-10">{dashboardData?.stats?.totalStudents}</div>
                    </div>

                    <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <img src="/images/paid students.png" alt="" className="absolute right-2 bottom-1 w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <span className="font-semibold text-xs sm:text-sm tracking-widest uppercase text-gray-500">Paid Students</span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight relative z-10">{dashboardData?.stats?.paidStudents}</div>
                    </div>

                    <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <img src="/images/avg selection.png" alt="" className="absolute right-2 bottom-1 w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <span className="font-semibold text-xs sm:text-sm tracking-widest uppercase text-gray-500">Avg. Completion</span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight relative z-10">{dashboardData?.stats?.averageCompletion}%</div>
                    </div>

                    <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <img src="/images/avg ssi score.png" alt="" className="absolute right-2 bottom-1 w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <span className="font-semibold text-xs sm:text-sm tracking-widest uppercase text-gray-500">Avg. SSI Score</span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-light text-gray-900 tracking-tight relative z-10">{dashboardData?.stats?.averageSSI}</div>
                    </div>
                </div>

                {/* Middle Row: 3 Detail Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Status Container 1 */}
                    <div className="glass-panel p-5 sm:p-6 relative overflow-hidden group">
                        <img src="/images/all students.png" alt="" className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 object-contain opacity-60 group-hover:opacity-75 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-4 mb-5 sm:mb-6 relative z-10">
                            <h3 className="font-medium text-lg text-gray-900 tracking-wide">All Student Status <span className="opacity-60 text-sm">(Live)</span></h3>
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('registered')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'registered' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span><span className="font-medium text-gray-800">Registered</span></div>
                                <span className="font-bold text-gray-900 text-lg">{dashboardData?.stats?.paidStudents}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('unregistered')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'unregistered' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-stone-400 shadow-sm"></span><span className="font-medium text-gray-800">Unregistered</span></div>
                                <span className="font-bold text-gray-900 text-lg">{unRegisteredCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Container 2 */}
                    <div className="glass-panel p-5 sm:p-6 relative overflow-hidden group">
                        <img src="/images/live tracking students.png" alt="" className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 object-contain opacity-60 group-hover:opacity-75 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-4 mb-5 sm:mb-6 relative z-10">
                            <h3 className="font-medium text-lg text-gray-900 tracking-wide">Live Tracking <span className="opacity-60 text-sm">(Student)</span></h3>
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('online')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'online' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#fcd34d] shadow-sm"></span><span className="font-medium text-gray-800">Online</span></div>
                                <span className="font-bold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.online || 0}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('offline')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'offline' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-stone-400 shadow-sm"></span><span className="font-medium text-gray-800">Offline</span></div>
                                <span className="font-bold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.offline || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Container 3 */}
                    <div className="glass-panel p-5 sm:p-6 md:col-span-2 xl:col-span-1 relative overflow-hidden group">
                        <img src="/images/idea submission.png" alt="" className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 object-contain opacity-60 group-hover:opacity-75 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-4 mb-5 sm:mb-6 relative z-10">
                            <h3 className="font-medium text-lg text-gray-900 tracking-wide">Idea Submission</h3>
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('submitted')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'submitted' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd] shadow-sm"></span><span className="font-medium text-gray-800">Submitted</span></div>
                                <span className="font-bold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.submitted || 0}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('pending')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border border-white/50 ${statusFilter === 'pending' ? 'bg-white/80 shadow-md ring-1 ring-[#D4AF37]/40' : 'bg-white/30 hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#fca5a5] shadow-sm"></span><span className="font-medium text-gray-800">Pending</span></div>
                                <span className="font-bold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.pending || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: 2 Columns */}
                <div className="flex flex-col xl:flex-row gap-6 sm:gap-8">
                    {/* LEFT COL: Registered Students Details (65%) */}
                    <div className="xl:w-[65%] flex flex-col">
                        <div className="glass-panel p-5 sm:p-6 flex-1 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-medium text-gray-900 tracking-wide flex items-center gap-2">
                                    Student Directory
                                    {statusFilter !== 'all' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/60 text-gray-600 border border-white shadow-sm mt-1 sm:mt-0">
                                            {statusFilter} Active
                                            <X onClick={() => setStatusFilter('all')} className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500 transition-colors" />
                                        </span>
                                    )}
                                </h2>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-5 py-2.5 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full text-sm w-full sm:w-72 focus:ring-2 focus:ring-[#D4AF37]/50 focus:bg-white/80 transition outline-none shadow-sm"
                                    />
                                </div>
                            </div>

                            {filteredStudents.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-white/20 rounded-2xl border border-white/40">
                                    <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No students match your criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-2 flex-1">
                                    <table className="w-full min-w-[900px] border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200/50 text-left">
                                                <th className="px-4 py-3 text-xs font-bold text-gray-400 tracking-wider uppercase">STUDENT</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-400 tracking-wider uppercase cursor-pointer hover:text-gray-800 group transition-colors" onClick={() => handleSort('registeredAt')}>
                                                    <div className="flex items-center gap-1">
                                                        REGISTERED
                                                        {sortField === 'registeredAt' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#D4AF37]" /> : <ChevronDown className="w-3 h-3 text-[#D4AF37]" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-400 tracking-wider uppercase">PROGRESS</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-400 tracking-wider uppercase cursor-pointer hover:text-gray-800 group transition-colors" onClick={() => handleSort('ssiScore')}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        SSI SCORE
                                                        {sortField === 'ssiScore' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#D4AF37]" /> : <ChevronDown className="w-3 h-3 text-[#D4AF37]" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-400 tracking-wider uppercase text-center">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200/50">
                                            {filteredStudents.map((student) => (
                                                <tr key={student._id} onClick={() => setSelectedStudent(student)} className="hover:bg-white/40 cursor-pointer transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 font-bold uppercase text-sm border border-white shadow-sm group-hover:scale-105 transition-transform">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${student.isOnline ? 'bg-[#fcd34d]' : 'bg-gray-300'}`} title={student.isOnline ? 'Online' : 'Offline'}></div>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 whitespace-nowrap group-hover:text-amber-700 transition-colors">{student.name}</p>
                                                                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{student.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                                            {new Date(student.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3 w-40">
                                                            <div className="flex-1 h-2.5 bg-white/50 rounded-full overflow-hidden shadow-inner border border-white/60">
                                                                <div className="h-full bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] rounded-full" style={{ width: `${student.overallCompletion}%` }} />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-800 w-10">{student.overallCompletion}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Award className={`w-5 h-5 ${student.ssiScore > 0 ? 'text-[#D4AF37]' : 'text-gray-300'}`} />
                                                            <span className="font-bold text-gray-800 text-base">{student.ssiScore || 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border ${student.isPaid ? 'bg-white border-[#D4AF37]/30 text-[#B8952E]' : 'bg-white/50 border-transparent text-gray-400'}`}>
                                                                {student.isPaid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm border ${student.ideaSubmissionStatus === 'submitted' ? 'bg-[#1A1A1A] border-gray-900 text-white' : 'bg-white/50 border-transparent text-gray-400'}`}>
                                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COL: Leaderboard & Watch Time (35%) */}
                    <div className="xl:w-[35%] flex flex-col space-y-6 sm:space-y-8">
                        {/* Leaderboard */}
                        <div className="glass-panel p-5 sm:p-6">
                            <h2 className="text-xl font-medium text-gray-900 mb-5 flex items-center gap-2 tracking-wide">
                                <Award className="w-5 h-5 text-[#D4AF37]" />
                                Performance Leaderboard
                            </h2>
                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 overflow-hidden border border-white/60 shadow-sm">
                                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-white/60 px-2">
                                    <div className="col-span-2">Rank</div>
                                    <div className="col-span-6">Student</div>
                                    <div className="col-span-2 text-center">Class</div>
                                    <div className="col-span-2 text-right">SSI</div>
                                </div>
                                <div className="mt-3 space-y-1.5">
                                    {dashboardData?.stats?.leaderboard?.length > 0 ? dashboardData.stats.leaderboard.slice(0, 6).map((student, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2 px-2 hover:bg-white/60 rounded-xl transition cursor-default">
                                            <div className="col-span-2 flex items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${idx === 0 ? 'bg-gradient-to-br from-[#F5D76E] to-[#D4AF37] border-white/50 text-white' : idx === 1 ? 'bg-gray-100 border-white text-gray-600' : idx === 2 ? 'bg-amber-100/50 border-white text-amber-700' : 'bg-white/50 border-transparent text-gray-400'}`}>
                                                    {student.rank}
                                                </div>
                                            </div>
                                            <div className="col-span-6 font-semibold text-sm text-gray-800 truncate">
                                                {student.student}
                                            </div>
                                            <div className="col-span-2 text-center text-xs font-bold text-gray-400">
                                                {student.class}
                                            </div>
                                            <div className="col-span-2 text-right font-light text-xl text-gray-900 tracking-tight">
                                                {student.ssiScore}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-gray-400 text-sm font-medium">No students ranked yet</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student Watch Time */}
                        <div className="glass-panel p-5 sm:p-6 flex-1 flex flex-col min-h-[300px]">
                            <h2 className="text-xl font-medium text-gray-900 mb-2 flex items-center gap-2 tracking-wide">
                                <MonitorPlay className="w-5 h-5 text-gray-600" />
                                Watch Analytics
                            </h2>
                            <div className="flex justify-between items-end mb-6">
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Aggregate Module Minutes</p>
                                <div className="text-right">
                                    <p className="text-2xl font-light text-gray-900 tracking-tight">{dashboardData?.stats?.watchTimeData?.reduce((acc, curr) => acc + curr.totalTimeSpent, 0) || 0} <span className="text-sm text-gray-500 font-medium">min</span></p>
                                </div>
                            </div>

                            <div className="flex-1 w-full mt-2 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 p-4 shadow-sm">
                                {dashboardData?.stats?.watchTimeData?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dashboardData.stats.watchTimeData} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorValueBg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                            <XAxis dataKey="moduleTitle" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                                                itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                                cursor={{ stroke: 'rgba(212, 175, 55, 0.2)', strokeWidth: 2 }}
                                                formatter={(value) => [`${value} mins`, 'Duration']}
                                            />
                                            <Area type="monotone" dataKey="totalTimeSpent" stroke="#D4AF37" strokeWidth={3} fill="url(#colorValueBg)" activeDot={{ r: 6, fill: '#fff', stroke: '#D4AF37', strokeWidth: 2 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No watch time data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Profile Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in cursor-default" onClick={() => setSelectedStudent(null)}>
                    <div className="bg-[#F5EDD6] border border-white/50 rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 relative" onClick={e => e.stopPropagation()}>
                        
                        {/* Modal Bg Blobs */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#FFFFFF]/80 rounded-full filter blur-[80px]"></div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#B8952E] font-light text-2xl border border-white/60">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 tracking-wide">{selectedStudent.name}</h3>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">
                                        <span className={`w-2 h-2 rounded-full shadow-sm ${selectedStudent.isOnline ? 'bg-[#fcd34d]' : 'bg-gray-400'}`}></span>
                                        {selectedStudent.isOnline ? 'Active Now' : 'Offline'} • Class {selectedStudent.class}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 w-10 h-10 flex items-center justify-center bg-white/50 text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition shadow-sm border border-white/60">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto relative z-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Contact Details</h4>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-sm">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"><Mail className="w-4 h-4 text-gray-400" /></div>
                                        {selectedStudent.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-sm">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"><Phone className="w-4 h-4 text-gray-400" /></div>
                                        {selectedStudent.phone || 'No phone provided'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-sm">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"><MapPin className="w-4 h-4 text-gray-400" /></div>
                                        {[selectedStudent.city, selectedStudent.country].filter(Boolean).join(', ') || 'Location unknown'}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Account Standing</h4>
                                    <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                                        <span className="text-sm font-semibold text-gray-800">Registration</span>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm ${selectedStudent.isPaid ? 'bg-white text-[#B8952E] border border-[#D4AF37]/30' : 'bg-gray-100 text-gray-500'}`}>
                                            {selectedStudent.isPaid ? 'Paid & Live' : 'Unregistered'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl">
                                        <span className="text-sm font-semibold text-gray-800">Idea Status</span>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm ${selectedStudent.ideaSubmissionStatus === 'submitted' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-500 border border-white'}`}>
                                            {selectedStudent.ideaSubmissionStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1">Academic Progress</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/60 backdrop-blur-sm border text-center border-white/60 shadow-sm px-4 py-8 rounded-3xl flex flex-col items-center justify-center">
                                    <div className="w-14 h-14 bg-white border border-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                        <Target className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="text-4xl font-light text-gray-900 tracking-tight mb-1">{selectedStudent.overallCompletion}%</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Course Completion</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm border text-center border-white/60 shadow-sm px-4 py-8 rounded-3xl flex flex-col items-center justify-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#F5D76E] to-[#D4AF37] border border-white/50 rounded-2xl shadow-md flex items-center justify-center mb-4 text-white">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div className="text-4xl font-light text-gray-900 tracking-tight mb-1">{selectedStudent.ssiScore || 0}</div>
                                    <div className="text-[10px] font-bold text-[#B8952E] uppercase tracking-widest">Total SSI Score</div>
                                </div>
                            </div>

                            {selectedStudent.moduleProgress && selectedStudent.moduleProgress.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Module Breakdown</h4>
                                    <div className="space-y-3">
                                        {selectedStudent.moduleProgress.map((mod, idx) => (
                                            <div key={idx} className="p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-semibold text-gray-800 text-sm tracking-wide">{mod.moduleTitle}</span>
                                                    <span className="text-xs font-bold text-[#1a1a1a] bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">{mod.completionPercentage}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/50 border border-white rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] rounded-full" style={{ width: `${mod.completionPercentage}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
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
