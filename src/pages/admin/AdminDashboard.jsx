// frontend/src/pages/admin/AdminDashboard.jsx - WITH DEPARTMENTS
// ✅ Added Department Management Tab
// ✅ Fixed SubAdminTab import
// ✅ Works even if donationsAPI is missing
// ✅ Falls back gracefully

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Users,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Camera,
  BookOpen,
  Shield,
} from "lucide-react";
import { adminAPI, API_BASE } from "../../services/api";
import { useData } from "../../context/dataConstants";
import { useAuth } from "../../context/AuthContext";

// Import Refactored Components
import { EventsTab } from "../../components/admin/EventsTab";
import { AlbumsTab } from "../../components/admin/AlbumsTab";
import { AlumniTab } from "../../components/admin/AlumniTab";
import { DonationsTab } from "../../components/admin/DonationsTab";
import DepartmentTab from "../../components/admin/DepartmentTab";
import SubAdminTab from "../../components/admin/SubAdminTab";

// ✅ Safe import with fallback
const donationsAPI = {
  getAll:
    adminAPI.getAllDonations ||
    (() => Promise.resolve({ data: { donations: [] } })),
};

// INR Format
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { albumsData } = useData();
  const [activeTab, setActiveTab] = useState("alumni");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alumniList, setAlumniList] = useState([]);
  const [donationList, setDonationList] = useState([]);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    pendingAlumni: 0,
    totalDonatedAmount: 0,
    completedDonations: 0,
    totalEvents: 0,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const iv = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };
  const cv = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, alumniRes, donationsRes] = await Promise.all([
          adminAPI.getStats().catch((err) => {
            console.error("Stats error:", err);
            return {
              data: {
                stats: {
                  totalAlumni: 0,
                  pendingAlumni: 0,
                  totalDonatedAmount: 0,
                  completedDonations: 0,
                  totalEvents: 0,
                },
              },
            };
          }),
          adminAPI.getAllAlumni().catch((err) => {
            console.error("Alumni error:", err);
            return { data: { alumni: [] } };
          }),
          donationsAPI.getAll().catch((err) => {
            console.error("Donations error:", err);
            return { data: { donations: [] } };
          }),
        ]);

        setStats(statsRes.data.stats || {});
        setAlumniList(alumniRes.data.alumni || []);
        setDonationList(donationsRes.data.donations || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin");
  }, [logout, navigate]);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveAlumni(id);
      setSuccess("Alumni approved!");
      setSelectedItem(null);
      const r = await adminAPI.getAllAlumni();
      setAlumniList(r.data.alumni || []);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await adminAPI.makeAlumniAdmin(id);
      setSuccess("Admin privileges granted!");
      setSelectedItem(null);
      const r = await adminAPI.getAllAlumni();
      setAlumniList(r.data.alumni || []);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  const totalAlbums = Object.values(albumsData).reduce(
    (s, y) => s + y.albums.length,
    0,
  );

  // ✅ ADDED DEPARTMENTS & SUB-ADMINS TABS
  const TABS = [
    { key: "alumni", Icon: Users, label: "Alumni", badge: stats.totalAlumni },
    {
      key: "donations",
      Icon: FileText,
      label: "Donations",
      badge: formatINR(stats.totalDonatedAmount),
    },
    {
      key: "events",
      Icon: Calendar,
      label: "Events",
      badge: stats.totalEvents,
    },
    { key: "albums", Icon: Camera, label: "Albums", badge: totalAlbums },
    { key: "departments", Icon: BookOpen, label: "Departments", badge: "✨" },
    { key: "subAdmins", Icon: Shield, label: "Sub Admins", badge: "👤" },
  ];

  const STAT_CARDS = [
    { icon: "👥", val: stats.totalAlumni, label: "Total Alumni" },
    { icon: "⏳", val: stats.pendingAlumni, label: "Pending Approval" },
    {
      icon: "💰",
      val: formatINR(stats.totalDonatedAmount),
      label: "Total Donations",
    },
    { icon: "✅", val: stats.completedDonations, label: "Completed" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] font-['Outfit',sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pt-26 pb-16 px-4 sm:px-6 relative overflow-x-hidden font-['Outfit',sans-serif]">
      {/* Background glowing orb */}
      <div className="absolute -top-44 -right-44 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(201,168,76,.07)_0%,transparent_70%)] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-9 flex-wrap gap-4"
          variants={iv}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="font-['Playfair_Display',serif] text-[clamp(26px,4vw,40px)] font-extrabold text-[#0c0e1a] tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Manage alumni, events, and donations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg hover:shadow-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          variants={cv}
          initial="hidden"
          animate="visible"
        >
          {STAT_CARDS.map((card, i) => (
            <motion.div
              key={i}
              variants={iv}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">
                    {card.label}
                  </p>
                  <p className="text-[clamp(20px,3vw,32px)] font-bold text-[#0c0e1a] mt-2">
                    {card.val}
                  </p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200"
            >
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-green-50 border border-green-200"
            >
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Tab List */}
          <div className="flex gap-1 p-2 border-b border-slate-200 overflow-x-auto scrollbar-hide">
            {TABS.map(({ key, Icon, label, badge }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap font-semibold text-sm transition-all ${
                  activeTab === key
                    ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                {label}
                {badge && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">
                    {badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "alumni" && (
                <motion.div
                  key="alumni"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <AlumniTab
                    setSelectedItem={setSelectedItem}
                    alumniList={alumniList}
                  />
                </motion.div>
              )}
              {activeTab === "events" && (
                <motion.div
                  key="events"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <EventsTab />
                </motion.div>
              )}
              {activeTab === "albums" && (
                <motion.div
                  key="albums"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <AlbumsTab />
                </motion.div>
              )}
              {activeTab === "donations" && (
                <motion.div
                  key="donations"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <DonationsTab
                    donationList={donationList}
                    setSelectedItem={setSelectedItem}
                  />
                </motion.div>
              )}
              {/* ✅ NEW DEPARTMENTS TAB */}
              {activeTab === "departments" && (
                <motion.div
                  key="departments"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <DepartmentTab onError={setError} onSuccess={setSuccess} />
                </motion.div>
              )}
              {/* ✅ NEW SUB-ADMINS TAB */}
              {activeTab === "subAdmins" && (
                <motion.div
                  key="subAdmins"
                  variants={iv}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <SubAdminTab
                    onError={setError}
                    onSuccess={setSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail Modal for Alumni & Donations */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0c0e1a]/60 flex items-center justify-center z-1000 p-4 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] overflow-y-auto p-7 relative shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 bg-slate-50 hover:bg-slate-100 text-gray-500 transition border w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {/* Alumni View */}
                {selectedItem.firstName ? (
                  <>
                    {/* Header with Profile Image */}
                    <div className="flex items-center gap-4 mb-7 pb-5 border-b border-slate-100">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {selectedItem.profileImage ? (
                          <img
                            src={`${API_BASE}/${selectedItem.profileImage}`}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          `${selectedItem.firstName?.[0] || ""}${
                            selectedItem.lastName?.[0] || ""
                          }`
                        )}
                      </div>

                      <div>
                        <h2 className="text-[22px] font-bold text-[#0c0e1a] font-['Playfair_Display']">
                          {selectedItem.firstName} {selectedItem.lastName}
                        </h2>

                        <p className="text-sm text-gray-500 font-medium">
                          {selectedItem.department || "Department N/A"} •{" "}
                          {selectedItem.batchYear || "Year N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { l: "Email", v: selectedItem.email },
                        { l: "Phone", v: selectedItem.phone || "N/A" },
                        {
                          l: "Company",
                          v: selectedItem.currentCompany || "N/A",
                        },
                        { l: "Job Title", v: selectedItem.jobTitle || "N/A" },
                        { l: "City", v: selectedItem.city || "N/A" },
                        { l: "Country", v: selectedItem.country || "N/A" },
                      ].map((it) => (
                        <div
                          key={it.l}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-sm transition"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                            {it.l}
                          </p>

                          <p className="text-[14px] font-semibold text-[#0c0e1a] mt-1 wrap-break-word">
                            {it.v}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* LinkedIn */}
                    {selectedItem.linkedin && (
                      <a
                        href={selectedItem.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View LinkedIn Profile
                      </a>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-slate-100">
                      {!selectedItem.isApproved && (
                        <button
                          onClick={() => handleApprove(selectedItem._id)}
                          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                        >
                          Approve Alumni
                        </button>
                      )}

                      {selectedItem.isApproved && !selectedItem.isAdmin && (
                        <button
                          onClick={() => handleMakeAdmin(selectedItem._id)}
                          className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                        >
                          Make Admin
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Donation View */}
                    <h2 className="text-[22px] font-bold text-[#0c0e1a] mb-6 font-['Playfair_Display']">
                      Donation Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {[
                        {
                          l: "Amount",
                          v: `${
                            selectedItem.currency === "INR" ? "₹" : "$"
                          }${selectedItem.amount}`,
                        },
                        { l: "Status", v: selectedItem.status },
                        {
                          l: "Date",
                          v: new Date(selectedItem.donatedAt).toLocaleString(),
                        },
                        { l: "Payment Method", v: selectedItem.paymentMethod },
                      ].map((it) => (
                        <div
                          key={it.l}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                            {it.l}
                          </p>

                          <p className="text-[15px] font-bold text-[#0c0e1a] mt-1">
                            {it.v}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;