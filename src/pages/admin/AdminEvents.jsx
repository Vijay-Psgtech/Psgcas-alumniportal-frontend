import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Pencil,
  Trash2,
  Star,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useData, CATEGORY_COLORS } from "../../context/dataConstants";
import { DeleteModal } from "../../components/admin/AdminSharedUI";
import { EventFormModal } from "../../components/admin/EventFormModal";

const AdminEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // ✅ Notification handling
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // ✅ Filter events
  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)) &&
      (statusFilter === "all" || e.status === statusFilter)
    );
  });

  // ✅ Calculate stats
  const stats = {
    total: events.length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    completed: events.filter((e) => e.status === "completed").length,
    highlighted: events.filter((e) => e.highlight).length,
  };

  // ✅ Handle save
  const handleSave = async (form) => {
    try {
      setIsLoading(true);
      if (modal.data?._id) {
        await updateEvent(modal.data._id, form);
        showNotification(`✓ Event "${form.title}" updated successfully!`, "success");
      } else {
        await addEvent(form);
        showNotification(`✓ Event "${form.title}" created successfully!`, "success");
      }
      setModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save event";
      showNotification(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id, title) => {
    try {
      setIsLoading(true);
      await deleteEvent(id);
      showNotification(`✓ Event "${title}" deleted successfully!`, "success");
      setModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete event";
      showNotification(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Format date
  const fmtDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  // ✅ Format time
  const fmtTime = (t) => {
    if (!t) return "N/A";
    const [hours, minutes] = t.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-24">
      {/* ========== HEADER ========== */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-['Playfair_Display',_serif] font-extrabold text-[#0c0e1a] mb-2">
              Events Management
            </h1>
            <p className="text-gray-500 font-['Outfit',_sans-serif] text-sm">
              Manage, create, and track all events in one place
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "add" })}
            className="px-6 py-3 rounded-xl border-none bg-gradient-to-br from-blue-500 to-blue-900 text-white font-['Outfit',_sans-serif] font-bold text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 w-full sm:w-auto"
          >
            <Plus size={18} /> Add Event
          </button>
        </div>

        {/* ========== STATS SECTION ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Events", value: stats.total, icon: Calendar, color: "blue" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "emerald" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "slate" },
            { label: "Highlighted", value: stats.highlighted, icon: Star, color: "amber" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              slate: "bg-slate-50 text-slate-600",
              amber: "bg-amber-50 text-amber-500",
            };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${colorMap[stat.color]} p-4 rounded-2xl border border-${stat.color}-100 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-['Outfit',_sans-serif] uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </span>
                  <Icon size={16} className="opacity-40" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-['Playfair_Display',_serif]">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========== NOTIFICATION ========== */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 font-['Outfit',_sans-serif] ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={18} className="shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== TOOLBAR ========== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, category, or venue…"
                className="w-full py-3 px-4 pl-10 border border-slate-200 rounded-xl font-['Outfit',_sans-serif] text-sm outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Status Filter and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-black/5">
              {["all", "upcoming", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 border-none font-['Outfit',_sans-serif] text-xs sm:text-sm font-bold transition-all capitalize ${
                    statusFilter === f
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-500 hover:bg-slate-50 hover:text-gray-700"
                  }`}
                >
                  {f === "all" ? "All Events" : f}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 font-['Outfit',_sans-serif] font-medium whitespace-nowrap">
              Showing <strong className="text-[#0c0e1a]">{filtered.length}</strong> of{" "}
              <strong className="text-[#0c0e1a]">{events.length}</strong> events
            </div>
          </div>
        </div>
      </div>

      {/* ========== EVENTS LIST / GRID ========== */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
          >
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-700 font-['Outfit',_sans-serif] mb-1">
              No events found
            </h3>
            <p className="text-sm text-gray-500 font-['Outfit',_sans-serif]">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
            {filtered.map((event, idx) => {
              const cc = CATEGORY_COLORS[event.category] || "#667eea";
              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/8 transition-all duration-300 group"
                >
                  {/* ========== EVENT HEADER ========== */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex-1">
                      {/* Title with highlight badge */}
                      <div className="flex items-center gap-2 mb-2">
                        {event.highlight && (
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-200">
                            <Star size={11} className="fill-amber-500 text-amber-500" />
                            <span className="text-[10px] font-bold font-['Outfit',_sans-serif]">
                              Featured
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-[#0c0e1a] font-['Playfair_Display',_serif] line-clamp-2">
                          {event.title}
                        </h3>
                      </div>

                      {/* Category and Venue */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-block rounded-full px-3 py-1 text-[10px] font-bold font-['Outfit',_sans-serif] tracking-wider border"
                          style={{
                            background: `${cc}15`,
                            color: cc,
                            borderColor: `${cc}30`,
                          }}
                        >
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-500 font-['Outfit',_sans-serif]">
                          {event.venue?.split(",")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold font-['Outfit',_sans-serif] uppercase tracking-wider whitespace-nowrap border ${
                        event.status === "upcoming"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {event.status === "upcoming" ? (
                        <Clock size={11} />
                      ) : (
                        <CheckCircle size={11} />
                      )}
                      {event.status === "upcoming" ? "Upcoming" : "Completed"}
                    </div>
                  </div>

                  {/* ========== EVENT DETAILS ========== */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-['Outfit',_sans-serif] mb-1">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-[#0c0e1a] font-['Outfit',_sans-serif]">
                        {fmtDate(event.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-['Outfit',_sans-serif] mb-1">
                        Time
                      </p>
                      <p className="text-sm font-semibold text-[#0c0e1a] font-['Outfit',_sans-serif]">
                        {fmtTime(event.time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-['Outfit',_sans-serif] mb-1">
                        Attendees
                      </p>
                      <p className="text-sm font-semibold text-[#0c0e1a] font-['Outfit',_sans-serif]">
                        {event.attendees || "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-['Outfit',_sans-serif] mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-[#0c0e1a] font-['Outfit',_sans-serif] truncate">
                        {event.venue?.split(",")[1] || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-xs text-gray-600 font-['Outfit',_sans-serif] line-clamp-2 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      {event.description}
                    </p>
                  )}

                  {/* ========== ACTIONS ========== */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setModal({ type: "edit", data: event })}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-blue-200 hover:bg-blue-50 rounded-lg bg-white text-blue-600 font-['Outfit',_sans-serif] text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", data: event })}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-red-200 hover:bg-red-50 rounded-lg bg-white text-red-600 font-['Outfit',_sans-serif] text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========== MODALS ========== */}
      <AnimatePresence>
        {modal?.type === "add" && (
          <EventFormModal
            onSave={handleSave}
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}
        {modal?.type === "edit" && (
          <EventFormModal
            initial={modal.data}
            onSave={handleSave}
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}
        {modal?.type === "delete" && (
          <DeleteModal
            label={modal.data.title}
            onConfirm={() => handleDelete(modal.data._id, modal.data.title)}
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEvents;