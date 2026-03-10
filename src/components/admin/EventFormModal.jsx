import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Overlay, ModalHeader, FLabel, Inp, Sel, Txt } from "./AdminSharedUI";

const CATEGORIES = [
  "Awards",
  "Lecture",
  "Sports",
  "Memorial",
  "Congress",
  "Workshop",
  "Networking",
  "Cultural",
  "Other",
];
const BLANK_EVENT = {
  title: "",
  date: "",
  time: "",
  venue: "PSG College of Arts & Science, Coimbatore",
  description: "",
  status: "upcoming",
  attendees: "",
  category: "Awards",
  highlight: false,
};

export const EventFormModal = ({ initial, onSave, onClose, isLoading }) => {
  const [form, setForm] = useState(initial || BLANK_EVENT);
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const valid = form.title.trim() && form.date && form.venue.trim();

  return (
    <Overlay onClose={onClose} wide>
      <ModalHeader
        title={isEdit ? "Update Event" : "Add New Event"}
        sub={isEdit ? "✏️ EDITING EVENT" : "➕ NEW EVENT"}
        onClose={onClose}
      />
      <div className="px-7 pt-6 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FLabel label="Event Title" span2>
            <Inp
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Alumni Congress 2027"
              disabled={isLoading}
            />
          </FLabel>

          <FLabel label="Category">
            <Sel
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              disabled={isLoading}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Sel>
          </FLabel>

          <FLabel label="Status">
            <Sel
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              disabled={isLoading}
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </Sel>
          </FLabel>

          <FLabel label="Date">
            <Inp
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              disabled={isLoading}
            />
          </FLabel>

          <FLabel label="Time">
            <Inp
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              disabled={isLoading}
            />
          </FLabel>

          <FLabel label="Venue" span2>
            <Inp
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Venue name, city"
              disabled={isLoading}
            />
          </FLabel>

          <FLabel label="Expected / Total Attendees">
            <Inp
              type="number"
              value={form.attendees}
              onChange={(e) => set("attendees", e.target.value)}
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </FLabel>

          <FLabel label="Highlight Event?">
            <div className="flex gap-2.5 pt-1">
              {[
                { v: true, label: "⭐ Yes" },
                { v: false, label: "No" },
              ].map(({ v, label }) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => set("highlight", v)}
                  disabled={isLoading}
                  className={`flex-1 py-2 rounded-xl border text-[13px] font-semibold font-['Outfit',_sans-serif] transition-all
                                        ${form.highlight === v ? "border-indigo-500 bg-indigo-50 text-indigo-500" : "border-slate-200 bg-[#fafbfd] text-gray-400"}
                                        ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-indigo-300"}
                                    `}
                >
                  {label}
                </button>
              ))}
            </div>
          </FLabel>

          <FLabel label="Description" span2>
            <Txt
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short event description visible on the event card…"
              disabled={isLoading}
            />
          </FLabel>
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid || isLoading}
            className={`flex-1 py-3 rounded-xl border-none font-['Outfit',_sans-serif] text-sm font-bold flex items-center justify-center gap-2 transition-all
                            ${valid && !isLoading ? "bg-gradient-to-br from-blue-500 to-blue-900 text-white cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                            ${isLoading ? "opacity-70" : ""}`}
          >
            <CheckCircle size={15} />{" "}
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl border border-slate-200 bg-slate-50 text-gray-400 font-['Outfit',_sans-serif] text-sm font-semibold transition-all
                            ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-slate-100 hover:text-gray-600"}`}
          >
            Cancel
          </button>
        </div>
        {!valid && (
          <p className="text-amber-500 text-xs mt-2 font-['Outfit',_sans-serif]">
            ⚠ Title, Date, and Venue are required.
          </p>
        )}
      </div>
    </Overlay>
  );
};
