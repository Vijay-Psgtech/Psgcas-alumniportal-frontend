// src/pages/alumni/AlumniProfile.jsx
// ✅ Redesigned with Tailwind CSS — improved UI, responsiveness & spacing

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Edit,
  Save,
  X,
  LogOut,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Phone,
  Link2,
  Building2,
  Hash,
  Mail,
} from "lucide-react";
import { alumniAPI, authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* ─────────────────────────────────────────
   Tiny helper: label + value row
───────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
      <Icon size={15} className="text-indigo-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors"
        >
          View Profile ↗
        </a>
      ) : (
        <p
          className={`text-sm leading-relaxed ${value ? "text-slate-700 font-medium" : "text-slate-300 italic"}`}
        >
          {value || "Not provided"}
        </p>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Section card wrapper
───────────────────────────────────────── */
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-indigo-600" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 tracking-wide">
        {title}
      </h3>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

/* ─────────────────────────────────────────
   Form field
───────────────────────────────────────── */
const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm " +
  "placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 " +
  "focus:border-indigo-400 focus:bg-white transition-all duration-200";

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const AlumniProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  console.log('Alumni Profile');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  /* ── normalise location shape ── */
  const normalizeAlumni = (alumni) => {
    if (!alumni) return alumni;
    let locString = "";
    let coords = [];
    if (alumni.location) {
      if (typeof alumni.location === "object") {
        coords = Array.isArray(alumni.location.coordinates)
          ? alumni.location.coordinates
          : alumni.coordinates || [];
        locString =
          alumni.location.display_name ||
          (alumni.city && alumni.country
            ? `${alumni.city}, ${alumni.country}`
            : alumni.city || alumni.country || "");
      } else {
        locString = alumni.location;
        coords = alumni.coordinates || [];
      }
    } else {
      locString =
        alumni.city && alumni.country
          ? `${alumni.city}, ${alumni.country}`
          : alumni.city || alumni.country || "";
      coords = alumni.coordinates || [];
    }
    return { ...alumni, location: locString, coordinates: coords };
  };

  /* ── location autocomplete ── */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (locationQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${locationQuery}`,
        )
          .then((r) => r.json())
          .then((d) => setSuggestions(d));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationQuery]);

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const city =
      place.address?.city ||
      place.address?.state_district ||
      place.address?.town ||
      place.address?.village ||
      "";
    const country = place.address?.country || "";
    setEditData((prev) => ({
      ...prev,
      city: city || place.display_name,
      country: country || place.display_name.split(",").slice(-1)[0].trim(),
      fullAddress: place.display_name,
      coordinates: [lon, lat],
    }));
    setLocationQuery(place.display_name);
    setSuggestions([]);
  };

  const extractAlumni = (data) =>
    data?.alumni ?? data?.user ?? data?.data ?? data ?? null;

  /* ── load profile ── */
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.getProfile();
      const alumni = extractAlumni(response.data);
      if (!alumni) {
        setError("Profile data not found. Please contact support.");
        return;
      }
      const normalized = normalizeAlumni(alumni);
      setProfileData(normalized);
      setEditData(normalized);
      setLocationQuery(normalized.location || "");
    } catch (err) {
      if (err.response?.status === 401) navigate("/alumni/login");
      else
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again.",
        );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ── handlers ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "location") {
      setLocationQuery(value);
      setEditData((prev) => ({ ...prev, location: value, coordinates: [] }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (locationQuery && !editData.coordinates?.length) {
      setError("Please select a location from the suggestions.");
      return;
    }
    try {
      setError("");
      setSuccess("");
      const payload = { ...editData, location: locationQuery };
      const response = await alumniAPI.updateProfile(profileData._id, payload);
      const updated = normalizeAlumni(extractAlumni(response.data) || {});
      setProfileData(updated || payload);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  }, [profileData?._id, editData, locationQuery]);

  const handleCancel = useCallback(() => {
    setEditData(profileData);
    setIsEditing(false);
  }, [profileData]);
  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  /* ═══════════ LOADING STATE ═══════════ */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="w-11 h-11 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Loading your profile…
        </p>
      </div>
    );
  }

  /* ═══════════ ERROR STATE ═══════════ */
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={26} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Couldn't Load Profile
          </h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            {error || "Something went wrong while loading your profile."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={loadProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <RefreshCw size={14} /> Try Again
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    `${profileData.firstName?.charAt(0) ?? ""}${profileData.lastName?.charAt(0) ?? ""}`.toUpperCase();

  /* ═══════════ MAIN PROFILE UI ═══════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
              Alumni Portal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              My Profile
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {!isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                <Edit size={15} /> Edit Profile
              </motion.button>
            )}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut size={15} /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* ── Alert Banners ── */}
        {error && (
          <motion.div
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={17} className="flex-shrink-0" /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={17} className="flex-shrink-0" /> {success}
          </motion.div>
        )}

        {/* ── Profile Hero Card ── */}
        <motion.div
          className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* top accent stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-6 sm:px-8 py-8">
            {/* Avatar */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl sm:text-2xl font-extrabold shadow-lg shadow-indigo-200 select-none">
              {initials || "?"}
            </div>

            {/* Name + meta */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {profileData.firstName} {profileData.lastName}
              </h2>

              <p className="text-slate-500 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={13} className="text-slate-400" />{" "}
                {profileData.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                {profileData.isApproved && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle size={11} /> Verified Alumni
                  </span>
                )}
                {profileData.department && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <GraduationCap size={11} /> {profileData.department}
                  </span>
                )}
                {profileData.graduationYear && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Class of {profileData.graduationYear}
                  </span>
                )}
                {profileData.jobTitle && profileData.currentCompany && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Briefcase size={11} /> {profileData.jobTitle} @{" "}
                    {profileData.currentCompany}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Details: EDIT MODE ── */}
        {isEditing ? (
          <motion.div
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col gap-8">
              {/* Personal Info */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <User size={14} className="text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField label="First Name">
                    <input
                      type="text"
                      name="firstName"
                      className={inputCls}
                      value={editData.firstName || ""}
                      onChange={handleChange}
                      placeholder="First name"
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <input
                      type="text"
                      name="lastName"
                      className={inputCls}
                      value={editData.lastName || ""}
                      onChange={handleChange}
                      placeholder="Last name"
                    />
                  </FormField>
                  <FormField label="Phone Number">
                    <input
                      type="tel"
                      name="phone"
                      className={inputCls}
                      value={editData.phone || ""}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </FormField>
                  <FormField label="LinkedIn Profile">
                    <input
                      type="url"
                      name="linkedin"
                      className={inputCls}
                      value={editData.linkedin || ""}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </FormField>
                </div>
              </section>

              {/* Academic Info */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                    <GraduationCap size={14} className="text-violet-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    Academic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField label="Department">
                    <input
                      type="text"
                      name="department"
                      className={inputCls}
                      value={editData.department || ""}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                    />
                  </FormField>
                  <FormField label="Graduation Year">
                    <input
                      type="number"
                      name="graduationYear"
                      className={inputCls}
                      value={editData.graduationYear || ""}
                      onChange={handleChange}
                      placeholder="e.g. 2022"
                    />
                  </FormField>
                  <FormField label="Roll Number">
                    <input
                      type="text"
                      name="rollNumber"
                      className={inputCls}
                      value={editData.rollNumber || ""}
                      onChange={handleChange}
                      placeholder="e.g. CS20B001"
                    />
                  </FormField>
                </div>
              </section>

              {/* Professional Info */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Briefcase size={14} className="text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    Professional Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField label="Current Company">
                    <input
                      type="text"
                      name="currentCompany"
                      className={inputCls}
                      value={editData.currentCompany || ""}
                      onChange={handleChange}
                      placeholder="e.g. Google"
                    />
                  </FormField>
                  <FormField label="Job Title">
                    <input
                      type="text"
                      name="jobTitle"
                      className={inputCls}
                      value={editData.jobTitle || ""}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                    />
                  </FormField>
                </div>
              </section>

              {/* Location */}
              <section>
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin size={14} className="text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    Location
                  </h3>
                </div>
                <div className="relative">
                  <FormField label="Search Location">
                    <input
                      type="text"
                      name="location"
                      className={inputCls}
                      value={locationQuery}
                      onChange={handleChange}
                      placeholder="Start typing your city…"
                    />
                  </FormField>
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto">
                      {suggestions.map((place) => (
                        <button
                          key={place.place_id}
                          type="button"
                          onClick={() => handleSelect(place)}
                          className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border-b border-slate-100 last:border-0 transition-colors font-medium"
                        >
                          📍 {place.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 active:scale-[0.98] transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Details: VIEW MODE ── */
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Personal */}
            <SectionCard title="Personal Information" icon={User}>
              <InfoRow icon={Mail} label="Email" value={profileData.email} />
              <InfoRow icon={Phone} label="Phone" value={profileData.phone} />
              <InfoRow
                icon={Link2}
                label="LinkedIn"
                value={profileData.linkedin ? "View Profile" : null}
                href={profileData.linkedin}
              />
            </SectionCard>

            {/* Academic */}
            <SectionCard title="Academic Information" icon={GraduationCap}>
              <InfoRow
                icon={GraduationCap}
                label="Department"
                value={profileData.department}
              />
              <InfoRow
                icon={Hash}
                label="Graduation Year"
                value={profileData.graduationYear}
              />
              <InfoRow
                icon={Hash}
                label="Roll Number"
                value={profileData.rollNumber}
              />
            </SectionCard>

            {/* Professional */}
            <SectionCard title="Professional Information" icon={Briefcase}>
              <InfoRow
                icon={Building2}
                label="Company"
                value={profileData.currentCompany}
              />
              <InfoRow
                icon={Briefcase}
                label="Job Title"
                value={profileData.jobTitle}
              />
            </SectionCard>

            {/* Location */}
            <SectionCard title="Location" icon={MapPin}>
              <InfoRow
                icon={MapPin}
                label="Address"
                value={profileData.fullAddress || profileData.location}
              />
            </SectionCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
