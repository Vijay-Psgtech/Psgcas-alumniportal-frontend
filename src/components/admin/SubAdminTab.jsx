// frontend/src/components/admin/SubAdminTab.jsx
// Super-admin tab: create sub-admins, promote existing alumni, revoke access

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit2, Search, Shield, ShieldOff,
  UserCheck, Users, Building2, RefreshCw, X, Save,
  AlertCircle, CheckCircle, ChevronDown, Eye, EyeOff,
} from "lucide-react";
import { subAdminAPI, departmentAPI, alumniAPI } from "../../services/api";
import {
  Overlay, ModalHeader, FLabel, Inp, Sel, DeleteModal,
} from "./AdminSharedUI";

// ─────────────────────────────────────────────────────────────────────────────
// CREATE / EDIT MODAL
// ─────────────────────────────────────────────────────────────────────────────
const SubAdminModal = ({ departments, onClose, onSaved, editTarget }) => {
  const isEdit = !!editTarget;
  const [mode, setMode] = useState("create"); // "create" | "promote"
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [alumniSearch, setAlumniSearch] = useState("");
  const [alumniResults, setAlumniResults] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: editTarget?.firstName || "",
    lastName: editTarget?.lastName || "",
    email: editTarget?.email || "",
    password: "",
    departmentId: editTarget?.assignedDepartment?._id || editTarget?.assignedDepartment || "",
    isActive: editTarget ? editTarget.isApproved : true,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Alumni search for "promote" mode
  useEffect(() => {
    if (mode !== "promote" || alumniSearch.length < 2) {
      setAlumniResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await alumniAPI.getAllAlumni({ search: alumniSearch, limit: 8 });
        const list = res.data?.alumni || res.data?.data?.alumni || [];
        // Only show regular alumni (not already admins or sub-admins)
        setAlumniResults(list.filter((a) => !a.isAdmin && a.role !== "subAdmin"));
      } catch {
        setAlumniResults([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [alumniSearch, mode]);

  const handleSubmit = async () => {
    setError("");
    if (!form.departmentId) { setError("Please select a department"); return; }

    try {
      setSubmitting(true);
      if (isEdit) {
        await subAdminAPI.update(editTarget._id, {
          departmentId: form.departmentId,
          isActive: form.isActive,
        });
      } else if (mode === "promote") {
        if (!selectedAlumni) { setError("Please select an alumni to promote"); setSubmitting(false); return; }
        await subAdminAPI.promote(selectedAlumni._id, { departmentId: form.departmentId });
      } else {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
          setError("All fields are required"); setSubmitting(false); return;
        }
        await subAdminAPI.create({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          departmentId: form.departmentId,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save sub-admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClose={onClose} wide>
      <ModalHeader
        title={isEdit ? "Edit Sub-Admin" : "Add Sub-Admin"}
        sub="Sub-Admin Management"
        onClose={onClose}
      />
      <div className="p-7 flex flex-col gap-5">
        {/* Mode toggle — only for create */}
        {!isEdit && (
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {[
              { key: "create", label: "Create New Account", icon: Plus },
              { key: "promote", label: "Promote Existing Alumni", icon: UserCheck },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(""); setSelectedAlumni(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  mode === key
                    ? "bg-white text-[#667eea] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* PROMOTE MODE */}
        {!isEdit && mode === "promote" && (
          <FLabel label="Search Alumni">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Inp
                placeholder="Type name or email…"
                value={alumniSearch}
                onChange={(e) => setAlumniSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {alumniResults.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-1 shadow-sm">
                {alumniResults.map((a) => (
                  <button
                    key={a._id}
                    onClick={() => { setSelectedAlumni(a); setAlumniSearch(`${a.firstName} ${a.lastName}`); setAlumniResults([]); }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition"
                  >
                    <div className="text-sm font-semibold text-slate-700">{a.firstName} {a.lastName}</div>
                    <div className="text-xs text-slate-400">{a.email} · {a.department || "—"}</div>
                  </button>
                ))}
              </div>
            )}
            {selectedAlumni && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl mt-1">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-green-800">{selectedAlumni.firstName} {selectedAlumni.lastName}</div>
                  <div className="text-xs text-green-600">{selectedAlumni.email}</div>
                </div>
              </div>
            )}
          </FLabel>
        )}

        {/* CREATE MODE — new account fields */}
        {!isEdit && mode === "create" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FLabel label="First Name">
              <Inp placeholder="e.g. Rajesh" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </FLabel>
            <FLabel label="Last Name">
              <Inp placeholder="e.g. Kumar" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </FLabel>
            <FLabel label="Email" span2>
              <Inp type="email" placeholder="hod@psgtech.ac.in" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FLabel>
            <FLabel label="Password" span2>
              <div className="relative">
                <Inp
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FLabel>
          </div>
        )}

        {/* DEPARTMENT SELECT — always shown */}
        <FLabel label="Assign Department">
          <Sel value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
            <option value="">-- Select Department --</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.programmeType} · {d.fundingType})
              </option>
            ))}
          </Sel>
        </FLabel>

        {/* Active toggle — only when editing */}
        {isEdit && (
          <FLabel label="Account Status">
            <div className="flex items-center gap-3">
              <button
                onClick={() => set("isActive", !form.isActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? "bg-green-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
              <span className={`text-sm font-semibold ${form.isActive ? "text-green-700" : "text-slate-500"}`}>
                {form.isActive ? "Active" : "Deactivated"}
              </span>
            </div>
          </FLabel>
        )}

        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
          <button onClick={onClose} disabled={submitting} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-sm hover:shadow-lg transition disabled:opacity-50"
          >
            {submitting ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> {isEdit ? "Save Changes" : "Create Sub-Admin"}</>}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TAB COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SubAdminTab = ({ onError, onSuccess }) => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [saRes, deptRes] = await Promise.all([
        subAdminAPI.getAll(),
        departmentAPI.getAllAdmin(),
      ]);
      setSubAdmins(saRes.data?.data?.subAdmins || []);
      setDepartments(deptRes.data?.data?.departments || []);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await subAdminAPI.revoke(deleteTarget._id);
      onSuccess(`Sub-admin access revoked for ${deleteTarget.firstName} ${deleteTarget.lastName}`);
      setDeleteTarget(null);
      fetchAll();
    } catch (err) {
      onError(err.response?.data?.message || "Failed to revoke access");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = subAdmins.filter((sa) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${sa.firstName} ${sa.lastName}`.toLowerCase().includes(q) ||
      sa.email.toLowerCase().includes(q) ||
      sa.assignedDepartment?.name?.toLowerCase().includes(q)
    );
  });

  const programmeColors = { UG: "bg-blue-100 text-blue-700", PG: "bg-violet-100 text-violet-700" };
  const fundingColors = { Aided: "bg-amber-100 text-amber-700", SF: "bg-teal-100 text-teal-700" };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0c0e1a] font-['Playfair_Display',serif]">Sub-Admin Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Grant department-scoped access to HODs or coordinators
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-sm hover:shadow-lg transition shrink-0"
        >
          <Plus size={15} /> Add Sub-Admin
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sub-Admins", value: subAdmins.length, color: "text-[#667eea]", bg: "bg-[#667eea]/10" },
          { label: "Active", value: subAdmins.filter((s) => s.isApproved).length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Departments Covered", value: new Set(subAdmins.map((s) => s.assignedDepartment?._id)).size, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col gap-1`}>
            <span className={`text-2xl font-bold ${color}`}>{loading ? "—" : value}</span>
            <span className="text-xs text-slate-500 font-semibold">{label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search by name, email or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-[#fafbfd] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw size={22} className="animate-spin text-[#667eea]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <Shield size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">
            {search ? "No sub-admins match your search" : "No sub-admins yet"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Click "Add Sub-Admin" to grant department access
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-4 text-left font-semibold text-slate-600">Sub-Admin</th>
                  <th className="px-5 py-4 text-left font-semibold text-slate-600">Department</th>
                  <th className="px-5 py-4 text-center font-semibold text-slate-600">Type</th>
                  <th className="px-5 py-4 text-center font-semibold text-slate-600">Status</th>
                  <th className="px-5 py-4 text-right font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sa, idx) => (
                  <motion.tr
                    key={sa._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-slate-100 hover:bg-slate-50/60 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {sa.firstName?.[0]}{sa.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700">{sa.firstName} {sa.lastName}</div>
                          <div className="text-xs text-slate-400">{sa.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-medium">
                          {sa.assignedDepartment?.name || "—"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 ml-[22px]">
                        {sa.assignedDepartment?.degree || ""}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        {sa.assignedDepartment?.programmeType && (
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${programmeColors[sa.assignedDepartment.programmeType] || "bg-slate-100 text-slate-600"}`}>
                            {sa.assignedDepartment.programmeType}
                          </span>
                        )}
                        {sa.assignedDepartment?.fundingType && (
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${fundingColors[sa.assignedDepartment.fundingType] || "bg-slate-100 text-slate-600"}`}>
                            {sa.assignedDepartment.fundingType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${sa.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {sa.isApproved ? <><CheckCircle size={11} /> Active</> : <><ShieldOff size={11} /> Inactive</>}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setEditTarget(sa); setShowModal(true); }}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteTarget(sa)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Revoke access"
                        >
                          <ShieldOff size={15} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <SubAdminModal
            departments={departments}
            editTarget={editTarget}
            onClose={() => { setShowModal(false); setEditTarget(null); }}
            onSaved={() => { fetchAll(); onSuccess(editTarget ? "Sub-admin updated!" : "Sub-admin created!"); }}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            label={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
            isLoading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubAdminTab;