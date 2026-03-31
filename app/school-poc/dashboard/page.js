'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { schoolPoc } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
    School, Users, TrendingUp, Award, LogOut, Search,
    ChevronDown, ChevronUp, GraduationCap, Target, Lightbulb, Activity, MonitorPlay, X, MapPin, Phone, Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

    return (
        <div className="min-h-screen pb-12 bg-gray-50/30">
            {/* Header */}
            <div className="glass-strong sticky top-0 z-50 border-b border-white/20">
                <div className="container-lg py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-red to-accent-gold rounded-xl flex items-center justify-center shadow-md">
                            <School className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-800">{dashboardData?.school?.name}</h1>
                            <p className="text-sm text-neutral-medium">School POC Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-medium hidden sm:block">
                            Welcome, {pocUser?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-lg pt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Total</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Total Students</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.totalStudents}</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Paid</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Paid Students</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.paidStudents}</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Online</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Live Now</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.liveStatus?.online || 0}</p>
                            <span className="text-xs text-neutral-medium mb-1">/ {dashboardData?.stats?.totalStudents}</span>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Ideas</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Ideas Submitted</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.ideaSubmissions?.submitted || 0}</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Avg Comp</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Avg. Completion</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.averageCompletion}%</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-medium hidden lg:block xl:hidden">Avg SSI</span>
                            <span className="text-sm font-medium text-neutral-medium block lg:hidden xl:block">Avg. SSI Score</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.averageSSI}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Watch Time Graph */}
                    <div className="card p-6 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MonitorPlay className="w-5 h-5 text-primary-red" />
                            Students Watch Time
                        </h2>
                        <div className="flex-1 min-h-[250px] w-full mt-4">
                            {dashboardData?.stats?.watchTimeData?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dashboardData.stats.watchTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="moduleTitle" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: '#F3F4F6' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${value} mins`, 'Total Multi-Student Watch Time']}
                                        />
                                        <Bar dataKey="totalTimeSpent" fill="url(#colorGd)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        <defs>
                                            <linearGradient id="colorGd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#A8201A" stopOpacity={0.9} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-medium">No watch time data available</div>
                            )}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="card p-6 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-accent-gold" />
                            Student Performance Leaderboard
                        </h2>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[280px]">
                            {dashboardData?.stats?.leaderboard?.length > 0 ? dashboardData.stats.leaderboard.map((student, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-accent-gold/40 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white' : idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' : idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            #{student.rank}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{student.student}</p>
                                            <p className="text-xs text-neutral-medium">Class: {student.class}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-primary-red">{student.ssiScore}</div>
                                        <div className="text-[10px] text-neutral-medium uppercase tracking-wider font-semibold">SSI Score</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex items-center justify-center text-neutral-medium">No students ranked yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Student Directory</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-medium" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-neutral-border rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red bg-gray-50/50"
                            />
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-neutral-medium/50 mx-auto mb-3" />
                            <p className="text-neutral-medium">No students found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-neutral-border bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide">
                                            Student Details
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red group"
                                            onClick={() => handleSort('registeredAt')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Registration
                                                {sortField === 'registeredAt' ? (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-red" /> : <ChevronDown className="w-3 h-3 text-primary-red" />
                                                ) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red group"
                                            onClick={() => handleSort('overallCompletion')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Course Progress
                                                {sortField === 'overallCompletion' ? (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-red" /> : <ChevronDown className="w-3 h-3 text-primary-red" />
                                                ) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red group"
                                            onClick={() => handleSort('ssiScore')}
                                        >
                                            <div className="flex items-center gap-1">
                                                SSI
                                                {sortField === 'ssiScore' ? (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-red" /> : <ChevronDown className="w-3 h-3 text-primary-red" />
                                                ) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide">
                                            Idea
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-border">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} onClick={() => setSelectedStudent(student)} className="hover:bg-gray-50/50 transition cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase text-sm border border-white shadow-sm">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${student.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} title={student.isOnline ? 'Online' : 'Offline'}></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{student.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <p className="text-xs text-neutral-medium truncate max-w-[150px]">{student.email}</p>
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Cls: {student.class}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {new Date(student.registeredAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary-red to-accent-gold rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${student.overallCompletion}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 w-8">{student.overallCompletion}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Award className={`w-4 h-4 ${student.ssiScore >= 80 ? 'text-yellow-500' :
                                                            student.ssiScore >= 60 ? 'text-purple-500' :
                                                                student.ssiScore >= 40 ? 'text-blue-500' :
                                                                    'text-gray-400'
                                                        }`} />
                                                    <span className="font-bold text-gray-900">{student.ssiScore || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${student.ideaSubmissionStatus === 'submitted'
                                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                    }`}>
                                                    {student.ideaSubmissionStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.isPaid ? (
                                                     <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                                        Live (Registered)
                                                     </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                                                        Unregistered
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Profile Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in cursor-default" onClick={() => setSelectedStudent(null)}>
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
