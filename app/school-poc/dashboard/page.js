'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { schoolPoc } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
    School, Users, TrendingUp, Award, LogOut, Search,
    ChevronDown, ChevronUp, GraduationCap, Target, Lightbulb, Activity, MonitorPlay, X, MapPin, Phone, Mail, FileText, CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

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
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#FDFBF7]">
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4 flex justify-center"><AlertCircle className="w-16 h-16" /></div>
                    <h2 className="text-xl font-bold text-[#2A2B2A] mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="px-6 py-2.5 bg-[#F7C353] text-[#2A2B2A] font-bold rounded-lg hover:bg-[#eab344] transition shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const unRegisteredCount = dashboardData?.stats?.totalStudents - dashboardData?.stats?.paidStudents;

    return (
        <div className="min-h-screen pb-12 bg-[#FDFBF7] text-gray-800 font-sans">
            {/* Header - Dark Charcoal Theme */}
            <div className="sticky top-0 z-40 bg-[#2A2B2A] shadow-md">
                <div className="container-lg py-4 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F7C353] rounded-full flex items-center justify-center shadow-lg shadow-black/20 border-2 border-[#F7C353]/30">
                            <School className="w-6 h-6 text-[#2A2B2A]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white tracking-wide">{dashboardData?.school?.name || 'School POC Dashboard'}</h1>
                            <p className="text-sm text-[#F7C353] font-medium opacity-90">School POC Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <span className="text-sm font-semibold text-gray-300 block">Welcome, <span className="text-white">{pocUser?.name}</span></span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#F7C353] shadow-sm overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${pocUser?.name}&backgroundColor=2A2B2A&textColor=F7C353`} alt="Avatar" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-[1700px] mx-auto space-y-8 mt-4">
                {/* Top Row: 4 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                <div className="p-2 bg-[#FDFBF7] rounded-xl"><Users className="w-5 h-5 text-[#2A2B2A]" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase text-gray-600">Total Students</span>
                            </div>
                            <div className="text-5xl font-extrabold text-[#2A2B2A] mt-2">{dashboardData?.stats?.totalStudents}</div>
                        </div>
                        <Users className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                <div className="p-2 bg-[#FDFBF7] rounded-xl"><GraduationCap className="w-5 h-5 text-[#2A2B2A]" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase text-gray-600">Paid Students</span>
                            </div>
                            <div className="text-5xl font-extrabold text-[#2A2B2A] mt-2">{dashboardData?.stats?.paidStudents}</div>
                        </div>
                        <GraduationCap className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                <div className="p-2 bg-[#FDFBF7] rounded-xl"><TrendingUp className="w-5 h-5 text-[#2A2B2A]" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase text-gray-600">Avg. Completion</span>
                            </div>
                            <div className="text-5xl font-extrabold text-[#2A2B2A] mt-2">{dashboardData?.stats?.averageCompletion}%</div>
                        </div>
                        <TrendingUp className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-500 mb-2">
                                <div className="p-2 bg-[#FDFBF7] rounded-xl"><Target className="w-5 h-5 text-[#2A2B2A]" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase text-gray-600">Avg. SSI Score</span>
                            </div>
                            <div className="text-5xl font-extrabold text-[#2A2B2A] mt-2">{dashboardData?.stats?.averageSSI}</div>
                        </div>
                        <Target className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>

                {/* Middle Row: 3 Detail Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Container 1 */}
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#FDFBF7] rounded-full"><FileText className="w-5 h-5 text-[#2D5A4C]" /></div>
                                <h3 className="font-bold text-lg text-[#2A2B2A]">All Student Status (Live)</h3>
                            </div>
                            <FileText className="w-8 h-8 text-gray-100" />
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('registered')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'registered' ? 'bg-[#2D5A4C]/5 border-[#2D5A4C]/30 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-[#2D5A4C]"></span><span className="font-semibold text-gray-700">Registered</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.paidStudents}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('unregistered')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'unregistered' ? 'bg-gray-200 border-gray-400 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400"></span><span className="font-semibold text-gray-700">Unregistered</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{unRegisteredCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Container 2 */}
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#FDFBF7] rounded-full"><Activity className="w-5 h-5 text-[#F7C353]" /></div>
                                <h3 className="font-bold text-lg text-[#2A2B2A]">Live Tracking (Student)</h3>
                            </div>
                            <Activity className="w-8 h-8 text-gray-100" />
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('online')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'online' ? 'bg-amber-50 border-[#F7C353]/50 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-[#F7C353]"></span><span className="font-semibold text-gray-700">Online</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.online || 0}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('offline')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'offline' ? 'bg-gray-200 border-gray-400 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400"></span><span className="font-semibold text-gray-700">Offline</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.offline || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Container 3 */}
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#FDFBF7] rounded-full"><Lightbulb className="w-5 h-5 text-[#2A2B2A]" /></div>
                                <h3 className="font-bold text-lg text-[#2A2B2A]">Idea Submission</h3>
                            </div>
                            <Lightbulb className="w-8 h-8 text-gray-100" />
                        </div>
                        <div className="space-y-3">
                            <div 
                                onClick={() => handleFilterToggle('submitted')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'submitted' ? 'bg-slate-100 border-slate-300 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-[#2A2B2A]"></span><span className="font-semibold text-gray-700">Submitted</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.submitted || 0}</span>
                            </div>
                            <div 
                                onClick={() => handleFilterToggle('pending')}
                                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${statusFilter === 'pending' ? 'bg-gray-200 border-gray-400 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400"></span><span className="font-semibold text-gray-700">Pending</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.pending || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: 2 Columns */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* LEFT COL: Registered Students Details (8 Col) */}
                    <div className="xl:col-span-8 flex flex-col">
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex-1 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-[#2A2B2A] flex items-center gap-2">
                                    Student Directory
                                    {statusFilter !== 'all' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7C353]/20 text-[#8C6D2B] border border-[#F7C353]/30 capitalize">
                                            {statusFilter} Filter Active
                                            <X onClick={() => setStatusFilter('all')} className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500" />
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
                                        className="pl-10 pr-5 py-2.5 bg-[#FDFBF7] border border-gray-200 rounded-full text-sm w-full sm:w-72 focus:ring-2 focus:ring-[#F7C353]/50 focus:bg-white focus:border-[#F7C353] transition outline-none"
                                    />
                                </div>
                            </div>

                            {filteredStudents.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                                    <Users className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500 font-medium">No students found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto -mx-2 flex-1">
                                    <table className="w-full min-w-[900px] border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left bg-gray-50/30">
                                                <th className="px-4 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">STUDENT</th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase cursor-pointer hover:text-[#2A2B2A] group" onClick={() => handleSort('registeredAt')}>
                                                    <div className="flex items-center gap-1">
                                                        REGISTERED
                                                        {sortField === 'registeredAt' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#F7C353]" /> : <ChevronDown className="w-3 h-3 text-[#F7C353]" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">PROGRESS</th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase cursor-pointer hover:text-[#2A2B2A] group" onClick={() => handleSort('ssiScore')}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        SSI SCORE
                                                        {sortField === 'ssiScore' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#F7C353]" /> : <ChevronDown className="w-3 h-3 text-[#F7C353]" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase text-center">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredStudents.map((student) => (
                                                <tr key={student._id} onClick={() => setSelectedStudent(student)} className="hover:bg-[#FDFBF7] cursor-pointer transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold uppercase text-sm border border-gray-200">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${student.isOnline ? 'bg-[#F7C353]' : 'bg-gray-300'}`} title={student.isOnline ? 'Online' : 'Offline'}></div>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#2A2B2A] whitespace-nowrap">{student.name}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            {new Date(student.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3 w-40">
                                                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                                <div className="h-full bg-[#F7C353] rounded-full" style={{ width: `${student.overallCompletion}%` }} />
                                                            </div>
                                                            <span className="text-sm font-bold text-[#2A2B2A] w-10">{student.overallCompletion}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Award className={`w-5 h-5 ${student.ssiScore > 0 ? 'text-[#F7C353]' : 'text-gray-300'}`} />
                                                            <span className="font-bold text-[#2A2B2A]">{student.ssiScore || 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${student.isPaid ? 'bg-[#2D5A4C]/10 text-[#2D5A4C]' : 'bg-gray-100 text-gray-500'}`}>
                                                                {student.isPaid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100 ${student.ideaSubmissionStatus === 'submitted' ? 'bg-[#2A2B2A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                <ThumbsUp className="w-4 h-4" />
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

                    {/* RIGHT COL: Leaderboard & Watch Time (4 Col) */}
                    <div className="xl:col-span-4 flex flex-col space-y-8">
                        {/* Leaderboard */}
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6">
                            <h2 className="text-xl font-bold text-[#2A2B2A] mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#F7C353]" />
                                Student Performance Leaderboard
                            </h2>
                            <div className="bg-[#FDFBF7] rounded-2xl p-4 overflow-hidden border border-gray-100">
                                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-200 px-2">
                                    <div className="col-span-2">Rank</div>
                                    <div className="col-span-6">Student</div>
                                    <div className="col-span-2 text-center">Class</div>
                                    <div className="col-span-2 text-right">SSI</div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {dashboardData?.stats?.leaderboard?.length > 0 ? dashboardData.stats.leaderboard.slice(0, 6).map((student, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2.5 px-2 hover:bg-white rounded-xl transition cursor-default">
                                            <div className="col-span-2 flex items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${idx === 0 ? 'bg-[#F7C353] text-[#2A2B2A]' : idx === 1 ? 'bg-gray-200 text-[#2A2B2A]' : idx === 2 ? 'bg-orange-200 text-[#2A2B2A]' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                                    {student.rank}
                                                </div>
                                            </div>
                                            <div className="col-span-6 font-semibold text-sm text-[#2A2B2A] truncate">
                                                {student.student}
                                            </div>
                                            <div className="col-span-2 text-center text-sm font-bold text-gray-500">
                                                {student.class}
                                            </div>
                                            <div className="col-span-2 text-right font-extrabold text-[#2A2B2A]">
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
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-amber-50/50 p-6 flex-1 flex flex-col">
                            <h2 className="text-xl font-bold text-[#2A2B2A] mb-2 flex items-center gap-2">
                                <MonitorPlay className="w-5 h-5 text-[#2A2B2A]" />
                                Student Watch Time
                            </h2>
                            <div className="flex justify-between items-end mb-6">
                                <p className="text-sm text-gray-500 font-medium">Total Minutes Watched</p>
                                <div className="text-right">
                                    <p className="font-extrabold text-[#2A2B2A]">Total: {dashboardData?.stats?.watchTimeData?.reduce((acc, curr) => acc + curr.totalTimeSpent, 0) || 0} mins</p>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[220px] w-full mt-2">
                                {dashboardData?.stats?.watchTimeData?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dashboardData.stats.watchTimeData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorValueBg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#F7C353" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#F7C353" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                                            <XAxis dataKey="moduleTitle" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #EBEBEB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                                                itemStyle={{ color: '#2A2B2A', fontWeight: 'bold' }}
                                                formatter={(value) => [`${value} mins`, 'Duration']}
                                            />
                                            {/* Using Gold/Charcoal theme area chart */}
                                            <Area type="monotone" dataKey="totalTimeSpent" stroke="#2A2B2A" strokeWidth={3} fill="url(#colorValueBg)" activeDot={{ r: 6, fill: '#F7C353', stroke: '#2A2B2A', strokeWidth: 2 }} />
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A2B2A]/60 backdrop-blur-sm animate-in fade-in cursor-default" onClick={() => setSelectedStudent(null)}>
                    <div className="bg-[#FDFBF7] border border-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#F7C353]/20 flex items-center justify-center text-[#A67C00] font-extrabold uppercase text-xl border border-[#F7C353]/30">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2A2B2A]">{selectedStudent.name}</h3>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">
                                        <span className={`w-2 h-2 rounded-full ${selectedStudent.isOnline ? 'bg-[#F7C353]' : 'bg-gray-400'}`}></span>
                                        {selectedStudent.isOnline ? 'Active Now' : 'Offline'} • Class {selectedStudent.class}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Info</h4>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="p-1.5 bg-[#FDFBF7] rounded-lg"><Mail className="w-4 h-4 text-[#2A2B2A]" /></div>
                                        {selectedStudent.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="p-1.5 bg-[#FDFBF7] rounded-lg"><Phone className="w-4 h-4 text-[#2A2B2A]" /></div>
                                        {selectedStudent.phone || 'No phone provided'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="p-1.5 bg-[#FDFBF7] rounded-lg"><MapPin className="w-4 h-4 text-[#2A2B2A]" /></div>
                                        {[selectedStudent.city, selectedStudent.country].filter(Boolean).join(', ') || 'Location unknown'}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account Status</h4>
                                    <div className="flex items-center justify-between p-3.5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                        <span className="text-sm font-bold text-[#2A2B2A]">Registration</span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${selectedStudent.isPaid ? 'bg-[#2D5A4C]/10 text-[#2D5A4C]' : 'bg-gray-100 text-gray-500'}`}>
                                            {selectedStudent.isPaid ? 'Paid & Live' : 'Unregistered'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-white border border-gray-100 shadow-sm rounded-xl">
                                        <span className="text-sm font-bold text-[#2A2B2A]">Idea Submission</span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${selectedStudent.ideaSubmissionStatus === 'submitted' ? 'bg-[#2A2B2A]/10 text-[#2A2B2A]' : 'bg-gray-100 text-gray-500'}`}>
                                            {selectedStudent.ideaSubmissionStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Progress</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white border text-center border-gray-100 shadow-sm px-4 py-6 rounded-2xl flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-[#FDFBF7] border border-gray-100 rounded-full shadow-inner flex items-center justify-center mb-3">
                                        <Target className="w-6 h-6 text-[#2D5A4C]" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-[#2A2B2A] mb-1">{selectedStudent.overallCompletion}%</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Completion</div>
                                </div>
                                <div className="bg-white border text-center border-gray-100 shadow-sm px-4 py-6 rounded-2xl flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-[#FDFBF7] border border-gray-100 rounded-full shadow-inner flex items-center justify-center mb-3">
                                        <Award className="w-6 h-6 text-[#F7C353]" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-[#2A2B2A] mb-1">{selectedStudent.ssiScore || 0}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total SSI Score</div>
                                </div>
                            </div>

                            {selectedStudent.moduleProgress && selectedStudent.moduleProgress.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Module Breakdown</h4>
                                    <div className="space-y-3">
                                        {selectedStudent.moduleProgress.map((mod, idx) => (
                                            <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div className="flex justify-between items-center mb-2.5">
                                                    <span className="font-bold text-[#2A2B2A] text-sm">{mod.moduleTitle}</span>
                                                    <span className="text-xs font-extrabold text-[#F7C353] bg-[#F7C353]/10 px-2 py-0.5 rounded-full">{mod.completionPercentage}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-[#FDFBF7] border border-gray-100 rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full bg-[#F7C353] rounded-full" style={{ width: `${mod.completionPercentage}%` }}></div>
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
