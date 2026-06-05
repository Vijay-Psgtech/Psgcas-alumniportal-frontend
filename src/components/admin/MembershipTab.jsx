import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from "../../services/api";

export const MembershipTab = ({ onError, onSuccess }) => {
    const [memberships, setMemberships] = useState([]);
    const [summary, setSummary] = useState({ totalMemberships: 0, activeMemberships: 0, totalAmount: 0 });
    const [loading, setLoading] = useState(true);

    // Filters & pagination
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await adminAPI.fetchAllMemberships();
                const data = response?.data || {};
                setMemberships(data.memberships || []);
                setSummary(data.summary || { totalMemberships: (data.memberships || []).length, activeMemberships: 0, totalAmount: 0 });
                if (onSuccess) onSuccess(data.message || 'Memberships loaded');
            } catch (error) {
                console.error('Error fetching memberships:', error);
                if (onError) onError('Failed to load memberships');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, [onError, onSuccess]);

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
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const currentPage = Math.min(page, totalPages);
    const startIdx = (currentPage - 1) * perPage;
    const currentSlice = filtered.slice(startIdx, startIdx + perPage);

    useEffect(() => setPage(1), [statusFilter, departmentFilter, paymentFilter, query, perPage]);

    if (loading) return <div className="p-6 text-center">Loading memberships…</div>;

    return (
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Membership Management</h2>
                        <p className="text-sm text-slate-500 mt-1">Overview, search and manage membership records</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-xs text-slate-400">Total Members</div>
                            <div className="text-lg font-bold text-slate-800">{summary.totalMemberships || memberships.length}</div>
                        </div>
                        <div className="text-right hidden sm:block pl-4 border-l">
                            <div className="text-xs text-slate-400">Active</div>
                            <div className="text-lg font-bold text-emerald-600">{summary.activeMemberships || memberships.filter(m => (m.membershipStatus || '').toLowerCase() === 'active').length}</div>
                        </div>
                        <div className="text-right hidden sm:block pl-4 border-l">
                            <div className="text-xs text-slate-400">Total Amount</div>
                            <div className="text-lg font-bold text-slate-800">{(summary.totalAmount || memberships.reduce((s, m) => s + (m.amount || 0), 0)).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600 w-20">Status</label>
                        <select className="flex-1 border rounded-md px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="ACTIVE">Active</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600 w-20">Department</label>
                        <select className="flex-1 border rounded-md px-3 py-2" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                            <option value="">All</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600 w-20">Payment</label>
                        <select className="flex-1 border rounded-md px-3 py-2" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                            <option value="">All</option>
                            {/* <option value="UPI">UPI</option>
                            <option value="CARD">CARD</option>
                            <option value="NETBANKING">NETBANKING</option> */}
                            {paymentMode.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name, email or phone"
                            className="w-full sm:w-80 border rounded-md px-3 py-2"
                        />
                        <button onClick={() => { setQuery(''); setStatusFilter(''); setDepartmentFilter(''); setPaymentFilter(''); }} className="px-3 py-2 bg-slate-100 rounded-md text-sm">Reset</button>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500">Rows</label>
                        <select className="border rounded-md px-2 py-1" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6">
                {/* Responsive: cards on small screens, table on md+ */}
                <div className="block md:hidden space-y-3">
                    {currentSlice.length === 0 && <div className="text-center text-slate-500 py-6">No memberships found.</div>}
                    {currentSlice.map((m) => (
                        <div key={m._id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                                    {(m.firstName?.[0] || '') + (m.lastName?.[0] || '')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">{m.firstName} {m.lastName}</div>
                                            <div className="text-xs text-slate-500">{m.email}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-semibold ${(m.membershipStatus || '').toLowerCase() === 'active' ? 'text-emerald-600' : 'text-slate-600'}`}>{m.membershipStatus}</div>
                                            <div className="text-sm font-bold">{'₹'}{m.amount}</div>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-2">
                                        <div>Dept: {m.department || '-'}</div>
                                        <div>Batch: {m.batchYear || '-'}</div>
                                        <div>Start: {m.startDate ? new Date(m.startDate).toLocaleDateString() : '-'}</div>
                                        <div>Expiry: {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '-'}</div>
                                        <div>Mode: {m.paymentId?.gatewayResponse?.mode || '-'}</div>
                                        <div>Txn: {m.txnid || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tier</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Start</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expiry</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment Mode</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {currentSlice.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-8 text-center text-slate-500">No memberships found.</td>
                                    </tr>
                                )}

                                {currentSlice.map((m) => (
                                    <tr key={m._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="font-medium text-slate-900">{m.firstName} {m.lastName}</div>
                                            <div className="text-xs text-slate-500">Batch {m.batchYear || '-'}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.email}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.phone}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.department}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.tier}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(m.membershipStatus || '').toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{m.membershipStatus}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.startDate ? new Date(m.startDate).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">{'₹'}{m.amount}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{m.paymentId?.gatewayResponse?.mode || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-600">Showing <span className="font-medium text-slate-800">{startIdx + 1}</span> to <span className="font-medium text-slate-800">{Math.min(startIdx + currentSlice.length, totalItems)}</span> of <span className="font-medium text-slate-800">{totalItems}</span></div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md border" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                    <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{i + 1}</button>
                        ))}
                    </div>
                    <button className="px-3 py-1 rounded-md border" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default MembershipTab;