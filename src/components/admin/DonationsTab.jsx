import React, { useState } from "react";
import { Filter, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const DonationsTab = ({ donationList, setSelectedItem }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = donationList.filter(d =>
        (d.paymentMethod || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(d.amount).includes(searchTerm) ||
        (d.status || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4.5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2.5 items-center shadow-sm transition-shadow focus-within:shadow-md focus-within:border-emerald-200 mb-4">
                <Filter size={18} className="text-gray-400 ml-1" />
                <input placeholder="Search donations by payment method, amount or status…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 border-none py-1 font-['Outfit',_sans-serif] text-[15px] outline-none text-gray-700 bg-transparent placeholder-gray-400" />
            </div>

            {filtered.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {filtered.map((d, i) => (
                        <div key={d._id} className={`flex items-center p-4 sm:p-5 cursor-pointer transition-colors hover:bg-slate-50 ${i < filtered.length - 1 ? 'border-b border-slate-100' : ''}`} onClick={() => setSelectedItem(d)}>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mr-4 shrink-0 shadow-sm border border-emerald-100/50">
                                💰
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[16px] text-[#0c0e1a] font-['Outfit',_sans-serif] leading-tight mb-0.5">{d.currency === "INR" ? "₹" : "$"}{d.amount}</div>
                                <div className="text-[13px] text-gray-500 font-medium">{new Date(d.donatedAt).toLocaleDateString()} <span className="mx-1.5 text-gray-300">•</span> {d.paymentMethod}</div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ml-3 whitespace-nowrap ${d.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                                {d.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {d.status}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4 text-gray-400 bg-white border border-slate-200 rounded-2xl font-['Outfit',_sans-serif] shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Filter size={24} className="text-gray-300" />
                    </div>
                    <div className="text-lg font-semibold text-gray-500 mb-1">No donation records found</div>
                    <div className="text-sm">We couldn't find any donations matching your search.</div>
                </div>
            )}
        </motion.div>
    );
};
