import React, { useState, useRef } from "react";
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
  Building,
  Calendar,
  XCircle,
  Linkedin,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { a } from "framer-motion/client";

export const AlumniTab = ({ alumniList, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'approved'
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const alumniRef = useRef(null);

  const departments = Array.from(
    new Set(alumniList.map((a) => a.department).filter(Boolean)),
  ).sort();
  const batches = Array.from(
    new Set(alumniList.map((a) => a.batchYear).filter(Boolean)),
  ).sort((a, b) => String(b).localeCompare(String(a)));

  const filtered = alumniList.filter((a) => {
    const matchesSearch =
      `${a.firstName} ${a.lastName} ${a.email} ${a.department || ""} ${a.batchYear || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && a.isApproved) ||
      (statusFilter === "pending" && !a.isApproved);
    const matchesDept = !deptFilter || a.department === deptFilter;
    const matchesBatch =
      !batchFilter || String(a.batchYear) === String(batchFilter);
    return matchesSearch && matchesStatus && matchesDept && matchesBatch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumni = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, deptFilter, batchFilter]);

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
      <div ref={alumniRef} className="flex flex-col gap-4">
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

        {/* Dept & Batch Filters */}
        <div className="flex items-center gap-3 px-1">
          <div className="relative">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {(deptFilter || batchFilter) && (
            <button
              onClick={() => {
                setDeptFilter("");
                setBatchFilter("");
              }}
              className="ml-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold"
            >
              Clear
            </button>
          )}
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
        <>
          <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {paginatedAlumni.map((a, i) => {
              const photo = a.files?.currentPhoto || a.profileImage;
              return (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {photo ? (
                        <img
                          src={`${API_BASE}/uploads/${photo}`}
                          alt={`${a.firstName} ${a.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {a.firstName[0]}
                          {a.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {a.firstName} {a.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {a.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            a.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {a.isApproved ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {a.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {a.department.toUpperCase()}
                      </span>
                      <span className="text-gray-400">•</span>
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">{a.batchYear}</span>
                    </div>

                    {a.currentCompany && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {a.jobTitle} at {a.currentCompany}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600 truncate">
                        {a.city}, {a.country}
                      </span>
                    </div>

                    {a.linkedin && (
                      <a
                        href={a.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin size={14} />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!a.isApproved && (
                      <button
                        onClick={() => setSelectedItem(a)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedItem(a)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 px-4 flex-wrap">
              <button
                onClick={() => {
                  alumniRef.current.scrollIntoView({ behavior: "smooth" });
                  setCurrentPage(Math.max(1, currentPage - 1));
                }}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      alumniRef.current.scrollIntoView({ behavior: "smooth" });
                      setCurrentPage(page);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  alumniRef.current.scrollIntoView({ behavior: "smooth" });
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>

              <span className="text-xs text-slate-500 font-medium ml-4">
                Page {currentPage} of {totalPages} • Showing {paginatedAlumni.length} of {filtered.length}
              </span>
            </div>
          )}
        </>
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
