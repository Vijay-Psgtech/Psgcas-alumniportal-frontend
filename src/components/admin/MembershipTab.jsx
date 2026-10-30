import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from "../../services/api";
import {
    BadgeCheck,
    Building2,
    CalendarDays,
    CreditCard,
    Download,
    GraduationCap,
    IndianRupee,
    Mail,
    Phone,
    RotateCcw,
    Search,
    SlidersHorizontal,
    UsersRound,
} from 'lucide-react';

export const MembershipTab = ({ onError }) => {
    const [memberships, setMemberships] = useState([]);
    const [allMemberships, setAllMemberships] = useState([]);
    const [summary, setSummary] = useState({ totalMemberships: 0, activeMemberships: 0, totalAmount: 0 });
    const [loading, setLoading] = useState(true);

    // Filters & pagination
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
                const [pageResponse, allResponse] = await Promise.all([
                    adminAPI.fetchAllMemberships({
                        membershipStatus: 'ACTIVE',
                        page: 1,
                        limit: 20,
                    }),
                    adminAPI.fetchAllMemberships({
                        membershipStatus: 'ACTIVE',
                        page: 1,
                        limit: 10000,
                    }),
                ]);

                const pageDataResponse = pageResponse?.data || {};
                const allDataResponse = allResponse?.data || {};

                setPageData({
                    currentPage: pageDataResponse.currentPage || 1,
                    totalPages: pageDataResponse.totalPages || 1,
                });
                setMemberships(pageDataResponse.memberships || []);
                setAllMemberships(allDataResponse.memberships || []);
                setSummary(pageDataResponse.summary || allDataResponse.summary || { totalMemberships: (pageDataResponse.memberships || []).length, activeMemberships: 0, totalAmount: 0 });
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
                membershipStatus: 'ACTIVE',
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

    const filterMemberships = (items) => {
        const q = query.trim().toLowerCase();
        return (items || []).filter((m) => {
            if ((m.membershipStatus || '').toUpperCase() !== 'ACTIVE') return false;
            if (departmentFilter && (m.department || '').toLowerCase() !== departmentFilter.toLowerCase()) return false;
            const mode = m.paymentId?.gatewayResponse?.mode || '';
            if (paymentFilter && mode.toLowerCase() !== paymentFilter.toLowerCase()) return false;
            if (!q) return true;
            const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
            return fullName.includes(q) || (m.email || '').toLowerCase().includes(q) || (m.phone || '').toLowerCase().includes(q);
        });
    };

    const filtered = useMemo(() => filterMemberships(memberships), [memberships, departmentFilter, paymentFilter, query]);
    const filteredForExport = useMemo(() => filterMemberships(allMemberships), [allMemberships, departmentFilter, paymentFilter, query]);

    const totalItems = filtered.length;
    const currentSlice = filtered;

    const hasActiveFilters = departmentFilter || paymentFilter || query;
    const activeMemberCount = summary.activeMemberships
        ?? memberships.filter((m) => (m.membershipStatus || '').toUpperCase() === 'ACTIVE').length;
    const totalRevenue = summary.totalAmount
        ?? memberships.reduce((sum, member) => sum + (member.amount || 0), 0);

    const escapeCsvValue = (value) => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (/[",\r\n]/.test(stringValue)) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const handleExportCSV = () => {
        const exportItems = filteredForExport;
        if (exportItems.length === 0) return;

        const headers = [
            'Transaction ID',
            'Transaction Date and Time',
            'Alumni Name',
            'Batch Details (Year of Joining - Year of Completion)',
            'Department / Subject',
            'Email Address',
            'Contact Number',
            'Complete Postal Address (including PIN Code)',
            'Current Professional Designation',
            'Organization / Institution / Company',
            'Professional Location',
        ];
        const rows = exportItems.map((m) => {
            const alumni = m.alumniId || {};
            const payment = m.paymentId || {};
            const transactionDate = payment.completedAt || m.createdAt;
            const parsedTransactionDate = transactionDate ? new Date(transactionDate) : null;
            const transactionDateTime = parsedTransactionDate
                && !Number.isNaN(parsedTransactionDate.getTime())
                ? parsedTransactionDate.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })
                : '';
            const degree = (alumni.degree || '').trim();
            const department = (m.department || alumni.department || '').trim();
            const departmentSubject = degree && department
                && !degree.toLowerCase().includes(department.toLowerCase())
                ? `${degree} ${department}`
                : degree || department;
            const postalAddressParts = [
                alumni.fullAddress,
                m.address?.street,
                m.address?.line1,
                m.address?.line2,
                m.address?.city,
                m.address?.state,
                m.address?.pincode,
                m.address?.country,
            ].map((part) => (part || '').trim()).filter(Boolean);
            const postalAddress = postalAddressParts.reduce((address, part) => {
                if (address.toLowerCase().includes(part.toLowerCase())) return address;
                return address ? `${address}, ${part}` : part;
            }, '');
            const officeAddress = alumni.officeAddress || {};
            const professionalLocation = [
                officeAddress.line1,
                officeAddress.line2,
                officeAddress.city || alumni.city,
                officeAddress.state,
                officeAddress.pincode,
                officeAddress.country || alumni.country,
            ].filter(Boolean).join(', ');

            return [
                payment.txnid || m.txnid || '',
                transactionDateTime,
                `${m.firstName || alumni.firstName || ''} ${m.lastName || alumni.lastName || ''}`.trim(),
                [alumni.studyStartYear, alumni.studyEndYear].filter(Boolean).join('-'),
                departmentSubject,
                m.email || alumni.email || '',
                m.phone || alumni.phone || '',
                postalAddress,
                alumni.jobTitle || alumni.occupation || '',
                alumni.currentCompany || '',
                professionalLocation,
            ].map(escapeCsvValue);
        });

        const csvContent = [
            headers.map(escapeCsvValue).join(','),
            ...rows.map((row) => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ActiveMemberships.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p className="text-slate-600 font-medium">Loading memberships…</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-5">
            <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active membership overview
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Memberships</h1>
                    <p className="mt-1 text-sm text-slate-500">Review active alumni and membership revenue.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:w-[min(100%,26rem)] sm:gap-4">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Active members</p>
                            <span className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                                <UsersRound size={17} />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{activeMemberCount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Total revenue</p>
                            <span className="rounded-lg bg-white p-2 text-blue-700 shadow-sm">
                                <IndianRupee size={17} />
                            </span>
                        </div>
                        <p className="mt-2 truncate text-2xl font-bold tabular-nums text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="space-y-4 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Find a member</h2>
                            <p className="mt-0.5 text-sm text-slate-500">Search and filter the active membership list.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <p className="text-sm text-slate-500">
                                <span className="font-semibold text-slate-900">{totalItems}</span> {totalItems === 1 ? 'member' : 'members'}
                                {hasActiveFilters && <span className="text-slate-400"> · filtered</span>}
                            </p>
                            <button
                                onClick={handleExportCSV}
                                disabled={filteredForExport.length === 0 || loading}
                                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export CSV</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row">
                        <label className="relative block min-w-0 flex-1">
                            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search name, email, or phone"
                                aria-label="Search active members"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-3 lg:w-[min(100%,30rem)]">
                            <label className={`${showFilters ? 'block' : 'hidden'} space-y-1.5 lg:block`}>
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</span>
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    aria-label="Filter by department"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="">All departments</option>
                                    {departments.map((department) => <option key={department} value={department}>{department}</option>)}
                                </select>
                            </label>
                            <label className={`${showFilters ? 'block' : 'hidden'} space-y-1.5 lg:block`}>
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment mode</span>
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    aria-label="Filter by payment mode"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="">All methods</option>
                                    {paymentMode.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="flex gap-2 lg:hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                aria-expanded={showFilters}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <SlidersHorizontal size={16} />
                                {showFilters ? 'Hide filters' : 'Filters'}
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => { setQuery(''); setDepartmentFilter(''); setPaymentFilter(''); }}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    <RotateCcw size={15} />
                                    Reset
                                </button>
                            )}
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={() => { setQuery(''); setDepartmentFilter(''); setPaymentFilter(''); }}
                                className="hidden items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
                            >
                                <RotateCcw size={15} />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 p-3 sm:p-5">
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                        {currentSlice.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                                <UsersRound className="mx-auto mb-3 text-slate-300" size={30} />
                                <p className="font-semibold text-slate-700">No active memberships found</p>
                                <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                            </div>
                        ) : currentSlice.map((m) => {
                            const initials = `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase();
                            const transactionDate = m.paymentId?.completedAt || m.createdAt;

                            return (
                                <article key={m._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                                {initials || 'A'}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-slate-900">{m.firstName} {m.lastName}</h3>
                                                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                                                    <Mail size={13} className="shrink-0" />
                                                    {m.email || 'Email unavailable'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                            <BadgeCheck size={13} />
                                            Active
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 p-4">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Department</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                                                <Building2 size={14} className="shrink-0 text-slate-400" />
                                                <span className="truncate">{m.department || '-'}</span>
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Batch</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                                                <GraduationCap size={15} className="shrink-0 text-slate-400" />
                                                <span>{m.batchYear || '-'}</span>
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Contact</p>
                                            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-medium text-slate-800">
                                                <Phone size={14} className="shrink-0 text-slate-400" />
                                                <span className="truncate">{m.phone || '-'}</span>
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Payment</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                                                <CreditCard size={14} className="shrink-0 text-slate-400" />
                                                <span className="truncate">{m.paymentId?.gatewayResponse?.mode || '-'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Transaction</p>
                                            <p className="mt-1 flex items-center gap-1.5 truncate font-mono text-xs text-slate-600">
                                                <span className="truncate">{m.txnid || '-'}</span>
                                            </p>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                <CalendarDays size={13} />
                                                {transactionDate ? new Date(transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Paid</p>
                                            <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">₹{Number(m.amount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {['Member', 'Contact', 'Department & batch', 'Payment', 'Transaction', 'Date', 'Amount'].map((heading) => (
                                            <th key={heading} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{heading}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentSlice.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-14 text-center">
                                                <UsersRound className="mx-auto mb-3 text-slate-300" size={30} />
                                                <p className="font-semibold text-slate-700">No active memberships found</p>
                                                <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                                            </td>
                                        </tr>
                                    ) : currentSlice.map((m) => {
                                        const initials = `${m.firstName?.[0] || ''}${m.lastName?.[0] || ''}`.toUpperCase();
                                        const transactionDate = m.paymentId?.completedAt || m.createdAt;

                                        return (
                                            <tr key={m._id} className="transition-colors hover:bg-slate-50/80">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-100">{initials || 'A'}</div>
                                                        <div className="min-w-0">
                                                            <p className="max-w-[13rem] truncate text-sm font-semibold text-slate-900">{m.firstName} {m.lastName}</p>
                                                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                                <BadgeCheck size={12} /> Active
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="flex max-w-[14rem] items-center gap-2 truncate text-sm text-slate-700"><Mail size={14} className="shrink-0 text-slate-400" />{m.email || '-'}</p>
                                                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Phone size={13} className="shrink-0 text-slate-400" />{m.phone || '-'}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="max-w-[12rem] truncate text-sm font-medium text-slate-800">{m.department || '-'}</p>
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><GraduationCap size={14} />Batch {m.batchYear || '-'}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                                                        <CreditCard size={13} className="text-slate-500" />
                                                        {m.paymentId?.gatewayResponse?.mode || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="max-w-[10rem] truncate font-mono text-xs text-slate-700">{m.txnid || '-'}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                                    {transactionDate ? new Date(transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold tabular-nums text-slate-900">
                                                    ₹{Number(m.amount || 0).toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination Section */}
                {pageData.totalPages > 1 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <button
                            onClick={() => {
                                handlePageChange(Math.max(1, pageData.currentPage - 1));
                            }}
                            disabled={pageData.currentPage === 1}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                ? "bg-slate-900 text-white"
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
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next →
                        </button>

                        <span className="text-xs text-slate-500 font-medium ml-4">
                            Page {pageData.currentPage} of {pageData.totalPages}
                        </span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MembershipTab;