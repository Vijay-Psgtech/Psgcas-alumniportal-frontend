import React, { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  GraduationCap,
  Building2,
  Mail,
  ExternalLink,
  ChevronRight,
  Users,
  Crown,
  Briefcase,
  Zap,
  Building2Icon,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AlumniTab = ({ alumniList, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'approved'

  const filtered = alumniList.filter((a) => {
    const matchesSearch =
      `${a.firstName} ${a.lastName} ${a.email} ${a.department || ""} ${a.batchYear || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && a.isApproved) ||
      (statusFilter === "pending" && !a.isApproved);
    return matchesSearch && matchesStatus;
  });

  // Dynamic gradient generator based on initials for a premium feel
  const getAvatarGradient = (firstName, lastName) => {
    const charCode =
      (firstName?.charCodeAt(0) || 0) + (lastName?.charCodeAt(0) || 0);
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-emerald-500 to-teal-600",
      "from-orange-400 to-red-500",
      "from-cyan-400 to-blue-500",
      "from-indigo-500 to-purple-600",
    ];
    return gradients[charCode % gradients.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

   const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-6"
    >
      {/* Rich Search Input & Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[22px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-center shadow-sm transition-all duration-300 focus-within:shadow-xl focus-within:border-white/50">
            <div className="bg-slate-50 p-2 rounded-xl group-focus-within:bg-blue-50 transition-colors">
              <Search
                size={20}
                className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
            </div>
            <input
              placeholder="Search by name, email, department, or year…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-none py-1 font-['Outfit',_sans-serif] text-[16px] outline-none text-slate-700 bg-transparent placeholder-slate-400"
            />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-400 font-['Outfit',_sans-serif] uppercase tracking-wider">
              {filtered.length} Results
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 px-1">
          {[
            { id: "all", label: "All Alumni", icon: Users },
            { id: "pending", label: "Pending", icon: Clock },
            { id: "approved", label: "Approved", icon: CheckCircle },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold font-['Outfit',_sans-serif] transition-all duration-300 border ${
                statusFilter === btn.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <btn.icon
                size={14}
                className={
                  statusFilter === btn.id ? "text-white" : "text-slate-400"
                }
              />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.div
                key={a._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                layout
                whileHover={{ y: -6 }}
                onClick={() => setSelectedItem(a)}
                className="group bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-lg">
                      {a.profileImage ? (
                        <img
                          src={`${API_BASE}/${a.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                      `${a.firstName?.charAt(0)}
                      ${a.lastName?.charAt(0)}`)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Status */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-800 truncate">
                        {a.firstName} {a.lastName}
                      </h3>

                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                          a.isApproved
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {a.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    {/* Email */}
                    <p className="text-sm text-slate-500 truncate mb-3">
                      {a.email}
                    </p>

                    {/* Dept + Batch */}
                    <div className="flex gap-6 text-sm mb-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Building2 size={14} />
                        {a.department || "N/A"}
                      </div>

                      <div className="flex items-center gap-1 text-slate-600">
                        <GraduationCap size={14} />
                        {a.batchYear || "N/A"}
                      </div>
                    </div>

                    {/* Comapny + title*/}
                    {a.currentCompany && (
                      <div className="flex gap-6 text-sm mb-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Briefcase size={14} />
                        {a.jobTitle || "N/A"}
                      </div>

                      <div className="flex items-center gap-1 text-slate-600">
                        <Building2Icon size={14} />
                        {a.currentCompany || "N/A"}
                      </div>
                    </div>
                    )}

                    {/* Location */}
                  {a.city && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                      {a.city}
                      {a.country && `, ${a.country}`}
                    </div>
                  )}

                    {/* Actions */}
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition mt-2">
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        View
                      </button>

                      {!a.isApproved && (
                        <button className="text-green-600 text-sm font-medium hover:underline">
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-6 bg-white border-2 border-dashed border-slate-200 rounded-[32px] font-['Outfit',_sans-serif] flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 scale-150"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 border border-white rounded-[24px] shadow-sm flex items-center justify-center">
              <Search size={32} className="text-slate-300" />
            </div>
          </div>
          <h4 className="text-xl font-extrabold text-slate-800 mb-2">
            No results found
          </h4>
          <p className="text-slate-500 max-w-[280px] text-[15px] font-medium">
            We couldn't find any alumni matching "
            <span className="text-blue-500 italic font-bold">{searchTerm}</span>
            "
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Clear Search
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
