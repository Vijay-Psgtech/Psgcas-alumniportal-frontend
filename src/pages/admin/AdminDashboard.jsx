// frontend/src/pages/admin/AdminDashboard.jsx - SAFE VERSION
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
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { useData } from "../../context/dataConstants";
import { useAuth } from "../../context/AuthContext";

// Import Refactored Components
import { EventsTab } from "../../components/admin/EventsTab";
import { AlbumsTab } from "../../components/admin/AlbumsTab";
import { AlumniTab } from "../../components/admin/AlumniTab";
import { DonationsTab } from "../../components/admin/DonationsTab";

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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] font-['Outfit',_sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pt-20 pb-16 px-4 sm:px-6 relative overflow-x-hidden font-['Outfit',_sans-serif]">
      {/* Background glowing orb */}
      <div className="absolute -top-44 -right-44 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(201,168,76,.07)_0%,transparent_70%)] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-9 flex-wrap gap-4"
          variants={iv}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="font-['Playfair_Display',_serif] text-[clamp(26px,4vw,40px)] font-extrabold text-[#0c0e1a] tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-md text-gray-500 mt-1 font-medium">
              Manage alumni, donations, events & albums
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border-none rounded-xl font-['Outfit',_sans-serif] text-[13px] font-bold cursor-pointer uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm"
          >
            <LogOut size={14} strokeWidth={2.5} /> Logout
          </motion.button>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2.5 font-['Outfit',_sans-serif] font-medium bg-red-50 border border-red-200 text-red-800 shadow-sm"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={16} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="bg-transparent border-none cursor-pointer text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              className="px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2.5 font-['Outfit',_sans-serif] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={16} className="shrink-0" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          variants={cv}
          initial="hidden"
          animate="visible"
        >
          {STAT_CARDS.map(({ icon, val, label }) => (
            <motion.div
              key={label}
              variants={iv}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-center transition-all hover:-translate-y-1.5 hover:shadow-[0_14px_32px_rgba(0,0,0,.06)] relative overflow-hidden group"
            >
              {/* Top gradient border on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="text-3xl sm:text-4xl mb-3 drop-shadow-sm">
                {icon}
              </div>
              <div className="font-['Playfair_Display',_serif] text-3xl font-extrabold text-blue-500 mb-1 tracking-tight">
                {val}
              </div>
              <div className="text-[12px] text-gray-400 uppercase tracking-widest font-bold font-['Outfit',_sans-serif]">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 mb-6 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(({ key, Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-['Outfit',_sans-serif] text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap
                                    ${activeTab === key ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-md shadow-blue-500/25" : "bg-transparent text-gray-500 hover:bg-slate-50 hover:text-blue-600 border border-transparent hover:border-slate-200"}
                                `}
              >
                <Icon size={15} strokeWidth={activeTab === key ? 2.5 : 2} />
                <span className="font-['Outfit',_sans-serif text-xs sm:text-sm ">
                  {label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${activeTab === key ? "bg-white/25 text-white" : "bg-slate-100 text-gray-400"}`}
                >
                  {badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div
              key="events"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <EventsTab onError={setError} onSuccess={setSuccess} />
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
              <AlbumsTab onError={setError} onSuccess={setSuccess} />
            </motion.div>
          )}
          {activeTab === "alumni" && (
            <motion.div
              key="alumni"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <AlumniTab
                alumniList={alumniList}
                setSelectedItem={setSelectedItem}
              />
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
        </AnimatePresence>

        {/* Detail Modal for Alumni & Donations */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0c0e1a]/60 flex items-center justify-center z-[1000] p-4 sm:p-5 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="bg-white rounded-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 bg-slate-50 hover:bg-slate-100 text-gray-500 transition-colors border-none w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {selectedItem.firstName ? (
                  <>
                    <h2 className="font-['Playfair_Display',_serif] text-[24px] font-extrabold text-[#0c0e1a] mb-6">
                      {selectedItem.firstName} {selectedItem.lastName}
                    </h2>
                    {[
                      {
                        h: "Contact",
                        items: [
                          { l: "Email", v: selectedItem.email },
                          { l: "Phone", v: selectedItem.phone || "N/A" },
                        ],
                      },
                      {
                        h: "Academic",
                        items: [
                          {
                            l: "Department",
                            v: selectedItem.department || "N/A",
                          },
                          {
                            l: "Graduation Year",
                            v: selectedItem.graduationYear || "N/A",
                          },
                        ],
                      },
                    ].map((s) => (
                      <div key={s.h} className="mb-6">
                        <div className="text-[11px] font-extrabold text-[#0c0e1a] tracking-widest uppercase mb-3 font-['Outfit',_sans-serif]">
                          {s.h}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {s.items.map((it) => (
                            <div
                              key={it.l}
                              className="p-3.5 bg-slate-50 rounded-xl border-l-2 border-blue-500 shadow-sm border border-slate-100 border-l-blue-500"
                            >
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide font-['Outfit',_sans-serif]">
                                {it.l}
                              </div>
                              <div className="text-[14px] text-[#0c0e1a] font-semibold mt-1 font-['Outfit',_sans-serif] break-words">
                                {it.v}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2.5 pt-6 border-t border-slate-100 flex-wrap font-['Outfit',_sans-serif]">
                      {!selectedItem.isApproved && (
                        <button
                          onClick={() => handleApprove(selectedItem._id)}
                          className="flex-1 py-3 px-4 border-none rounded-xl bg-emerald-50 text-emerald-700 font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-sm shadow-sm border border-emerald-100"
                        >
                          <CheckCircle size={15} />
                          Approve Alumni
                        </button>
                      )}
                      {selectedItem.isApproved && !selectedItem.isAdmin && (
                        <button
                          onClick={() => handleMakeAdmin(selectedItem._id)}
                          className="flex-1 py-3 px-4 border-none rounded-xl bg-sky-50 text-sky-700 font-bold cursor-pointer hover:bg-sky-100 transition-colors text-sm shadow-sm border border-sky-100"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-6 py-3 border border-slate-200 rounded-xl bg-white text-gray-500 font-bold cursor-pointer hover:bg-slate-50 transition-colors text-sm shadow-sm"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="font-['Playfair_Display',_serif] text-[24px] font-extrabold text-[#0c0e1a] mb-6">
                      Donation Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {[
                        {
                          l: "Amount",
                          v: `${selectedItem.currency === "INR" ? "₹" : "$"}${selectedItem.amount}`,
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
                          className="p-3.5 bg-slate-50 rounded-xl border-l-2 border-emerald-500 shadow-sm border border-slate-100 border-l-emerald-500"
                        >
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide font-['Outfit',_sans-serif]">
                            {it.l}
                          </div>
                          <div className="text-[15px] text-[#0c0e1a] font-bold mt-1 font-['Outfit',_sans-serif]">
                            {it.v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-3 border border-slate-200 rounded-xl bg-white text-gray-500 font-bold cursor-pointer hover:bg-slate-50 transition-colors text-sm font-['Outfit',_sans-serif] shadow-sm"
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
