import React, { useState } from "react";
import { Search, Clock, CheckCircle, GraduationCap, Building2, Mail, ExternalLink, ChevronRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AlumniTab = ({ alumniList, setSelectedItem }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'approved'

    const filtered = alumniList.filter(a => {
        const matchesSearch = `${a.firstName} ${a.lastName} ${a.email} ${a.department || ""} ${a.graduationYear || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "approved" && a.isApproved) ||
            (statusFilter === "pending" && !a.isApproved);
        return matchesSearch && matchesStatus;
    });

    // Dynamic gradient generator based on initials for a premium feel
    const getAvatarGradient = (firstName, lastName) => {
        const charCode = (firstName?.charCodeAt(0) || 0) + (lastName?.charCodeAt(0) || 0);
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
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

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
                            <Search size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            placeholder="Search by name, email, department, or year…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
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
                        { id: 'all', label: 'All Alumni', icon: Users },
                        { id: 'pending', label: 'Pending', icon: Clock },
                        { id: 'approved', label: 'Approved', icon: CheckCircle },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setStatusFilter(btn.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold font-['Outfit',_sans-serif] transition-all duration-300 border ${statusFilter === btn.id
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <btn.icon size={14} className={statusFilter === btn.id ? 'text-white' : 'text-slate-400'} />
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {filtered.map((a, i) => (
                            <motion.div
                                key={a._id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                layout
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedItem(a)}
                                className="group bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Decorative background element */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-blue-50/50 transition-colors duration-500 pointer-events-none"></div>

                                <div className="flex gap-5 relative z-10">
                                    {/* Elevated Avatar */}
                                    <div className="relative shrink-0">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-900 p-[2px] shadow-lg shadow-blue-500/10`}>
                                            <div className="w-full h-full rounded-[14px] bg-black/10 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-xl font-['Outfit',_sans-serif] border border-white/20">
                                                {a.firstName?.charAt(0)}{a.lastName?.charAt(0)}
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white shadow-sm ${a.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                            {a.isApproved ? <CheckCircle size={12} className="text-white" /> : <Clock size={12} className="text-white" />}
                                        </div>
                                    </div>

                                    {/* Information Rich Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-extrabold text-[18px] text-slate-800 font-['Outfit',_sans-serif] truncate group-hover:text-blue-600 transition-colors">
                                                    {a.firstName} {a.lastName}
                                                </h3>
                                                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium mb-3">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="truncate">{a.email}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <div className="bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-blue-100 px-3 py-2 rounded-xl transition-colors">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                    <Building2 size={10} />
                                                    Dept
                                                </div>
                                                <div className="text-[12px] font-bold text-slate-700 truncate font-['Outfit',_sans-serif]">
                                                    {a.department || "No Data"}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-blue-100 px-3 py-2 rounded-xl transition-colors">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                    <GraduationCap size={10} />
                                                    Batch
                                                </div>
                                                <div className="text-[12px] font-bold text-slate-700 truncate font-['Outfit',_sans-serif]">
                                                    {a.graduationYear || "N/A"}
                                                </div>
                                            </div>
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
                    <h4 className="text-xl font-extrabold text-slate-800 mb-2">No results found</h4>
                    <p className="text-slate-500 max-w-[280px] text-[15px] font-medium">
                        We couldn't find any alumni matching "<span className="text-blue-500 italic font-bold">{searchTerm}</span>"
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
