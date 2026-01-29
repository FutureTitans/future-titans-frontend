'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { schoolPoc } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
    School, Users, TrendingUp, Award, LogOut, Search,
    ChevronDown, ChevronUp, GraduationCap, Target
} from 'lucide-react';

export default function SchoolPocDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [pocUser, setPocUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('registeredAt');
    const [sortOrder, setSortOrder] = useState('desc');

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
        <div className="min-h-screen pb-12">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm text-neutral-medium">Total Students</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.totalStudents}</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm text-neutral-medium">Paid Students</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.paidStudents}</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-sm text-neutral-medium">Avg. Completion</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.averageCompletion}%</p>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-sm text-neutral-medium">Avg. SSI Score</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{dashboardData?.stats?.averageSSI}</p>
                    </div>
                </div>

                {/* Students Table */}
                <div className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Registered Students</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-medium" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-neutral-border rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                            />
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-neutral-medium mx-auto mb-3" />
                            <p className="text-neutral-medium">No students found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-neutral-border">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide">
                                            Student
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red"
                                            onClick={() => handleSort('registeredAt')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Registered
                                                {sortField === 'registeredAt' && (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red"
                                            onClick={() => handleSort('overallCompletion')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Progress
                                                {sortField === 'overallCompletion' && (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide cursor-pointer hover:text-primary-red"
                                            onClick={() => handleSort('ssiScore')}
                                        >
                                            <div className="flex items-center gap-1">
                                                SSI Score
                                                {sortField === 'ssiScore' && (
                                                    sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wide">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-border">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">{student.name}</p>
                                                    <p className="text-sm text-neutral-medium">{student.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">
                                                    {new Date(student.registeredAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary-red to-accent-gold rounded-full transition-all"
                                                            style={{ width: `${student.overallCompletion}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{student.overallCompletion}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Award className={`w-4 h-4 ${student.ssiScore >= 80 ? 'text-yellow-500' :
                                                            student.ssiScore >= 60 ? 'text-purple-500' :
                                                                student.ssiScore >= 40 ? 'text-blue-500' :
                                                                    'text-gray-400'
                                                        }`} />
                                                    <span className="font-medium text-gray-800">{student.ssiScore}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${student.isPaid
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {student.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
