// src/pages/alumni/AlumniDirectory.jsx
// ✅ Redesigned with Tailwind CSS — no custom <style> block

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Mail,
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  AlertCircle,
} from "lucide-react";
import { alumniAPI } from "../../services/api";

/* ─── Animation variants ─────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ─── Shared select style ────────────────────── */
const selectCls =
  "h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 " +
  "focus:bg-white cursor-pointer transition-all duration-200 min-w-[160px]";

/* ─── Alumni Card ────────────────────────────── */
const AlumniCard = ({ alumnus }) => {
  const initials =
    `${alumnus.firstName?.charAt(0) ?? ""}${alumnus.lastName?.charAt(0) ?? ""}`.toUpperCase();

  // Pick a deterministic gradient from initials
  const gradients = [
    "from-indigo-500 to-violet-600",
    "from-violet-500 to-purple-700",
    "from-sky-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const grad = gradients[(initials.charCodeAt(0) || 0) % gradients.length];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-shadow duration-300"
    >
      {/* Hover top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card Header */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-0">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-lg font-extrabold shadow-md select-none`}
        >
          {initials || "?"}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
            {alumnus.firstName} {alumnus.lastName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {alumnus.email}
          </p>
          {alumnus.isApproved && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        {/* Dept + Year */}
        {(alumnus.department || alumnus.graduationYear) && (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={12} className="text-violet-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department & Year
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {alumnus.department}
                {alumnus.department && alumnus.graduationYear && (
                  <span className="text-slate-300 mx-1.5">•</span>
                )}
                {alumnus.graduationYear}
              </p>
            </div>
          </div>
        )}

        {/* Company + Title */}
        {alumnus.currentCompany && (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={12} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Professional
              </p>
              {alumnus.jobTitle && (
                <p className="text-sm font-bold text-indigo-600 mt-0.5">
                  {alumnus.jobTitle}
                </p>
              )}
              <p className="text-xs text-slate-600 font-medium">
                {alumnus.currentCompany}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {alumnus.city && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <MapPin size={12} className="text-slate-400 flex-shrink-0" />
            {alumnus.city}
            {alumnus.country && `, ${alumnus.country}`}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 flex gap-2.5 mt-auto">
        {alumnus.linkedin && (
          <a
            href={alumnus.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Linkedin size={13} /> LinkedIn
          </a>
        )}
        <a
          href={`mailto:${alumnus.email}`}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold active:scale-95 transition-all ${
            alumnus.linkedin
              ? "px-4 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "flex-1 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          <Mail size={13} /> Email
        </a>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alumniData, setAlumniData] = useState({
    alumni: [],
    departments: [],
    years: [],
  });

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);
        const response = await alumniAPI.getAllAlumni();
        const alumni = response.data.alumni || [];

        setAlumniData({
          alumni,
          departments: [...new Set(alumni.map((a) => a.department))]
            .filter(Boolean)
            .sort(),
          years: [...new Set(alumni.map((a) => a.graduationYear))].sort(
            (a, b) => b - a,
          ),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };
    loadAlumni();
  }, []);

  const filteredAlumni = useMemo(() => {
    let list = alumniData.alumni;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.firstName.toLowerCase().includes(t) ||
          a.lastName.toLowerCase().includes(t) ||
          a.email.toLowerCase().includes(t) ||
          (a.currentCompany && a.currentCompany.toLowerCase().includes(t)),
      );
    }
    if (filterDepartment)
      list = list.filter((a) => a.department === filterDepartment);
    if (filterYear)
      list = list.filter(
        (a) => Number(a.graduationYear) === Number(filterYear),
      );
    return list;
  }, [searchTerm, filterDepartment, filterYear, alumniData.alumni]);

  const hasFilters = searchTerm || filterDepartment || filterYear;
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterYear("");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">
            Alumni Portal
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
            Alumni Directory
          </h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Find and connect with alumni from around the world
          </p>
        </motion.div>

        {/* ── Stats bar ── */}
        {!loading && !error && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {[
              {
                label: "Total Alumni",
                value: alumniData.alumni.length,
                icon: Users,
              },
              {
                label: "Departments",
                value: alumniData.departments.length,
                icon: GraduationCap,
              },
              {
                label: "Batch Years",
                value: alumniData.years.length,
                icon: Briefcase,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Filter Card ── */}
        <motion.div
          className="relative bg-white rounded-2xl border border-slate-100 shadow-sm px-5 sm:px-6 py-5 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-2xl" />

          {/* Search row */}
          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, email or company…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search alumni"
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={15} />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
                Filter
              </span>
            </div>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={selectCls}
            >
              <option value="">All Departments</option>
              {alumniData.departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className={selectCls}
            >
              <option value="">All Graduation Years</option>
              {alumniData.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all"
                >
                  <X size={13} /> Clear
                </motion.button>
              )}
            </AnimatePresence>

            {/* Results count pushed to right */}
            {!loading && !error && (
              <p className="ml-auto text-sm text-slate-500 font-medium">
                <span className="text-indigo-600 font-extrabold">
                  {filteredAlumni.length}
                </span>{" "}
                alumni
                {searchTerm && (
                  <span className="text-slate-400"> for "{searchTerm}"</span>
                )}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">
              Loading alumni directory…
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6">
            <AlertCircle size={17} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* ── Alumni Grid ── */}
        {!loading && !error && filteredAlumni.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAlumni.map((alumnus) => (
              <AlumniCard key={alumnus._id} alumnus={alumnus} />
            ))}
          </motion.div>
        )}

        {/* ── No Results ── */}
        {!loading && !error && filteredAlumni.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm text-center px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              No alumni found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs">
              No results match your current filters. Try adjusting your search
              or clearing the filters.
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
