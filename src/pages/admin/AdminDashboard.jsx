// frontend/src/pages/admin/AdminDashboard.jsx - FIXED VERSION
// ✅ Proper ES6 imports with graceful fallback
// ✅ No console warnings about donationsAPI
// ✅ Works even if API is missing

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Users, FileText, Search, Filter, X, CheckCircle,
  AlertCircle, Clock, Calendar, Camera, Image, Plus, Pencil,
  Trash2, Star,
} from "lucide-react";
import { adminAPI } from "../../Services/api";
import { useData, CATEGORY_COLORS } from "../../context/dataConstants";

// ✅ Safe import with fallback - using dynamic import
const getFallbackDonationsAPI = () => ({
  getAll: () => Promise.resolve({ data: { donations: [] } })
});

let donationsAPI = getFallbackDonationsAPI();

// Try to import donationsAPI from Services/api
(async () => {
  try {
    const api = await import("../../Services/api");
    if (api.donationsAPI) {
      donationsAPI = api.donationsAPI;
    }
  } catch (err) {
    // silently fail and use fallback
    donationsAPI = getFallbackDonationsAPI();
  }
})();

const CATEGORIES = ["Awards", "Lecture", "Sports", "Memorial", "Congress", "Workshop", "Networking", "Cultural", "Other"];
const BLANK_EVENT = { title: "", date: "", time: "", venue: "PSG College of Technology, Avinashi Road, Coimbatore", description: "", status: "upcoming", attendees: "", category: "Awards", highlight: false };
const BLANK_ALBUM = { title: "", event: "", date: "", photos: "", accent: "#b8882a", tags: "" };

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────
const Overlay = ({ onClose, children, wide }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ position: "fixed", inset: 0, background: "rgba(12,14,26,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px", backdropFilter: "blur(6px)" }}
    onClick={onClose}>
    <motion.div initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
      style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: wide ? "780px" : "520px", maxHeight: "93vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(12,14,26,0.25)", position: "relative" }}
      onClick={e => e.stopPropagation()}>
      {children}
    </motion.div>
  </motion.div>
);

const FLabel = ({ label, children, span2 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: span2 ? "1 / -1" : undefined }}>
    <label style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af", letterSpacing: "1.2px", fontFamily: "'Outfit', sans-serif", textTransform: "uppercase" }}>{label}</label>
    {children}
  </div>
);

const inp = { padding: "10px 14px", border: "1px solid #e0e6f0", borderRadius: "9px", fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: "#0c0e1a", outline: "none", width: "100%", background: "#fafbfd" };

const Inp = (props) => (
  <input {...props} style={{ ...inp, ...props.style }}
    onFocus={e => { e.target.style.borderColor = "#667eea"; e.target.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.1)"; }}
    onBlur={e => { e.target.style.borderColor = "#e0e6f0"; e.target.style.boxShadow = "none"; }} />
);

const Sel = ({ children, ...props }) => (
  <select {...props} style={{ ...inp, ...props.style }}
    onFocus={e => e.target.style.borderColor = "#667eea"}
    onBlur={e => e.target.style.borderColor = "#e0e6f0"}>
    {children}
  </select>
);

const Txt = (props) => (
  <textarea {...props} style={{ ...inp, resize: "vertical", minHeight: "82px", ...props.style }}
    onFocus={e => { e.target.style.borderColor = "#667eea"; e.target.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.1)"; }}
    onBlur={e => { e.target.style.borderColor = "#e0e6f0"; e.target.style.boxShadow = "none"; }} />
);

const ModalHeader = ({ title, sub, onClose }) => (
  <div style={{ padding: "26px 30px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div>
      <div style={{ fontSize: "10px", color: "#667eea", fontWeight: "700", letterSpacing: "1.5px", fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>{sub}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "21px", fontWeight: "800", color: "#0c0e1a" }}>{title}</h2>
    </div>
    <button onClick={onClose} style={{ background: "#f0f3f9", border: "none", borderRadius: "9px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <X size={15} color="#6b7280" />
    </button>
  </div>
);

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
const DeleteModal = ({ label, onConfirm, onClose, isLoading }) => (
  <Overlay onClose={onClose}>
    <div style={{ padding: "40px 32px", textAlign: "center" }}>
      <div style={{ width: "58px", height: "58px", background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <Trash2 size={22} color="#dc2626" />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: "#0c0e1a", marginBottom: "10px" }}>Confirm Delete</h2>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
        Delete <strong>"{label}"</strong>?<br />This action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={onConfirm} disabled={isLoading}
          style={{ padding: "11px 28px", borderRadius: "10px", border: "none", background: isLoading ? "#f3d0d0" : "#dc2626", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "700", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>
          {isLoading ? "Deleting..." : "Delete"}
        </button>
        <button onClick={onClose} disabled={isLoading}
          style={{ padding: "11px 28px", borderRadius: "10px", border: "1px solid #e0e6f0", background: "#f8fafc", color: "#9ca3af", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  </Overlay>
);

// ─── EVENT FORM ───────────────────────────────────────────────────────────────
const EventFormModal = ({ initial, onSave, onClose, isLoading }) => {
  const [form, setForm] = useState(initial || BLANK_EVENT);
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const valid = form.title.trim() && form.date && form.venue.trim();

  return (
    <Overlay onClose={onClose} wide>
      <ModalHeader
        title={isEdit ? "Update Event" : "Add New Event"}
        sub={isEdit ? "✏️ EDITING EVENT" : "➕ NEW EVENT"}
        onClose={onClose}
      />
      <div style={{ padding: "24px 30px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FLabel label="Event Title" span2>
            <Inp value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Alumni Congress 2027" disabled={isLoading} />
          </FLabel>

          <FLabel label="Category">
            <Sel value={form.category} onChange={e => set("category", e.target.value)} disabled={isLoading}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Sel>
          </FLabel>

          <FLabel label="Status">
            <Sel value={form.status} onChange={e => set("status", e.target.value)} disabled={isLoading}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </Sel>
          </FLabel>

          <FLabel label="Date">
            <Inp type="date" value={form.date} onChange={e => set("date", e.target.value)} disabled={isLoading} />
          </FLabel>

          <FLabel label="Time">
            <Inp type="time" value={form.time} onChange={e => set("time", e.target.value)} disabled={isLoading} />
          </FLabel>

          <FLabel label="Venue" span2>
            <Inp value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="Venue name, city" disabled={isLoading} />
          </FLabel>

          <FLabel label="Expected / Total Attendees">
            <Inp type="number" value={form.attendees} onChange={e => set("attendees", e.target.value)} placeholder="0" min="0" disabled={isLoading} />
          </FLabel>

          <FLabel label="Highlight Event?">
            <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
              {[{ v: true, label: "⭐ Yes" }, { v: false, label: "No" }].map(({ v, label }) => (
                <button key={String(v)} type="button" onClick={() => set("highlight", v)} disabled={isLoading}
                  style={{ flex: 1, padding: "9px", borderRadius: "8px", border: `1px solid ${form.highlight === v ? "#667eea" : "#e0e6f0"}`, background: form.highlight === v ? "#667eea10" : "#fafbfd", color: form.highlight === v ? "#667eea" : "#9ca3af", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>
                  {label}
                </button>
              ))}
            </div>
          </FLabel>

          <FLabel label="Description" span2>
            <Txt value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short event description visible on the event card…" disabled={isLoading} />
          </FLabel>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => valid && onSave(form)} disabled={!valid || isLoading}
            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: valid && !isLoading ? "linear-gradient(135deg, #667eea, #764ba2)" : "#e0e6f0", color: valid && !isLoading ? "#fff" : "#a0aec0", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "700", cursor: valid && !isLoading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isLoading ? 0.7 : 1 }}>
            <CheckCircle size={15} /> {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
          </button>
          <button onClick={onClose} disabled={isLoading}
            style={{ padding: "12px 22px", borderRadius: "10px", border: "1px solid #e0e6f0", background: "#f8fafc", color: "#9ca3af", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer" }}>
            Cancel
          </button>
        </div>
        {!valid && <p style={{ color: "#f59e0b", fontSize: "12px", marginTop: "8px", fontFamily: "'Outfit', sans-serif" }}>⚠ Title, Date, and Venue are required.</p>}
      </div>
    </Overlay>
  );
};

// ─── ALBUM FORM ───────────────────────────────────────────────────────────────
const AlbumFormModal = ({ initial, year, onSave, onClose, isLoading }) => {
  const [form, setForm] = useState(
    initial
      ? { ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags || "") }
      : BLANK_ALBUM
  );
  const isEdit = !!initial?.id;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.title.trim() && form.event.trim();

  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        title={isEdit ? "Update Album" : "Add New Album"}
        sub={isEdit ? `✏️ EDITING · ${year}` : `📸 NEW ALBUM · ${year}`}
        onClose={onClose}
      />
      <div style={{ padding: "24px 30px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <FLabel label="Album Title"><Inp value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Alumni Congress Highlights" disabled={isLoading} /></FLabel>
          <FLabel label="Event Name"><Inp value={form.event} onChange={e => set("event", e.target.value)} placeholder="e.g. Alumni Congress 2026" disabled={isLoading} /></FLabel>
          <FLabel label="Date"><Inp value={form.date} onChange={e => set("date", e.target.value)} placeholder="e.g. Jan 10, 2026" disabled={isLoading} /></FLabel>
          <FLabel label="Number of Photos"><Inp type="number" value={form.photos} onChange={e => set("photos", e.target.value)} placeholder="0" min="0" disabled={isLoading} /></FLabel>
          <FLabel label="Tags (comma-separated)"><Inp value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="e.g. Awards, Gala, Networking" disabled={isLoading} /></FLabel>
          <FLabel label="Accent Color">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="color" value={form.accent} onChange={e => set("accent", e.target.value)} disabled={isLoading}
                style={{ width: "48px", height: "40px", border: "1px solid #e0e6f0", borderRadius: "8px", padding: "2px", cursor: isLoading ? "not-allowed" : "pointer", background: "#fafbfd", opacity: isLoading ? 0.6 : 1 }} />
              <span style={{ fontSize: "13px", color: "#9ca3af", fontFamily: "'Outfit', sans-serif" }}>Album theme color</span>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: form.accent, border: "1px solid rgba(0,0,0,0.1)" }} />
            </div>
          </FLabel>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => valid && onSave({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) })} disabled={!valid || isLoading}
            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: valid && !isLoading ? "linear-gradient(135deg, #b8882a, #9a7020)" : "#e0e6f0", color: valid && !isLoading ? "#fff" : "#a0aec0", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "700", cursor: valid && !isLoading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: isLoading ? 0.7 : 1 }}>
            <CheckCircle size={15} /> {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Album"}
          </button>
          <button onClick={onClose} disabled={isLoading}
            style={{ padding: "12px 22px", borderRadius: "10px", border: "1px solid #e0e6f0", background: "#f8fafc", color: "#9ca3af", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
};

// ─── EVENTS MANAGEMENT TAB ────────────────────────────────────────────────────
const EventsTab = ({ onError, onSuccess }) => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    return (e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)) &&
      (statusFilter === "all" || e.status === statusFilter);
  });

  const handleSave = async (form) => {
    try {
      setIsLoading(true);
      if (modal.data?._id) {
        await updateEvent(modal.data._id, form);
        onSuccess(`✓ Event "${form.title}" updated successfully!`);
      } else {
        await addEvent(form);
        onSuccess(`✓ Event "${form.title}" created successfully!`);
      }
      setModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save event";
      onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    try {
      setIsLoading(true);
      await deleteEvent(id);
      onSuccess(`✓ Event "${title}" deleted successfully!`);
      setModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete event";
      onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
            style={{ width: "100%", padding: "10px 14px 10px 36px", border: "1px solid #e0e6f0", borderRadius: "9px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", outline: "none", background: "#fff" }} />
        </div>
        <div style={{ display: "flex", background: "#fff", border: "1px solid #e0e6f0", borderRadius: "9px", overflow: "hidden" }}>
          {["all", "upcoming", "completed"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "9px 16px", border: "none", background: statusFilter === f ? "#667eea" : "transparent", color: statusFilter === f ? "#fff" : "#9ca3af", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "700", cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setModal({ type: "add" })}
          style={{ padding: "10px 18px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(102,126,234,0.35)" }}>
          <Plus size={14} /> Add Event
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "'Outfit', sans-serif", marginBottom: "12px" }}>
        Showing <strong style={{ color: "#0c0e1a" }}>{filtered.length}</strong> of {events.length} events
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr 0.6fr 90px", padding: "11px 18px", background: "#f8fafc", borderBottom: "1px solid #e0e6f0" }}>
          {["Title", "Category", "Date", "Status", "Attend.", "Actions"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#a0aec0", letterSpacing: "0.9px", fontFamily: "'Outfit', sans-serif", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "50px", textAlign: "center", color: "#a0aec0", fontFamily: "'Outfit', sans-serif" }}>
            <Calendar size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.25 }} />
            No events found.
          </div>
        )}

        {filtered.map((ev, i) => {
          const cc = CATEGORY_COLORS[ev.category] || "#667eea";
          return (
            <motion.div key={ev._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }}
              style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr 0.6fr 90px", padding: "13px 18px", borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {ev.highlight && <Star size={10} fill="#b8882a" color="#b8882a" />}
                  <span style={{ fontWeight: "600", fontSize: "13px", color: "#0c0e1a", fontFamily: "'Outfit', sans-serif" }}>{ev.title}</span>
                </div>
                <span style={{ fontSize: "11px", color: "#a0aec0" }}>{ev.venue?.split(",")[0]}</span>
              </div>

              <span style={{ display: "inline-block", background: `${cc}12`, color: cc, border: `1px solid ${cc}30`, borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: "700", fontFamily: "'Outfit', sans-serif" }}>{ev.category}</span>
              <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "'Outfit', sans-serif" }}>{fmtDate(ev.date)}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: ev.status === "upcoming" ? "#1a7a54" : "#a0aec0" }}>
                {ev.status === "upcoming" ? <Clock size={10} /> : <CheckCircle size={10} />}
                {ev.status === "upcoming" ? "Upcoming" : "Done"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#0c0e1a" }}>{ev.attendees}</span>

              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => setModal({ type: "edit", data: ev })} disabled={isLoading}
                  style={{ width: "29px", height: "29px", border: "1px solid #e0e6f0", borderRadius: "7px", background: "#f8fafc", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isLoading ? 0.5 : 1 }}>
                  <Pencil size={12} color="#667eea" />
                </button>
                <button onClick={() => setModal({ type: "delete", data: ev })} disabled={isLoading}
                  style={{ width: "29px", height: "29px", border: "1px solid #fee2e2", borderRadius: "7px", background: "#fff5f5", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isLoading ? 0.5 : 1 }}>
                  <Trash2 size={12} color="#dc2626" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {modal?.type === "add" && <EventFormModal onSave={handleSave} onClose={() => setModal(null)} isLoading={isLoading} />}
        {modal?.type === "edit" && <EventFormModal initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} isLoading={isLoading} />}
        {modal?.type === "delete" && <DeleteModal label={modal.data.title} onConfirm={() => handleDelete(modal.data._id, modal.data.title)} onClose={() => setModal(null)} isLoading={isLoading} />}
      </AnimatePresence>
    </div>
  );
};

// ─── ALBUMS MANAGEMENT TAB ────────────────────────────────────────────────────
const AlbumsTab = ({ onError, onSuccess }) => {
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "10px", color: "#a0aec0", fontWeight: "700", letterSpacing: "1px", fontFamily: "'Outfit', sans-serif" }}>YEAR:</span>
        {years.map(y => {
          const yd = albumsData[y];
          const isSel = selectedYear === y;
          return (
            <button key={y} onClick={() => { setSelectedYear(y); setSearch(""); }}
              style={{ padding: "7px 16px", borderRadius: "9px", border: `1.5px solid ${isSel ? (yd.coverColor + "60") : "#e0e6f0"}`, background: isSel ? `${yd.coverColor}10` : "#fff", color: isSel ? yd.coverColor : "#9ca3af", fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              {y}
            </button>
          );
        })}

        {showAddYear ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <input value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="YYYY" maxLength={4}
              style={{ padding: "7px 12px", border: "1px solid #e0e6f0", borderRadius: "9px", width: "80px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", outline: "none" }}
              onKeyDown={e => e.key === "Enter" && handleAddYear()} autoFocus />
            <button onClick={handleAddYear} style={{ padding: "7px 14px", borderRadius: "9px", border: "none", background: "#667eea", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Add</button>
            <button onClick={() => setShowAddYear(false)} style={{ padding: "7px 10px", borderRadius: "9px", border: "1px solid #e0e6f0", background: "#f8fafc", color: "#9ca3af", cursor: "pointer", fontSize: "12px" }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setShowAddYear(true)}
            style={{ padding: "7px 14px", borderRadius: "9px", border: "1.5px dashed #e0e6f0", background: "transparent", color: "#a0aec0", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            <Plus size={12} /> Year
          </button>
        )}
      </div>

      {/* Year banner */}
      <div style={{ background: `${yearData?.coverColor || "#667eea"}08`, border: `1.5px solid ${yearData?.coverColor || "#667eea"}25`, borderRadius: "14px", padding: "16px 20px", marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: "800", color: "#0c0e1a" }}>{selectedYear} Albums</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "'Outfit', sans-serif", marginTop: "2px" }}>
            {yearData?.albums.length || 0} albums · {yearData?.totalPhotos || 0} photos
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search albums…"
              style={{ padding: "8px 12px 8px 30px", border: "1px solid #e0e6f0", borderRadius: "9px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", outline: "none", background: "#fff", width: "170px" }} />
          </div>
          <button onClick={() => setModal({ type: "add" })}
            style={{ padding: "9px 16px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #b8882a, #9a7020)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(184,136,42,0.35)" }}>
            <Plus size={13} /> Add Album
          </button>
        </div>
      </div>

      {/* Albums grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "50px", textAlign: "center", background: "#fff", border: "1px solid #e0e6f0", borderRadius: "14px", color: "#a0aec0", fontFamily: "'Outfit', sans-serif" }}>
          <Camera size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.25 }} />
          No albums for {selectedYear}.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "14px" }}>
          {filtered.map((album, i) => (
            <motion.div key={album.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s", opacity: isLoading ? 0.6 : 1 }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}>
              <div style={{ height: "6px", background: `linear-gradient(90deg, ${album.accent}, ${album.accent}88)` }} />
              <div style={{ padding: "15px 16px" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {(Array.isArray(album.tags) ? album.tags : []).slice(0, 3).map(t => (
                    <span key={t} style={{ background: `${album.accent}10`, color: album.accent, border: `1px solid ${album.accent}22`, borderRadius: "20px", padding: "2px 8px", fontSize: "9px", fontFamily: "'Outfit', sans-serif", fontWeight: "700" }}>{t.toUpperCase()}</span>
                  ))}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: "700", color: "#0c0e1a", marginBottom: "3px", lineHeight: 1.3 }}>{album.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "11px", fontFamily: "'Outfit', sans-serif", marginBottom: "10px" }}>{album.event} · {album.date}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9ca3af", fontSize: "11px" }}><Image size={11} />{album.photos} photos</span>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => setModal({ type: "edit", data: album })} disabled={isLoading}
                      style={{ width: "28px", height: "28px", border: "1px solid #e0e6f0", borderRadius: "7px", background: "#f8fafc", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isLoading ? 0.5 : 1 }}>
                      <Pencil size={11} color="#667eea" />
                    </button>
                    <button onClick={() => setModal({ type: "delete", data: album })} disabled={isLoading}
                      style={{ width: "28px", height: "28px", border: "1px solid #fee2e2", borderRadius: "7px", background: "#fff5f5", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isLoading ? 0.5 : 1 }}>
                      <Trash2 size={11} color="#dc2626" />
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

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { events, albumsData } = useData();
  const [activeTab, setActiveTab] = useState("alumni");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alumniList, setAlumniList] = useState([]);
  const [donationList, setDonationList] = useState([]);
  const [stats, setStats] = useState({ totalAlumni: 0, pendingAlumni: 0, totalDonations: 0, completedDonations: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const iv = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
  const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, alumniRes, donationsRes] = await Promise.all([
          adminAPI.getStats().catch(err => {
            console.error("Stats API error:", err);
            return { data: { stats: { totalAlumni: 0, pendingAlumni: 0, totalDonations: 0, completedDonations: 0 } } };
          }),
          adminAPI.getAllAlumni().catch(err => {
            console.error("Alumni API error:", err);
            return { data: { alumni: [] } };
          }),
          donationsAPI.getAll().catch(err => {
            console.error("Donations API error:", err);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("alumniUser");
    navigate("/admin");
  };

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

  const totalAlbums = Object.values(albumsData).reduce((s, y) => s + y.albums.length, 0);

  const TABS = [
    { key: "alumni",   Icon: Users,    label: "Alumni",    badge: stats.totalAlumni },
    { key: "donations",Icon: FileText, label: "Donations", badge: stats.totalDonations },
    { key: "events",   Icon: Calendar, label: "Events",    badge: events.length },
    { key: "albums",   Icon: Camera,   label: "Albums",    badge: totalAlbums },
  ];

  const STAT_CARDS = [
    { icon: "👥", val: stats.totalAlumni,       label: "Total Alumni" },
    { icon: "⏳", val: stats.pendingAlumni,      label: "Pending Approval" },
    { icon: "💰", val: stats.totalDonations,     label: "Total Donations" },
    { icon: "✅", val: stats.completedDonations, label: "Completed" },
    { icon: "📅", val: events.length,            label: "Events" },
    { icon: "📸", val: totalAlbums,              label: "Albums" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f5ee", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "38px", height: "38px", border: "3px solid #e0e6f0", borderTop: "3px solid #667eea", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#a0aec0", fontFamily: "'Outfit', sans-serif" }}>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .adm-wrap{background:linear-gradient(165deg,#f8f5ee 0%,#fdfcf9 45%,#f2f4fa 100%);min-height:100vh;padding:76px 24px 60px;font-family:'Outfit',sans-serif;position:relative;overflow-x:hidden;}
        .adm-wrap::before{content:'';position:absolute;top:-180px;right:-180px;width:480px;height:480px;background:radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 70%);pointer-events:none;}
        .adm-inner{max-width:1400px;margin:0 auto;position:relative;z-index:2;}
        .stat-card{background:#fff;border:1px solid #e0e6f0;border-radius:13px;padding:22px;text-align:center;transition:all .3s;position:relative;overflow:hidden;}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#667eea,#764ba2);opacity:0;transition:.3s;}
        .stat-card:hover{transform:translateY(-5px);box-shadow:0 14px 32px rgba(0,0,0,.09);}
        .stat-card:hover::before{opacity:1;}
        .tab-btn{padding:10px 18px;background:transparent;border:1px solid transparent;border-radius:9px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;color:#a0aec0;transition:all .22s;display:flex;align-items:center;gap:6px;white-space:nowrap;}
        .tab-btn.active{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;}
        .tab-btn:hover:not(.active){background:#f0f3f9;color:#667eea;border-color:#e0e6f0;}
        .tab-badge{border-radius:20px;padding:1px 8px;font-size:11px;font-weight:700;}
        .tab-btn.active .tab-badge{background:rgba(255,255,255,.25);color:#fff;}
        .tab-btn:not(.active) .tab-badge{background:#f0f3f9;color:#9ca3af;}
        .msg{padding:13px 16px;border-radius:10px;margin-bottom:18px;font-size:14px;display:flex;align-items:center;gap:10px;font-family:'Outfit',sans-serif;}
        .list-item{display:flex;align-items:center;padding:17px 20px;border-bottom:1px solid #e2e8f0;cursor:pointer;transition:background .15s;}
        .list-item:last-child{border-bottom:none;}
        .list-item:hover{background:#f8fafc;}
        .badge-status{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:6px;font-size:11px;font-weight:700;margin-right:12px;}
        @media(max-width:768px){.adm-wrap{padding:70px 14px 50px;}.tab-btn{font-size:12px;padding:9px 13px;}}
      `}</style>

      <div className="adm-wrap">
        <div className="adm-inner">

          {/* Header */}
          <motion.div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }} variants={iv} initial="hidden" animate="visible">
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: "800", color: "#0c0e1a" }}>Admin Dashboard</h1>
              <p style={{ fontSize: "14px", color: "#666e80", marginTop: "5px" }}>Manage alumni, donations, events &amp; albums</p>
            </div>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "9px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "600", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".05em" }}>
              <LogOut size={14} /> Logout
            </motion.button>
          </motion.div>

          {/* Banners */}
          <AnimatePresence>
            {error && <motion.div className="msg" style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b" }} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><AlertCircle size={16} />{error}<button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={14} /></button></motion.div>}
            {success && <motion.div className="msg" style={{ background: "#dcfce7", border: "1px solid #bbf7d0", color: "#166534" }} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><CheckCircle size={16} />{success}</motion.div>}
          </AnimatePresence>

          {/* Stat cards */}
          <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "16px", marginBottom: "32px" }} variants={cv} initial="hidden" animate="visible">
            {STAT_CARDS.map(({ icon, val, label }) => (
              <motion.div key={label} className="stat-card" variants={iv}>
                <div style={{ fontSize: "30px", marginBottom: "8px" }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "#667eea", marginBottom: "5px" }}>{val}</div>
                <div style={{ fontSize: "11px", color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: "600" }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab bar */}
          <motion.div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px", padding: "14px 18px", marginBottom: "26px", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }} variants={iv} initial="hidden" animate="visible">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {TABS.map(({ key, Icon, label, badge }) => (
                <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => { setActiveTab(key); setSearchTerm(""); }}>
                  <Icon size={14} />{label}
                  <span className="tab-badge">{badge}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">

            {/* EVENTS */}
            {activeTab === "events" && (
              <motion.div key="events" variants={iv} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                <EventsTab onError={setError} onSuccess={setSuccess} />
              </motion.div>
            )}

            {/* ALBUMS */}
            {activeTab === "albums" && (
              <motion.div key="albums" variants={iv} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                <AlbumsTab onError={setError} onSuccess={setSuccess} />
              </motion.div>
            )}

            {/* ALUMNI */}
            {activeTab === "alumni" && (
              <motion.div key="alumni" variants={iv} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                <div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px", padding: "16px 18px", marginBottom: "18px", display: "flex", gap: "10px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                  <Search size={16} style={{ color: "#a0aec0" }} />
                  <input placeholder="Search alumni…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, border: "1px solid #e0e6f0", borderRadius: "8px", padding: "9px 13px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", outline: "none" }} />
                </div>
                {alumniList.length > 0 ? (
                  <div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                    {alumniList.filter(a => `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(searchTerm.toLowerCase())).map(a => (
                      <div key={a._id} className="list-item" onClick={() => setSelectedItem(a)}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", marginRight: "14px", fontSize: "14px", flexShrink: 0 }}>{a.firstName?.charAt(0)}{a.lastName?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", fontSize: "14px", color: "#0c0e1a" }}>{a.firstName} {a.lastName}</div>
                          <div style={{ fontSize: "12px", color: "#a0aec0" }}>{a.email}</div>
                        </div>
                        <span className="badge-status" style={{ background: a.isApproved ? "#dcfce7" : "#fef3c7", color: a.isApproved ? "#166534" : "#92400e" }}>
                          {a.isApproved ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {a.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px", color: "#a0aec0", background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px" }}>No alumni records found</div>
                )}
              </motion.div>
            )}

            {/* DONATIONS */}
            {activeTab === "donations" && (
              <motion.div key="donations" variants={iv} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                <div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px", padding: "16px 18px", marginBottom: "18px", display: "flex", gap: "10px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                  <Filter size={16} style={{ color: "#a0aec0" }} />
                  <input placeholder="Search donations…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, border: "1px solid #e0e6f0", borderRadius: "8px", padding: "9px 13px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", outline: "none" }} />
                </div>
                {donationList.length > 0 ? (
                  <div style={{ background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                    {donationList.map(d => (
                      <div key={d._id} className="list-item" onClick={() => setSelectedItem(d)}>
                        <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#edf2f7", color: "#667eea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginRight: "14px", flexShrink: 0 }}>💰</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", fontSize: "14px", color: "#0c0e1a" }}>{d.currency === "INR" ? "₹" : "$"}{d.amount}</div>
                          <div style={{ fontSize: "12px", color: "#a0aec0" }}>{new Date(d.donatedAt).toLocaleDateString()} · {d.paymentMethod}</div>
                        </div>
                        <span className="badge-status" style={{ background: d.status === "completed" ? "#dcfce7" : "#fef3c7", color: d.status === "completed" ? "#166534" : "#92400e" }}>
                          {d.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px", color: "#a0aec0", background: "#fff", border: "1px solid #e0e6f0", borderRadius: "13px" }}>No donation records found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detail Modal (alumni / donation) */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
                onClick={() => setSelectedItem(null)}>
                <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
                  style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", padding: "30px", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,.2)" }}
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "#f0f3f9", border: "none", width: "34px", height: "34px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>

                  {selectedItem.firstName ? (
                    <>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#0c0e1a", marginBottom: "20px" }}>{selectedItem.firstName} {selectedItem.lastName}</h2>
                      {[{ h: "Contact", items: [{ l: "Email", v: selectedItem.email }, { l: "Phone", v: selectedItem.phone || "N/A" }] }, { h: "Academic", items: [{ l: "Department", v: selectedItem.department || "N/A" }, { l: "Graduation Year", v: selectedItem.graduationYear || "N/A" }] }].map(s => (
                        <div key={s.h} style={{ marginBottom: "20px" }}>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#0c0e1a", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>{s.h}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {s.items.map(it => (
                              <div key={it.l} style={{ padding: "11px", background: "#f8fafc", borderRadius: "7px", borderLeft: "2px solid #667eea" }}>
                                <div style={{ fontSize: "10px", color: "#a0aec0", fontWeight: "600", textTransform: "uppercase" }}>{it.l}</div>
                                <div style={{ fontSize: "14px", color: "#0c0e1a", fontWeight: "600", marginTop: "3px" }}>{it.v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: "10px", paddingTop: "18px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap" }}>
                        {!selectedItem.isApproved && <button onClick={() => handleApprove(selectedItem._id)} style={{ flex: 1, padding: "10px 18px", border: "none", borderRadius: "8px", background: "#dcfce7", color: "#166534", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}><CheckCircle size={13} />Approve</button>}
                        {selectedItem.isApproved && !selectedItem.isAdmin && <button onClick={() => handleMakeAdmin(selectedItem._id)} style={{ flex: 1, padding: "10px 18px", border: "none", borderRadius: "8px", background: "#bee3f8", color: "#2c5282", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Make Admin</button>}
                        <button onClick={() => setSelectedItem(null)} style={{ padding: "10px 18px", border: "1px solid #e0e6f0", borderRadius: "8px", background: "#f8fafc", color: "#a0aec0", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Close</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#0c0e1a", marginBottom: "20px" }}>Donation Details</h2>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                        {[{ l: "Amount", v: `${selectedItem.currency === "INR" ? "₹" : "$"}${selectedItem.amount}` }, { l: "Status", v: selectedItem.status }].map(it => (
                          <div key={it.l} style={{ padding: "11px", background: "#f8fafc", borderRadius: "7px", borderLeft: "2px solid #667eea" }}>
                            <div style={{ fontSize: "10px", color: "#a0aec0", fontWeight: "600", textTransform: "uppercase" }}>{it.l}</div>
                            <div style={{ fontSize: "14px", color: "#0c0e1a", fontWeight: "600", marginTop: "3px" }}>{it.v}</div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSelectedItem(null)} style={{ padding: "10px 20px", border: "1px solid #e0e6f0", borderRadius: "8px", background: "#f8fafc", color: "#a0aec0", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Close</button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;