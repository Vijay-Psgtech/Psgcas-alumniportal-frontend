import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Overlay, ModalHeader, FLabel, Inp } from "./AdminSharedUI";

const BLANK_ALBUM = {
  title: "",
  event: "",
  date: "",
  photos: "",
  accent: "#b8882a",
  tags: "",
};

export const AlbumFormModal = ({
  initial,
  year,
  onSave,
  onClose,
  isLoading,
}) => {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          tags: Array.isArray(initial.tags)
            ? initial.tags.join(", ")
            : initial.tags || "",
        }
      : BLANK_ALBUM,
  );
  const isEdit = !!initial?.id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.title.trim() && form.event.trim();

  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        title={isEdit ? "Update Album" : "Add New Album"}
        sub={isEdit ? `✏️ EDITING · ${year}` : `📸 NEW ALBUM · ${year}`}
        onClose={onClose}
      />
      <div className="px-7 pt-6 pb-7">
        <div className="flex flex-col gap-4">
          <FLabel label="Album Title">
            <Inp
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Alumni Congress Highlights"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Event Name">
            <Inp
              value={form.event}
              onChange={(e) => set("event", e.target.value)}
              placeholder="e.g. Alumni Congress 2026"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Date">
            <Inp
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              placeholder="e.g. Jan 10, 2026"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Number of Photos">
            <Inp
              type="number"
              value={form.photos}
              onChange={(e) => set("photos", e.target.value)}
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Tags (comma-separated)">
            <Inp
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="e.g. Awards, Gala, Networking"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Accent Color">
            <div className="flex gap-2.5 items-center">
              <input
                type="color"
                value={form.accent}
                onChange={(e) => set("accent", e.target.value)}
                disabled={isLoading}
                className={`w-12 h-10 border border-slate-200 rounded-lg p-0.5 bg-[#fafbfd] ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              />
              <span className="text-[13px] text-gray-400 font-['Outfit',_sans-serif]">
                Album theme color
              </span>
              <div
                className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                style={{ background: form.accent }}
              />
            </div>
          </FLabel>
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() =>
              valid &&
              onSave({
                ...form,
                tags: form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            disabled={!valid || isLoading}
            className={`flex-1 py-3 rounded-xl border-none font-['Outfit',_sans-serif] text-sm font-bold flex items-center justify-center gap-2 transition-all
                            ${valid && !isLoading ? "bg-gradient-to-br from-blue-600 to-blue-900 text-white cursor-pointer shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                            ${isLoading ? "opacity-70" : ""}`}
          >
            <CheckCircle size={15} />{" "}
            {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Album"}
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
      </div>
    </Overlay>
  );
};
