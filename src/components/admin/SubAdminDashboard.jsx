// frontend/src/pages/admin/SubAdminDashboard.jsx
// Department-scoped dashboard for sub-admins (HODs / coordinators)
// FIXED: Proper role verification, authorization, and department-scoped access

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Clock, CheckCircle, XCircle, Eye, RefreshCw,
  Building2, GraduationCap, Search, Filter, Shield,
  UserCheck, Inbox, ChevronRight, X, BadgeCheck, Trash2,
  AlertCircle, LogOut,
} from "lucide-react";
import { subAdminAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bg} rounded-2xl p-5 flex items-center gap-4`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-white/70 shadow-sm shrink-0`}>
      <Icon size={22} />
    </div>
    <div>
      <div className="text-2xl font-bold text-[#0c0e1a]">{value ?? "—"}</div>
      <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ALUMNI DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AlumniDetailModal = ({ alumni, onClose, onApprove, onReject, loading }) => {
  if (!alumni) return null;
  
  const field = (label, val) =>
    val ? (
      <div key={label}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <p className="text-sm text-slate-700 font-medium mt-0.5">{val}</p>
      </div>
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0c0e1a]/60 z-1000 flex items-center justify-center p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(12,14,26,0.25)]"
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-slate-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-xl font-bold shrink-0">
              {alumni.firstName?.[0]}{alumni.lastName?.[0]}
            </div>
            <div>
              <h2 className="font-['Playfair_Display',serif] text-[20px] font-extrabold text-[#0c0e1a]">
                {alumni.firstName} {alumni.lastName}
              </h2>
              <p className="text-sm text-slate-400">{alumni.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 rounded-xl w-8 h-8 flex items-center justify-center transition shrink-0">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Status badge */}
        <div className="px-7 pt-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${alumni.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {alumni.isApproved ? <><CheckCircle size={12} /> Approved</> : <><Clock size={12} /> Pending Approval</>}
          </span>
        </div>

        {/* Details grid */}
        <div className="px-7 py-5 grid grid-cols-2 gap-4">
          {field("Department", alumni.department)}
          {field("Degree", alumni.degree)}
          {field("Graduation Year", alumni.graduationYear)}
          {field("Batch", alumni.batch)}
          {field("Phone", alumni.phone)}
          {field("City", alumni.city)}
          {field("State", alumni.state)}
          {field("Country", alumni.country)}
          {field("Current Company", alumni.currentCompany)}
          {field("Job Title", alumni.jobTitle)}
          {field("LinkedIn", alumni.linkedIn)}
        </div>

        {/* Actions — only shown for pending */}
        {!alumni.isApproved && (
          <div className="px-7 pb-7 flex gap-3">
            <button
              onClick={() => onApprove(alumni._id)}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition ${
                loading ? "bg-green-200 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20"
              }`}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <UserCheck size={14} />}
              Approve
            </button>
            <button
              onClick={() => onReject(alumni._id)}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition border ${
                loading ? "border-slate-200 text-slate-300 cursor-not-allowed" : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <Trash2 size={14} />
              Reject
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UNAUTHORIZED ACCESS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const UnauthorizedScreen = ({ navigate }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
    <div className="text-center max-w-md">
      <div className="mb-4 flex justify-center">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#0c0e1a] mb-2">Access Denied</h1>
      <p className="text-slate-600 mb-6">
        You don't have permission to access the Sub-Admin Dashboard. Only sub-admins can view this page.
      </p>
      <button
        onClick={() => navigate("/alumni/profile")}
        className="px-6 py-2.5 bg-[#667eea] text-white rounded-lg font-semibold hover:bg-[#764ba2] transition"
      >
        Go to Profile
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const SubAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ─ AUTHORIZATION CHECK ─
  const isAuthorized = user?.role === "subAdmin" || user?.isSubAdmin;
  
  const [stats, setStats] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      } else {
        setRefreshing(true);
      }

      const [statsRes, alumniRes] = await Promise.all([
        subAdminAPI.getDepartmentStats(),
        subAdminAPI.getDepartmentAlumni(statusFilter),
      ]);

      setStats(statsRes.data?.data || null);
      setAlumni(alumniRes.data?.data?.alumni || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load data";
      
      // Handle authorization errors
      if (err.response?.status === 403) {
        setError("You don't have permission to access this data.");
        showToast(errorMsg, "error");
      } else {
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
      
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [fetchData, isAuthorized]);

  const handleApprove = async (alumniId) => {
    try {
      setActionLoading(true);
      await subAdminAPI.approve(alumniId);
      showToast("Alumni approved successfully!");
      setSelectedAlumni(null);
      fetchData(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to approve";
      showToast(errorMsg, "error");
      console.error("Approve error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (alumniId) => {
    if (!window.confirm("Are you sure you want to reject this registration? This cannot be undone.")) {
      return;
    }
    try {
      setActionLoading(true);
      await subAdminAPI.reject(alumniId);
      showToast("Registration rejected and removed.");
      setSelectedAlumni(null);
      fetchData(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to reject";
      showToast(errorMsg, "error");
      console.error("Reject error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((a) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      String(a.graduationYear).includes(q)
    );
  });

  const department = stats?.department;

  // ─ RENDER UNAUTHORIZED SCREEN ─
  if (!isAuthorized) {
    return <UnauthorizedScreen navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-[72px]">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-2000 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${
              toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-7">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-[#667eea]" />
              <span className="text-xs font-bold text-[#667eea] uppercase tracking-widest">Sub-Admin Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0c0e1a] font-['Playfair_Display',serif]">
              {department?.name || "Department"} Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, <strong>{user?.firstName}</strong>. Manage your department's alumni registrations below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {department && (
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">{department.programmeType}</span>
                <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">{department.fundingType}</span>
              </div>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              icon={Users} 
              label="Total Alumni" 
              value={stats?.stats?.total} 
              color="text-[#667eea]" 
              bg="bg-white border border-slate-200" 
            />
            <StatCard 
              icon={Clock} 
              label="Pending Approval" 
              value={stats?.stats?.pending} 
              color="text-amber-600" 
              bg="bg-amber-50 border border-amber-100" 
            />
            <StatCard 
              icon={BadgeCheck} 
              label="Approved" 
              value={stats?.stats?.approved} 
              color="text-green-600" 
              bg="bg-green-50 border border-green-100" 
            />
          </div>
        )}

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search alumni by name, email or year…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {[
              { key: "all", label: "All", count: stats?.stats?.total },
              { key: "pending", label: "Pending", count: stats?.stats?.pending },
              { key: "approved", label: "Approved", count: stats?.stats?.approved },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition border whitespace-nowrap ${
                  statusFilter === key
                    ? "bg-[#667eea] text-white border-[#667eea] shadow-md shadow-[#667eea]/20"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {label} {count !== undefined && `(${count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Alumni table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 flex justify-center">
            <RefreshCw size={22} className="animate-spin text-[#667eea]" />
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
            <Inbox size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">
              {search ? "No alumni match your search" : `No ${statusFilter !== "all" ? statusFilter : ""} alumni in your department`}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                {filteredAlumni.length} alumni found
              </span>
              {statusFilter === "pending" && stats?.stats?.pending > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold">
                  {stats.stats.pending} awaiting review
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Alumni</th>
                    <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Degree</th>
                    <th className="px-5 py-3.5 text-center font-semibold text-slate-500 text-xs uppercase tracking-wide">Year</th>
                    <th className="px-5 py-3.5 text-center font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 text-right font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlumni.map((a, idx) => (
                    <motion.tr
                      key={a._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">
                            {a.firstName?.[0]}{a.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-700">{a.firstName} {a.lastName}</div>
                            <div className="text-xs text-slate-400">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{a.degree || "—"}</td>
                      <td className="px-5 py-3.5 text-center text-slate-600">{a.graduationYear || "—"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          a.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {a.isApproved ? (
                            <><CheckCircle size={11} /> Approved</>
                          ) : (
                            <><Clock size={11} /> Pending</>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAlumni(a)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                            title="View profile"
                          >
                            <Eye size={15} />
                          </button>
                          {!a.isApproved && (
                            <>
                              <button
                                onClick={() => handleApprove(a._id)}
                                disabled={actionLoading}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Approve"
                              >
                                <UserCheck size={15} />
                              </button>
                              <button
                                onClick={() => handleReject(a._id)}
                                disabled={actionLoading}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Info notice */}
        <p className="text-center text-xs text-slate-500 pb-4 italic">
          You can only view and manage alumni registered under <strong>{department?.name || "your department"}</strong>.
          <br />
          <span className="text-slate-400">Contact a super-admin for cross-department access.</span>
        </p>
      </div>

      {/* Alumni detail modal */}
      <AnimatePresence>
        {selectedAlumni && (
          <AlumniDetailModal
            alumni={selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubAdminDashboard;