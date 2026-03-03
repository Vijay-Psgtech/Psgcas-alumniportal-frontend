import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Camera, Image, Pencil, Trash2 } from "lucide-react";
import { useData } from "../../context/dataConstants";
import { DeleteModal } from "./AdminSharedUI";
import { AlbumFormModal } from "./AlbumFormModal";

export const AlbumsTab = ({ onError, onSuccess }) => {
    const { albumsData, addAlbum, updateAlbum, deleteAlbum, addYear } = useData();
    const years = Object.keys(albumsData).sort((a, b) => b - a);
    const [selectedYear, setSelectedYear] = useState(years[0] || "2026");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [newYear, setNewYear] = useState("");
    const [showAddYear, setShowAddYear] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const yearData = albumsData[selectedYear];
    const filtered = (yearData?.albums || []).filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(a.tags) ? a.tags : []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSaveAlbum = async (form) => {
        try {
            setIsLoading(true);
            if (modal.data?.id) {
                await updateAlbum(selectedYear, modal.data.id, form);
                onSuccess(`✓ Album "${form.title}" updated successfully!`);
            } else {
                await addAlbum(selectedYear, form);
                onSuccess(`✓ Album "${form.title}" created successfully!`);
            }
            setModal(null);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to save album";
            onError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAlbum = async (id, title) => {
        try {
            setIsLoading(true);
            await deleteAlbum(selectedYear, id);
            onSuccess(`✓ Album "${title}" deleted successfully!`);
            setModal(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete album";
            onError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddYear = () => {
        const y = parseInt(newYear);
        if (!y || y < 1980 || y > 2100 || albumsData[y]) return;
        addYear(y);
        setSelectedYear(String(y));
        setNewYear("");
        setShowAddYear(false);
    };

    return (
        <div>
            {/* Year pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4.5">
                <span className="text-[10px] text-gray-400 font-bold tracking-[1.5px] font-['Outfit',_sans-serif] mr-1">YEAR:</span>
                {years.map(y => {
                    const yd = albumsData[y];
                    const isSel = selectedYear === y;
                    return (
                        <button key={y} onClick={() => { setSelectedYear(y); setSearch(""); }}
                            className={`px-4 py-1.5 rounded-xl border-2 font-['Playfair_Display',_serif] text-[15px] font-bold transition-all shadow-sm ${isSel ? 'shadow-md scale-105' : 'bg-white border-transparent text-gray-500 hover:border-slate-200'}`}
                            style={isSel ? { borderColor: `${yd.coverColor}50`, backgroundColor: `${yd.coverColor}10`, color: yd.coverColor } : {}}>
                            {y}
                        </button>
                    );
                })}

                {showAddYear ? (
                    <div className="flex gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm ml-1">
                        <input value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="YYYY" maxLength={4}
                            className="px-3 py-1 bg-transparent w-20 font-['Outfit',_sans-serif] text-[13px] outline-none font-medium"
                            onKeyDown={e => e.key === "Enter" && handleAddYear()} autoFocus />
                        <button onClick={handleAddYear} className="px-3 py-1 rounded-xl border-none bg-emerald-500 text-white font-['Outfit',_sans-serif] text-xs font-bold cursor-pointer hover:bg-emerald-600 transition-colors shadow-sm">Add</button>
                        <button onClick={() => setShowAddYear(false)} className="px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-gray-400 cursor-pointer text-xs hover:bg-slate-100 hover:text-gray-600 transition-colors">✕</button>
                    </div>
                ) : (
                    <button onClick={() => setShowAddYear(true)}
                        className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-gray-400 font-['Outfit',_sans-serif] text-xs font-bold cursor-pointer flex items-center gap-1.5 hover:border-slate-400 hover:text-gray-600 transition-all hover:bg-slate-50 ml-1">
                        <Plus size={12} strokeWidth={3} /> NEW YEAR
                    </button>
                )}
            </div>

            {/* Year banner */}
            <div className="rounded-2xl p-5 sm:p-6 mb-6 flex justify-between items-center space-y-4 sm:space-y-0 flex-col sm:flex-row shadow-sm transition-all"
                style={{ backgroundColor: `${yearData?.coverColor || "#667eea"}08`, border: `1.5px solid ${yearData?.coverColor || "#667eea"}25` }}>
                <div className="text-center sm:text-left">
                    <div className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-extrabold text-[#0c0e1a] tracking-tight">{selectedYear} Albums</div>
                    <div className="text-sm font-medium text-gray-500 font-['Outfit',_sans-serif] mt-1 flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-semibold text-gray-700 bg-white/50 px-2 py-0.5 rounded border border-white/60 shadow-sm">{yearData?.albums.length || 0}</span> albums
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="font-semibold text-gray-700 bg-white/50 px-2 py-0.5 rounded border border-white/60 shadow-sm">{yearData?.totalPhotos || 0}</span> photos
                    </div>
                </div>
                <div className="flex gap-3 items-center w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search albums…"
                            className="w-full sm:w-56 py-2.5 pr-4 pl-9 border border-white bg-white/80 backdrop-blur-sm rounded-xl font-['Outfit',_sans-serif] text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm" />
                    </div>
                    <button onClick={() => setModal({ type: "add" })}
                        className="px-4.5 py-2.5 rounded-xl border-none bg-gradient-to-br from-amber-500 to-amber-700 text-white font-['Outfit',_sans-serif] text-[13px] font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-amber-600/30 transition-all hover:-translate-y-0.5 hover:shadow-amber-600/50 active:translate-y-0">
                        <Plus size={14} strokeWidth={3} /> Add Album
                    </button>
                </div>
            </div>

            {/* Albums grid */}
            {filtered.length === 0 ? (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl text-gray-400 font-['Outfit',_sans-serif] shadow-sm flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <Camera size={32} className="opacity-30" />
                    </div>
                    <div className="font-semibold text-gray-500 text-lg">No albums found for {selectedYear}</div>
                    <div className="text-sm mt-1">Try adjusting your search or add a new album.</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((album, i) => (
                        <motion.div key={album.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${isLoading ? 'opacity-60 grayscale-[20%]' : 'opacity-100'} group flex flex-col`}>
                            <div className="h-2 w-full transition-all group-hover:h-2.5" style={{ background: `linear-gradient(90deg, ${album.accent}, ${album.accent}88)` }} />
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex gap-1.5 flex-wrap mb-3.5">
                                    {(Array.isArray(album.tags) ? album.tags : []).slice(0, 3).map(t => (
                                        <span key={t} className="rounded border px-2 py-0.5 text-[9px] font-['Outfit',_sans-serif] font-bold tracking-wider"
                                            style={{ background: `${album.accent}10`, color: album.accent, borderColor: `${album.accent}25` }}>
                                            {t.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-['Playfair_Display',_serif] text-[16px] font-extrabold text-[#0c0e1a] mb-2 leading-tight group-hover:text-amber-700 transition-colors">{album.title}</h3>
                                <p className="text-gray-500 text-[12px] font-['Outfit',_sans-serif] mb-4 truncate font-medium flex-1">{album.event} <span className="text-gray-300 mx-1">•</span> {album.date}</p>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                                    <span className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-100 transition-colors">
                                        <Image size={12} />{album.photos} <span className="font-medium">photos</span>
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setModal({ type: "edit", data: album })} disabled={isLoading}
                                            className={`w-8 h-8 border border-slate-200 rounded-xl bg-white flex items-center justify-center transition-all shadow-sm ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-gray-400'}`}>
                                            <Pencil size={13} className="text-inherit" />
                                        </button>
                                        <button onClick={() => setModal({ type: "delete", data: album })} disabled={isLoading}
                                            className={`w-8 h-8 border border-slate-200 rounded-xl bg-white flex items-center justify-center transition-all shadow-sm ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-400'}`}>
                                            <Trash2 size={13} className="text-inherit" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {modal?.type === "add" && <AlbumFormModal year={selectedYear} onSave={handleSaveAlbum} onClose={() => setModal(null)} isLoading={isLoading} />}
                {modal?.type === "edit" && <AlbumFormModal initial={modal.data} year={selectedYear} onSave={handleSaveAlbum} onClose={() => setModal(null)} isLoading={isLoading} />}
                {modal?.type === "delete" && <DeleteModal label={modal.data.title} onConfirm={() => handleDeleteAlbum(modal.data.id, modal.data.title)} onClose={() => setModal(null)} isLoading={isLoading} />}
            </AnimatePresence>
        </div>
    );
};
