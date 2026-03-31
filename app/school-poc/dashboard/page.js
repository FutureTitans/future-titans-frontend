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

    const filteredStudents = dashboardData?.students
        ?.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
                    <p className="text-neutral-medium mb-6">{error}</p>
                    <button
                        onClick={fetchDashboard}
                        className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-dark-red transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const unRegisteredCount = dashboardData?.stats?.totalStudents - dashboardData?.stats?.paidStudents;

    return (
        <div className="min-h-screen pb-12 bg-gray-50/50 text-gray-800 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="container-lg py-4 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-gold rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                            <School className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-gray-900">{dashboardData?.school?.name || 'School POC Dashboard'}</h1>
                            <p className="text-sm text-gray-500 font-medium">School POC Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <span className="text-sm font-semibold text-gray-900 block">Welcome, {pocUser?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${pocUser?.name}&backgroundColor=ffffff`} alt="Avatar" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-[1700px] mx-auto space-y-8">
                {/* Top Row: 4 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                <div className="p-2 bg-gray-50 rounded-xl"><Users className="w-5 h-5 text-gray-700" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase">Total Students</span>
                            </div>
                            <div className="text-5xl font-extrabold text-gray-900 mt-2">{dashboardData?.stats?.totalStudents}</div>
                        </div>
                        <Users className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                <div className="p-2 bg-gray-50 rounded-xl"><GraduationCap className="w-5 h-5 text-gray-700" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase">Paid Students</span>
                            </div>
                            <div className="text-5xl font-extrabold text-gray-900 mt-2">{dashboardData?.stats?.paidStudents}</div>
                        </div>
                        <GraduationCap className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                <div className="p-2 bg-gray-50 rounded-xl"><TrendingUp className="w-5 h-5 text-gray-700" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase">Avg. Completion</span>
                            </div>
                            <div className="text-5xl font-extrabold text-gray-900 mt-2">{dashboardData?.stats?.averageCompletion}%</div>
                        </div>
                        <TrendingUp className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                <div className="p-2 bg-gray-50 rounded-xl"><Target className="w-5 h-5 text-gray-700" /></div>
                                <span className="font-bold text-sm tracking-wide uppercase">Avg. SSI Score</span>
                            </div>
                            <div className="text-5xl font-extrabold text-gray-900 mt-2">{dashboardData?.stats?.averageSSI}</div>
                        </div>
                        <Target className="w-24 h-24 text-gray-50 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>

                {/* Middle Row: 3 Detail Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-full"><FileText className="w-5 h-5 text-gray-600" /></div>
                                <h3 className="font-bold text-lg text-gray-800">All Student Status (Live)</h3>
                            </div>
                            <FileText className="w-8 h-8 text-gray-200" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="font-semibold text-gray-700">Registered</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.paidStudents}</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-gray-400"></span><span className="font-semibold text-gray-700">Unregistered</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{unRegisteredCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-full"><Activity className="w-5 h-5 text-gray-600" /></div>
                                <h3 className="font-bold text-lg text-gray-800">Live Tracking (Student)</h3>
                            </div>
                            <Activity className="w-8 h-8 text-gray-200" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="font-semibold text-gray-700">Online</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.online || 0}</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-orange-400"></span><span className="font-semibold text-gray-700">Offline</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.liveStatus?.offline || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-full"><Lightbulb className="w-5 h-5 text-gray-600" /></div>
                                <h3 className="font-bold text-lg text-gray-800">Idea Submission</h3>
                            </div>
                            <Lightbulb className="w-8 h-8 text-gray-200" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-indigo-500"></span><span className="font-semibold text-gray-700">Submitted</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.submitted || 0}</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50/80 hover:bg-gray-100 transition px-5 py-3.5 rounded-2xl">
                                <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-red-400"></span><span className="font-semibold text-gray-700">Pending</span></div>
                                <span className="font-extrabold text-gray-900 text-lg">{dashboardData?.stats?.ideaSubmissions?.pending || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: 2 Columns */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* LEFT COL: Registered Students Details (8 Col) */}
                    <div className="xl:col-span-8 flex flex-col">
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex-1 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Registered Students (Detailed)</h2>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm w-full sm:w-72 focus:ring-2 focus:ring-primary-red/20 focus:bg-white focus:border-primary-red transition"
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
                                            <tr className="border-b border-gray-100 text-left">
                                                <th className="px-4 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">STUDENT</th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase cursor-pointer hover:text-gray-900 group" onClick={() => handleSort('registeredAt')}>
                                                    <div className="flex items-center gap-1">
                                                        REGISTERED
                                                        {sortField === 'registeredAt' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">PROGRESS</th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase cursor-pointer hover:text-gray-900 group" onClick={() => handleSort('ssiScore')}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        SSI SCORE
                                                        {sortField === 'ssiScore' ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase text-center">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredStudents.map((student) => (
                                                <tr key={student._id} onClick={() => setSelectedStudent(student)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-bold text-gray-900 whitespace-nowrap">{student.name}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            {new Date(student.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3 w-40">
                                                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                                <div className="h-full bg-accent-gold rounded-full" style={{ width: `${student.overallCompletion}%` }} />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900 w-10">{student.overallCompletion}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Award className={`w-5 h-5 ${student.ssiScore > 0 ? 'text-gray-400' : 'text-gray-300'}`} />
                                                            <span className="font-bold text-gray-900">{student.ssiScore || 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${student.isPaid ? 'bg-[#F2EFE9] text-[#8C7A58]' : 'bg-gray-100 text-gray-500'}`}>
                                                                {student.isPaid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${student.ideaSubmissionStatus === 'submitted' ? 'bg-[#5B636A] text-white' : 'bg-[#D1C9C0] text-gray-600'}`}>
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
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-accent-gold" />
                                Student Performance Leaderboard
                            </h2>
                            <div className="bg-gray-50/50 rounded-2xl p-4 overflow-hidden">
                                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100 px-2">
                                    <div className="col-span-2">Rank</div>
                                    <div className="col-span-5">Student</div>
                                    <div className="col-span-2 text-center">Class</div>
                                    <div className="col-span-3 text-right">SSI</div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {dashboardData?.stats?.leaderboard?.length > 0 ? dashboardData.stats.leaderboard.slice(0, 6).map((student, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2.5 px-2 hover:bg-white rounded-xl transition cursor-default">
                                            <div className="col-span-2 flex items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${idx === 0 ? 'bg-[#F3E2A9] text-[#A67C00]' : idx === 1 ? 'bg-[#E0E0E0] text-[#707070]' : idx === 2 ? 'bg-[#E3C5B5] text-[#915B40]' : 'bg-[#F5F2ED] text-gray-600'}`}>
                                                    {student.rank}
                                                </div>
                                            </div>
                                            <div className="col-span-5 font-semibold text-sm text-gray-800 truncate">
                                                {student.student}
                                            </div>
                                            <div className="col-span-2 text-center text-sm font-medium text-gray-600">
                                                {student.class}
                                            </div>
                                            <div className="col-span-3 text-right font-bold text-gray-900">
                                                {student.ssiScore}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-gray-500 text-sm">No students ranked yet</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student Watch Time */}
                        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex-1 flex flex-col">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <MonitorPlay className="w-5 h-5 text-gray-600" />
                                Student Watch Time
                            </h2>
                            <div className="flex justify-between items-end mb-6">
                                <p className="text-sm text-gray-500">Total Minutes Watched</p>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">Total: {dashboardData?.stats?.watchTimeData?.reduce((acc, curr) => acc + curr.totalTimeSpent, 0) || 0} mins</p>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[220px] w-full mt-2">
                                {dashboardData?.stats?.watchTimeData?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dashboardData.stats.watchTimeData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#A8201A" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#A8201A" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorValueBg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="moduleTitle" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                formatter={(value) => [`${value} mins`, 'Duration']}
                                            />
                                            {/* Using a dual tone chart mimicking the reference */}
                                            <Area type="monotone" dataKey="totalTimeSpent" stroke="#A8201A" strokeWidth={3} fill="url(#colorValue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">No watch time data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Profile Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in cursor-default" onClick={() => setSelectedStudent(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase text-lg shadow-inner">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-neutral-medium mt-0.5">
                                        <span className={`w-2 h-2 rounded-full ${selectedStudent.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        {selectedStudent.isOnline ? 'Active Now' : 'Offline'} • Class {selectedStudent.class}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Info</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {selectedStudent.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {selectedStudent.phone || 'No phone provided'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {[selectedStudent.city, selectedStudent.country].filter(Boolean).join(', ') || 'Location unknown'}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account Status</h4>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-medium text-gray-600">Registration</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${selectedStudent.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {selectedStudent.isPaid ? 'Paid & Live' : 'Unregistered'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-medium text-gray-600">Idea Submission</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${selectedStudent.ideaSubmissionStatus === 'submitted' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {selectedStudent.ideaSubmissionStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Progress</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                                        <Target className="w-6 h-6 text-primary-red" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{selectedStudent.overallCompletion}%</div>
                                    <div className="text-xs font-medium text-gray-500 uppercase">Overall Course Completion</div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                                        <Award className="w-6 h-6 text-accent-gold" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{selectedStudent.ssiScore || 0}</div>
                                    <div className="text-xs font-medium text-gray-500 uppercase">Total SSI Score</div>
                                </div>
                            </div>

                            {selectedStudent.moduleProgress && selectedStudent.moduleProgress.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Module Breakdown</h4>
                                    <div className="space-y-3">
                                        {selectedStudent.moduleProgress.map((mod, idx) => (
                                            <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-gray-800 text-sm">{mod.moduleTitle}</span>
                                                    <span className="text-xs font-bold text-primary-red">{mod.completionPercentage}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary-red to-accent-gold rounded-full" style={{ width: `${mod.completionPercentage}%` }}></div>
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
