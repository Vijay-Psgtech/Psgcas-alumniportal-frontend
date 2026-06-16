import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from "../../services/api";

// Icons (can be replaced with icon library like lucide-react or react-icons)
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const FilterIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const ResetIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

export const MembershipTab = ({ onError }) => {
    const [memberships, setMemberships] = useState([]);
    const [summary, setSummary] = useState({ totalMemberships: 0, activeMemberships: 0, totalAmount: 0 });
    const [loading, setLoading] = useState(true);

    // Filters & pagination
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [pageData, setPageData] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await adminAPI.fetchAllMemberships({
                    page: 1,
                    limit: 20,
                });
                const data = response?.data || {};
                setPageData({
                    currentPage: data.currentPage || 1,
                    totalPages: data.totalPages || 1,
                });
                setMemberships(data.memberships || []);
                setSummary(data.summary || { totalMemberships: (data.memberships || []).length, activeMemberships: 0, totalAmount: 0 });
            } catch (error) {
                console.error('Error fetching memberships:', error);
                if (onError) onError('Failed to load memberships');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, [onError]);

    const handlePageChange = async (page) => {
        try {
            setLoading(true);
            const queryParams = {
                page,
                limit: 20,
            };
            const res = await adminAPI.fetchAllMemberships(queryParams);
            setPageData({
                totalPages: res.data.totalPages || 1,
                currentPage: res.data.currentPage || 1,
            });
            setMemberships(res.data.memberships || []);
            window.scrollTo({ top: 550, behavior: "smooth" });
        } catch (error) {
            console.error("Failed to fetch page:", error);
        } finally {
            setLoading(false);
        }
    };

    // Optimized departments from current page data
    const departments = Array.from(
        new Set(memberships.map((m) => m.department).filter(Boolean)),
    ).sort();

    const paymentMode = Array.from(
        new Set(memberships.map((m) => m.paymentId?.gatewayResponse?.mode).filter(Boolean)),
    ).sort();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return memberships.filter((m) => {
            if (statusFilter && (m.membershipStatus || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
            if (departmentFilter && (m.department || '').toLowerCase() !== departmentFilter.toLowerCase()) return false;
            const mode = m.paymentId?.gatewayResponse?.mode || '';
            if (paymentFilter && mode.toLowerCase() !== paymentFilter.toLowerCase()) return false;
            if (!q) return true;
            const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
            return fullName.includes(q) || (m.email || '').toLowerCase().includes(q) || (m.phone || '').toLowerCase().includes(q);
        });
    }, [memberships, statusFilter, departmentFilter, paymentFilter, query]);

    const totalItems = filtered.length;
    const currentSlice = filtered;

    const hasActiveFilters = statusFilter || departmentFilter || paymentFilter || query;

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p className="text-slate-600 font-medium">Loading memberships…</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6">
            {/* Header Section with Stats */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl px-6 lg:px-8 py-4 lg:py-6 shadow-lg">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Membership Management</h1>
                    <p className="text-blue-100">Overview, search and manage membership records</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    {/* Stat Card 1 - Total Members */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-2">Total Members</p>
                                <p className="text-3xl lg:text-4xl font-bold text-white">{summary.totalMemberships || memberships.length}</p>
                            </div>
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-400/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">👥</div>
                        </div>
                    </div>

                    {/* Stat Card 2 - Active Members */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-2">Active Members</p>
                                <p className="text-3xl lg:text-4xl font-bold text-emerald-300">{summary.activeMemberships || memberships.filter(m => (m.membershipStatus || '').toLowerCase() === 'active').length}</p>
                            </div>
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-400/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">✓</div>
                        </div>
                    </div>

                    {/* Stat Card 3 - Total Revenue */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-2">Total Revenue</p>
                                <p className="text-3xl lg:text-4xl font-bold text-amber-300">₹{(summary.totalAmount || memberships.reduce((s, m) => s + (m.amount || 0), 0)).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-400/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">₹</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 lg:px-8 py-6 lg:py-8 space-y-6 border-b border-slate-200">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                            <SearchIcon />
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, email, or phone number…"
                            className="w-full pl-12 pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-700 placeholder-slate-400"
                        />
                    </div>

                    {/* Filter Toggle Button (Mobile) */}
                    <div className="lg:hidden flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            <FilterIcon />
                            Filters
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={() => { setQuery(''); setStatusFilter(''); setDepartmentFilter(''); setPaymentFilter(''); }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
                            >
                                <ResetIcon />
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Filters Section */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 ${!showFilters && 'hidden lg:grid'}`}>
                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="PENDING">Pending</option>
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Department</label>
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Departments</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">Payment Mode</label>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Methods</option>
                                {paymentMode.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Desktop Reset Button & Results Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-slate-600">
                            Found <span className="font-semibold text-slate-900">{totalItems}</span> {totalItems === 1 ? 'member' : 'members'}
                            {hasActiveFilters && <span className="text-slate-500"> (filtered)</span>}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex">
                                {hasActiveFilters && (
                                    <button
                                        onClick={() => { setQuery(''); setStatusFilter(''); setDepartmentFilter(''); setPaymentFilter(''); }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
                                    >
                                        <ResetIcon />
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="overflow-hidden">
                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-3 px-6 py-6 lg:px-8 lg:py-8">
                        {currentSlice.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg">No memberships found</p>
                                <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            currentSlice.map((m) => (
                                <div key={m._id} className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                                            {(m.firstName?.[0] || '').toUpperCase()}{(m.lastName?.[0] || '').toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Name and Email */}
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-slate-900 truncate">{m.firstName} {m.lastName}</h3>
                                                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${(m.membershipStatus || '').toLowerCase() === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {m.membershipStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-500">Department</p>
                                                    <p className="font-medium text-slate-900">{m.department || '-'}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-500">Batch</p>
                                                    <p className="font-medium text-slate-900">{m.batchYear || '-'}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-500">Date</p>
                                                    <p className="font-medium text-slate-900">{m.createdAt ? new Date(m.createdAt).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    }) : m.completedAt}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-500">Payment</p>
                                                    <p className="font-medium text-slate-900">{m.paymentId?.gatewayResponse?.mode || '-'}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-500">Amount</p>
                                                    <p className="font-bold text-indigo-600">₹{m.amount}</p>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {currentSlice.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center">
                                            <p className="text-slate-500 text-lg">No memberships found</p>
                                            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    currentSlice.map((m) => (
                                        <tr key={m._id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                        {(m.firstName?.[0] || '').toUpperCase()}{(m.lastName?.[0] || '').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{m.firstName} {m.lastName}</p>
                                                        <p className="text-xs text-slate-500">Batch {m.batchYear || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${(m.membershipStatus || '').toLowerCase() === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : (m.membershipStatus || '').toLowerCase() === 'expired'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {m.membershipStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.paymentId?.gatewayResponse?.mode || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <p className="font-bold text-indigo-600">₹{m.amount}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.createdAt ? new Date(m.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            }) : m.completedAt}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {pageData.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8 px-4 flex-wrap">
                        <button
                            onClick={() => {
                                handlePageChange(Math.max(1, pageData.currentPage - 1));
                            }}
                            disabled={pageData.currentPage === 1}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            ← Prev
                        </button>

                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {(() => {
                                const pages = [];
                                const { totalPages, currentPage } = pageData;
                                const range = 2; // pages before/after current

                                // Always add first page
                                pages.push(1);

                                // Add pages around current
                                const start = Math.max(2, currentPage - range);
                                const end = Math.min(totalPages - 1, currentPage + range);

                                // Add ellipsis if needed
                                if (start > 2) pages.push("...");

                                // Add range
                                for (let i = start; i <= end; i++) pages.push(i);

                                // Add ellipsis if needed
                                if (end < totalPages - 1) pages.push("...");

                                // Always add last page (if more than 1 page)
                                if (totalPages > 1) pages.push(totalPages);

                                return pages.map((page, idx) =>
                                    page === "..." ? (
                                        <span
                                            key={`ellipsis-${idx}`}
                                            className="text-slate-400 px-1"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => {
                                                handlePageChange(page);
                                            }}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pageData.currentPage === page
                                                ? "bg-purple-500 text-white"
                                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                );
                            })()}
                        </div>

                        <button
                            onClick={() => {
                                handlePageChange(
                                    Math.min(pageData.totalPages, pageData.currentPage + 1),
                                );
                            }}
                            disabled={pageData.currentPage === pageData.totalPages}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next →
                        </button>

                        <span className="text-xs text-slate-500 font-medium ml-4">
                            Page {pageData.currentPage} of {pageData.totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipTab;