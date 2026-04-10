// src/pages/AlumniRegistration.jsx
// ✅ Matches PSG CAS demo form fields exactly
// ✅ Uses existing authAPI.register + useAuth from AuthContext
// ✅ 4-step multi-section form with location autocomplete
// ✅ File upload support (Business Card, ID, Poster, Photos)
// ✅ Calendar date picker for batch year, study start year, study end year
// ✅ AUTO-FILTER: Program names update automatically based on programme type

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  AlertCircle,
  Check,
  Clock,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Share2,
  FileImage,
  MapPin,
  User,
  Upload,
  X,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// ─── Constants ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Education", icon: GraduationCap },
  { id: 3, label: "Employment", icon: Briefcase },
  { id: 4, label: "More", icon: Share2 },
];

// ──────────────────────────────────────────────────────────────────────────────
// DEPARTMENTS ORGANIZED BY PROGRAMME TYPE
// ──────────────────────────────────────────────────────────────────────────────

const DEPARTMENTS_BY_TYPE = {
  UG: [
    "B.Sc. Computer Science",
    "B.Sc. Mathematics",
    "B.Sc. Physics",
    "B.Sc. Chemistry",
    "B.Sc. Zoology",
    "B.Sc. Botany",
    "B.Sc. Microbiology",
    "B.Sc. Biochemistry",
    "B.Sc. Statistics",
    "B.Sc. IT",
    "B.Sc. Visual Communication",
    "B.Sc. Fashion Design",
    "B.Sc. Electronics",
    "B.Sc. Psychology",
    "B.Sc. Nutrition, Food Service Management & Dietetics",
    "B.Com",
    "B.Com (CA)",
    "B.Com (Professional)",
    "B.Com Corporate Secretaryship",
    "BBA",
    "BA Economics",
    "BA English",
    "BA Sociology",
  ],
  PG: [
    "M.Sc. Computer Science",
    "M.Sc. Mathematics",
    "M.Sc. Physics",
    "M.Sc. Chemistry",
    "M.Sc. Biotechnology",
    "MBA",
    "M.Com",
    "MCA",
  ],
  "M.Phil": [
    "M.Phil. Computer Science",
    "M.Phil. Mathematics",
    "M.Phil. Physics",
    "M.Phil. Chemistry",
    "M.Phil. Zoology",
    "M.Phil. Botany",
  ],
  PhD: [
    "PhD Computer Science",
    "PhD Mathematics",
    "PhD Physics",
    "PhD Chemistry",
    "PhD Zoology",
    "PhD Botany",
    "PhD Biotechnology",
  ],
};

// Flat list of all departments for backward compatibility
const DEPARTMENTS = [
  "B.Sc. Computer Science",
  "B.Sc. Mathematics",
  "B.Sc. Physics",
  "B.Sc. Chemistry",
  "B.Sc. Zoology",
  "B.Sc. Botany",
  "B.Sc. Microbiology",
  "B.Sc. Biochemistry",
  "B.Sc. Statistics",
  "B.Sc. IT",
  "B.Sc. Visual Communication",
  "B.Sc. Fashion Design",
  "B.Sc. Electronics",
  "B.Sc. Psychology",
  "B.Sc. Nutrition, Food Service Management & Dietetics",
  "B.Com",
  "B.Com (CA)",
  "B.Com (Professional)",
  "B.Com Corporate Secretaryship",
  "BBA",
  "BA Economics",
  "BA English",
  "BA Sociology",
  "M.Sc. Computer Science",
  "M.Sc. Mathematics",
  "M.Sc. Physics",
  "M.Sc. Chemistry",
  "M.Sc. Biotechnology",
  "MBA",
  "M.Com",
  "MCA",
  "M.Phil. Computer Science",
  "M.Phil. Mathematics",
  "M.Phil. Physics",
  "M.Phil. Chemistry",
  "M.Phil. Zoology",
  "M.Phil. Botany",
  "PhD Computer Science",
  "PhD Mathematics",
  "PhD Physics",
  "PhD Chemistry",
  "PhD Zoology",
  "PhD Botany",
  "PhD Biotechnology",
];

const INDUSTRIES = [
  "Information Technology",
  "Banking & Financial Services",
  "Insurance",
  "Healthcare & Pharmaceuticals",
  "Education & Training",
  "Manufacturing",
  "Construction & Engineering",
  "Retail",
  "E-Commerce",
  "Consumer Goods (FMCG)",
  "Media & Entertainment",
  "Telecommunications",
  "Energy & Utilities",
  "Oil & Gas",
  "Mining & Metals",
  "Real Estate & Property",
  "Agriculture & Farming",
  "Food & Beverage",
  "Hospitality & Tourism",
  "Transportation",
  "Logistics & Supply Chain",
  "Automotive",
  "Aerospace & Defense",
  "Government & Public Administration",
  "Public Sector / PSU",
  "Non-Profit / NGO",
  "Legal Services",
  "Accounting & Auditing",
  "Consulting Services",
  "Human Resources",
  "Marketing & Advertising",
  "Market Research",
  "Design & Creative Services",
  "Architecture & Planning",
  "Scientific Research & Development",
  "Biotechnology",
  "Environmental Services",
  "Waste Management",
  "Security & Investigation",
  "Sports & Recreation",
  "Arts & Culture",
  "Import & Export",
  "Wholesale Trade",
  "Retail Trade",
  "Textiles & Apparel",
  "Electronics",
  "Semiconductors",
  "Internet & Web Services",
  "Artificial Intelligence & Data",
  "Cybersecurity",
  "Blockchain & Web3",
  "Cloud Computing",
  "Venture Capital & Private Equity",
  "Investment & Asset Management",
  "Startup & Innovation",
  "Freelancing & Gig Economy",
  "Other",
];
// ─── Year Picker Component ──────────────────────────────────────────────────
const YearPicker = ({ value, onChange, min = 1950, max = 2030 }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = Array.from(
    { length: max - min + 1 },
    (_, i) => max - i
  );
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative w-full" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white
        placeholder:text-slate-400 transition-all duration-150 outline-none
        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300
        flex items-center justify-between"
      >
        <span>{value || "Select Year"}</span>
        <Calendar size={16} className="text-slate-400" />
      </button>

      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-40 max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-3 py-2">
            <p className="text-xs font-semibold text-slate-500 text-center">
              Select Year
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1 p-3">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onChange(year.toString());
                  setShowPicker(false);
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  value === year.toString()
                    ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                    : year === currentYear
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
      {label} {required && <span className="text-blue-600">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-500 flex items-center gap-1">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

const inputCls = (err) =>
  `px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white
   placeholder:text-slate-400 transition-all duration-150 w-full outline-none
   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
   ${err ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:border-slate-300"}`;

const selectCls = (err) =>
  `px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white
   transition-all duration-150 w-full outline-none appearance-none
   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
   ${err ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:border-slate-300"}`;

// ─── File Upload Widget ──────────────────────────────────────────────────────
const FileUpload = ({
  label,
  icon,
  accept = "image/*",
  required = false,
  value,
  onChange,
}) => {
  const ref = useRef();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
        {label}{" "}
        {!required && (
          <span className="text-slate-400 normal-case font-normal">
            (optional)
          </span>
        )}
        {required && <span className="text-blue-600"> *</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer
          transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[90px]
          ${
            value
              ? "border-blue-400 bg-blue-50/40"
              : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/20"
          }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
        />
        {value ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Check size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 truncate max-w-40">
                  {value.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {(value.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:bg-red-200"
            >
              <X size={10} />
            </button>
          </>
        ) : (
          <>
            <div className="text-2xl">{icon}</div>
            <p className="text-xs text-slate-500 text-center">
              <span className="text-blue-600 font-semibold">
                Click to upload
              </span>{" "}
              or drag & drop
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AlumniRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Location autocomplete
  const [locationQuery, setLocationQuery] = useState("");
  const [resSuggestions, setResSuggestions] = useState([]);
  const [offSuggestions, setOffSuggestions] = useState([]);
  const [activeLocField, setActiveLocField] = useState(null); // 'residence' | 'office'

  // File uploads
  const [files, setFiles] = useState({
    businessCard: null,
    idCard: null,
    entrepreneurPoster: null,
    studentPhoto: null,
    currentPhoto: null,
  });

  const [form, setForm] = useState({
    // Personal
    firstName: "",
    lastName: "",
    rollNumber: "",
    gender: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    occupation: "",
    // Education
    programmeType: "",
    programmeName: "",
    degree: "",
    batchYear: "",
    studyStartYear: "",
    studyEndYear: "",
    // Employment
    jobTitle: "",
    companyName: "",
    industry: "",
    officeContact: "",
    officeAddress1: "",
    officeAddress2: "",
    officeCity: "",
    officeState: "",
    officePincode: "",
    officeCountry: "",
    officeCoordinates: [],
    // Social
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    // Residence
    resAddress1: "",
    resAddress2: "",
    resCity: "",
    resState: "",
    resPincode: "",
    resCountry: "",
    resCoordinates: [],
  });

  // ──────────────────────────────────────────────────────────────────────────
  // GET FILTERED DEPARTMENTS BASED ON PROGRAMME TYPE
  // ──────────────────────────────────────────────────────────────────────────

  const getFilteredDepartments = useCallback(() => {
    if (!form.programmeType) return [];
    return DEPARTMENTS_BY_TYPE[form.programmeType] || [];
  }, [form.programmeType]);

  // ──────────────────────────────────────────────────────────────────────────
  // HANDLE PROGRAMME TYPE CHANGE - AUTO UPDATE PROGRAMME NAME
  // ──────────────────────────────────────────────────────────────────────────

  const handleProgrammeTypeChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      programmeName: "", // Reset programme name when type changes
    }));
    setErrors((p) => ({ ...p, [name]: undefined, programmeName: undefined }));
  }, []);

  // Nominatim debounce
  useEffect(() => {
    if (!activeLocField) return;
    const query =
      activeLocField === "residence" ? form.resCity : form.officeCity;
    if (!query || query.length < 3) {
      activeLocField === "residence"
        ? setResSuggestions([])
        : setOffSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}`,
      )
        .then((r) => r.json())
        .then((data) => {
          if (activeLocField === "residence")
            setResSuggestions(data.slice(0, 6));
          else setOffSuggestions(data.slice(0, 6));
        })
        .catch(() => {});
    }, 350);
    return () => clearTimeout(t);
  }, [form.resCity, form.officeCity, activeLocField]);

  const handleSelectLocation = (place, type) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const city =
      place.address?.city ||
      place.address?.state_district ||
      place.address?.town ||
      place.address?.village ||
      place.display_name.split(",")[0];
    const state = place.address?.state || "";
    const country = place.address?.country || "";
    const pincode = place.address?.postcode || "";

    if (type === "residence") {
      setForm((p) => ({
        ...p,
        resCity: city,
        resState: state,
        resCountry: country,
        resPincode: pincode,
        resCoordinates: [lon, lat],
      }));
      setResSuggestions([]);
    } else {
      setForm((p) => ({
        ...p,
        officeCity: city,
        officeState: state,
        officeCountry: country,
        officePincode: pincode,
        officeCoordinates: [lon, lat],
      }));
      setOffSuggestions([]);
    }
    setActiveLocField(null);
  };

  const set = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const e = {};
    if (step === 1) {
      if (!form.firstName.trim()) e.firstName = "First Name required";
      if (!form.gender) e.gender = "Please select gender";
      if (!/^\d{10}$/.test(form.contactNumber.replace(/\s/g, "")))
        e.contactNumber = "Enter valid 10-digit number";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Valid email required";
      if (!form.password || form.password.length < 6)
        e.password = "Minimum 6 characters";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords don't match";
      if (!form.occupation) e.occupation = "Please select occupation";
    }
    if (step === 2) {
      if (!form.programmeType) e.programmeType = "Select programme type";
      if (!form.programmeName.trim())
        e.programmeName = "Programme name required";
      if (!form.degree.trim()) e.degree = "Degree required";
      if (!form.batchYear) e.batchYear = "Batch year required";
      if (!form.studyStartYear) e.studyStartYear = "Start year required";
      if (!form.studyEndYear) e.studyEndYear = "End year required";
    }
    if (step === 3) {
      // Employment is mostly optional, but validate office contact if filled
      if (
        form.officeContact &&
        !/^\d{10,}$/.test(form.officeContact.replace(/\s/g, ""))
      )
        e.officeContact = "Enter valid phone number";
    }
    if (step === 4) {
      if (!files.currentPhoto) e.currentPhoto = "Current photo is required";
      if (!form.resCity.trim()) e.resCity = "City required";
      if (!form.resState.trim()) e.resState = "State required";
      if (!form.resCountry.trim()) e.resCountry = "Country required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, files, step]);

  const handleNext = () => {
    if (validate()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      setErrors({});

      try {
        const payload = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
          phone: form.contactNumber.trim(),
          rollNumber: form.rollNumber.trim(),
          gender: form.gender,
          occupation: form.occupation,

          // Education
          department: form.programmeName.trim(),
          programmeType: form.programmeType,
          degree: form.degree.trim(),
          batchYear: form.batchYear,
          studyStartYear: form.studyStartYear,
          studyEndYear: form.studyEndYear,

          // Employment
          jobTitle: form.jobTitle.trim(),
          currentCompany: form.companyName.trim(),
          industry: form.industry.trim(),
          officeContact: form.officeContact.trim(),

          officeAddress: {
            line1: form.officeAddress1.trim(),
            line2: form.officeAddress2.trim(),
            city: form.officeCity.trim(),
            state: form.officeState.trim(),
            pincode: form.officePincode.trim(),
            country: form.officeCountry.trim(),
          },

          // Social
          linkedin: form.linkedin.trim(),
          twitter: form.twitter.trim(),
          instagram: form.instagram.trim(),
          facebook: form.facebook.trim(),
          website: form.website.trim(),

          // Residence
          city: form.resCity.trim(),
          country: form.resCountry.trim(),
          fullAddress: `${form.resAddress1}, ${form.resAddress2}, ${form.resCity}, ${form.resState} - ${form.resPincode}, ${form.resCountry}`,
          coordinates: form.resCoordinates.length ? form.resCoordinates : [],
        };

        // Create FormData
        const formData = new FormData();

        // Append payload
        formData.append("payload", JSON.stringify(payload));

        // Append files
        if (files.businessCard)
          formData.append("businessCard", files.businessCard);

        if (files.idCard) formData.append("idCard", files.idCard);

        if (files.entrepreneurPoster)
          formData.append("entrepreneurPoster", files.entrepreneurPoster);

        if (files.studentPhoto)
          formData.append("studentPhoto", files.studentPhoto);

        if (files.currentPhoto)
          formData.append("currentPhoto", files.currentPhoto);

        const response = await authAPI.register(formData);

        const alumni = response.data?.data;

        if (alumni) {
          await login(alumni);
        }

        setRegistered(true);
      } catch (err) {
        setErrors({
          general:
            err.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [form, files, validate, login],
  );

  // ── Pending Approval Screen ────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-6 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
            <Check size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
            Registration Submitted!
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Your alumni profile has been submitted for review. An admin will
            verify and approve your account. You'll receive full access once
            approved.
          </p>

          <div className="space-y-3 text-left mb-8">
            {[
              {
                done: true,
                color: "green",
                label: "Account registered successfully",
              },
              { done: false, color: "yellow", label: "Admin approval pending" },
              {
                done: false,
                color: "blue",
                label: "Access alumni network & features",
              },
            ].map(({ done, color, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${
                    done
                      ? "bg-green-100 text-green-600"
                      : color === "yellow"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {done ? (
                    <Check size={13} />
                  ) : color === "yellow" ? (
                    <Clock size={13} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-sm text-slate-600">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl bg-linear-to-r from-[#0052ab] to-[#0073e6] text-white font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 md:p-12"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0f7ff 100%)",
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-start py-10 px-4">
        {/* Header */}
        <div className="w-full max-w-3xl mb-7 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0052ab]/60 mb-1">
            PSG College of Arts &amp; Science
          </p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Alumni Registration
          </h1>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full max-w-3xl mb-7">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 font-bold text-sm
                      ${
                        done
                          ? "bg-green-500 text-white shadow-sm shadow-green-200"
                          : active
                            ? "bg-[#0052ab] text-white shadow-md shadow-blue-200"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done ? <Check size={15} /> : <Icon size={15} />}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest leading-none
                        ${active ? "text-[#0052ab]" : done ? "text-green-600" : "text-slate-400"}`}
                      >
                        Step {s.id}
                      </span>
                      <span
                        className={`text-sm font-semibold leading-tight
                        ${active ? "text-slate-800" : done ? "text-slate-600" : "text-slate-400"}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 mx-3 h-0.5 rounded-full transition-all duration-500"
                      style={{
                        background: step > s.id ? "#22c55e" : "#e2e8f0",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-3xl">
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card Header Bar */}
            <div className="bg-linear-to-r from-[#0052ab] to-[#0073e6] px-8 py-5 flex items-center gap-3">
              {(() => {
                const Icon = STEPS[step - 1].icon;
                return <Icon size={18} className="text-white/80" />;
              })()}
              <div>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">
                  Step {step} of {STEPS.length}
                </p>
                <h2 className="text-white font-bold text-base tracking-tight">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Education Details"}
                  {step === 3 && "Employment Details"}
                  {step === 4 && "Social Media, Documents & Address"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {errors.general}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* ══════════ STEP 1: PERSONAL ══════════ */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="First Name" required error={errors.firstName}>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={set}
                          placeholder="e.g. Arjun"
                          className={inputCls(errors.firstName)}
                        />
                      </Field>

                      <Field label="Last Name" error={errors.lastName}>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={set}
                          placeholder="e.g. Kumar"
                          className={inputCls(errors.lastName)}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Roll Number" error={errors.rollNumber}>
                        <input
                          type="text"
                          name="rollNumber"
                          value={form.rollNumber}
                          onChange={set}
                          placeholder="e.g. 20CSE001"
                          className={inputCls(errors.rollNumber)}
                        />
                      </Field>
                      <Field label="Gender" required error={errors.gender}>
                        <div className="relative">
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={set}
                            className={selectCls(errors.gender)}
                          >
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                          <ChevronRight
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Contact Number"
                        required
                        error={errors.contactNumber}
                      >
                        <input
                          type="tel"
                          name="contactNumber"
                          value={form.contactNumber}
                          onChange={set}
                          placeholder="+91 98765 43210"
                          className={inputCls(errors.contactNumber)}
                        />
                      </Field>
                      <Field
                        label="Occupation"
                        required
                        error={errors.occupation}
                      >
                        <div className="relative">
                         <select
  name="occupation"
  value={form.occupation}
  onChange={set}
  className={selectCls(errors.occupation)}
>
  <option value="">Select Occupation</option>

  {/* General */}
  <option>Employed</option>
  <option>Entrepreneur</option>
  <option>Professional</option>
  <option>Home Maker</option>
  <option>Agriculture</option>
  <option>Others</option>

  {/* Finance & Accounting */}
  <option>Chartered Accountant (CA)</option>
  <option>Cost and Management Accountant (CMA)</option>
  <option>Company Secretary (CS)</option>
  <option>CFA (Chartered Financial Analyst)</option>
  <option>CPA (Certified Public Accountant)</option>
  <option>FRM (Financial Risk Manager)</option>
  <option>CFP (Certified Financial Planner)</option>
  <option>ACCA</option>
  <option>Accountant</option>
  <option>Internal Auditor</option>
  <option>External Auditor</option>
  <option>Tax Consultant</option>
  <option>Tax Practitioner</option>
  <option>Financial Analyst</option>
  <option>Investment Banker</option>
  <option>Credit Analyst</option>
  <option>Risk Analyst</option>
  <option>Equity Research Analyst</option>

  {/* Legal */}
  <option>Lawyer / Advocate</option>
  <option>Legal Advisor</option>
  <option>Corporate Counsel</option>
  <option>Company Law Consultant</option>
  <option>Compliance Officer</option>
  <option>Arbitrator / Mediator</option>

  {/* Medical */}
  <option>Doctor</option>
  <option>Dentist</option>
  <option>Pharmacist</option>
  <option>Physiotherapist</option>
  <option>Nurse</option>
  <option>Medical Lab Technician</option>
  <option>Radiologist</option>
  <option>Psychologist / Psychiatrist</option>
  <option>Nutritionist / Dietitian</option>

  {/* IT & Tech */}
  <option>Software Engineer</option>
  <option>Data Analyst / Data Scientist</option>
  <option>Cyber Security Expert</option>
  <option>Web Developer</option>
  <option>AI / Machine Learning Engineer</option>
  <option>Cloud Engineer</option>
  <option>DevOps Engineer</option>
  <option>UI/UX Designer</option>
  <option>Blockchain Developer</option>

  {/* Education & Research */}
  <option>Professor / Lecturer</option>
  <option>Teacher</option>
  <option>Research Analyst</option>
  <option>Academic Consultant</option>
  <option>Scientist</option>
  <option>Research Scholar</option>
  <option>Education Administrator</option>

  {/* Management & Corporate */}
  <option>Managing Director</option>
  <option>General Manager</option>
  <option>HR Manager</option>
  <option>Marketing Manager</option>
  <option>Operations Manager</option>
  <option>Finance Manager</option>
  <option>Supervisor</option>
  <option>Administrator</option>
  <option>Business Analyst</option>
  <option>Project Manager</option>
  <option>Product Manager</option>
  <option>Supply Chain Manager</option>

  {/* Business & Startup */}
  <option>Entrepreneur / Business Owner</option>
  <option>Startup Founder</option>
  <option>Co-founder</option>
  <option>Business Consultant</option>
  <option>Franchise Owner</option>

  {/* Creative */}
  <option>Graphic Designer</option>
  <option>Content Creator</option>
  <option>Film Maker</option>
  <option>Fashion Designer</option>
  <option>Digital Marketer</option>
  <option>Social Media Manager</option>
  <option>Animator / Video Editor</option>
  <option>Photographer</option>

  {/* Hospitality */}
  <option>Master Chef</option>
  <option>Hotel Manager</option>
  <option>Event Manager</option>
  <option>Travel Consultant</option>

  {/* Admin & Support */}
  <option>Clerical Staff</option>
  <option>Associate</option>
  <option>Office Assistant</option>
  <option>Executive Assistant</option>

  {/* Government */}
  <option>Civil Servant (IAS/IPS/IFS)</option>
  <option>Government Officer</option>
  <option>Public Policy Analyst</option>
  <option>PSU Professional</option>

  {/* Engineering */}
  <option>Mechanical Engineer</option>
  <option>Civil Engineer</option>
  <option>Electrical Engineer</option>
  <option>Architect</option>
  <option>Industrial Engineer</option>
</select>
                          <ChevronRight
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </Field>
                    </div>

                    <Field
                      label="Email Address"
                      required
                      error={errors.email}
                    >
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={set}
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        className={inputCls(errors.email)}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Password"
                        required
                        error={errors.password}
                      >
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={set}
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                            className={inputCls(errors.password)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </Field>
                      <Field
                        label="Confirm Password"
                        required
                        error={errors.confirmPassword}
                      >
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={set}
                            placeholder="Re-enter password"
                            autoComplete="new-password"
                            className={inputCls(errors.confirmPassword)}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((p) => !p)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                      </Field>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ STEP 2: EDUCATION ══════════ */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* PROGRAMME TYPE DROPDOWN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Programme Type"
                        required
                        error={errors.programmeType}
                      >
                        <div className="relative">
                          <select
                            name="programmeType"
                            value={form.programmeType}
                            onChange={handleProgrammeTypeChange}
                            className={selectCls(errors.programmeType)}
                          >
                            <option value="">Select Programme Type</option>
                            <option>UG</option>
                            <option>PG</option>
                            <option>M.Phil</option>
                            <option>PhD</option>
                          </select>
                          <ChevronRight
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </Field>

                      {/* PROGRAMME NAME DROPDOWN - AUTO-FILTERED */}
                      <Field
                        label="Department Name"
                        required
                        error={errors.programmeName}
                      >
                        <div className="relative">
                          <select
                            name="programmeName"
                            value={form.programmeName}
                            onChange={set}
                            disabled={!form.programmeType}
                            className={`${selectCls(errors.programmeName)} ${
                              !form.programmeType
                                ? "opacity-50 cursor-not-allowed bg-slate-50"
                                : ""
                            }`}
                          >
                            <option value="">
                              {form.programmeType
                                ? "Select Department"
                                : "Select Programme Type First"}
                            </option>
                            {getFilteredDepartments().map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                          <ChevronRight
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </Field>
                    </div>

                    <Field
                      label="Degree Completed"
                      required
                      error={errors.degree}
                    >
                      <input
                        type="text"
                        name="degree"
                        value={form.degree}
                        onChange={set}
                        placeholder="e.g. B.Sc. Computer Science"
                        className={inputCls(errors.degree)}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <Field
                        label="Batch Year"
                        required
                        error={errors.batchYear}
                      >
                        <YearPicker
                          value={form.batchYear}
                          onChange={(value) =>
                            setForm((p) => ({ ...p, batchYear: value }))
                          }
                          min={1950}
                          max={2030}
                        />
                      </Field>
                      <Field
                        label="Study Start Year"
                        required
                        error={errors.studyStartYear}
                      >
                        <YearPicker
                          value={form.studyStartYear}
                          onChange={(value) =>
                            setForm((p) => ({
                              ...p,
                              studyStartYear: value,
                            }))
                          }
                          min={1950}
                          max={2030}
                        />
                      </Field>
                      <Field
                        label="Study End Year"
                        required
                        error={errors.studyEndYear}
                      >
                        <YearPicker
                          value={form.studyEndYear}
                          onChange={(value) =>
                            setForm((p) => ({ ...p, studyEndYear: value }))
                          }
                          min={1950}
                          max={2030}
                        />
                      </Field>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ STEP 3: EMPLOYMENT ══════════ */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Job Title / Designation"
                        error={errors.jobTitle}
                      >
                        <input
                          type="text"
                          name="jobTitle"
                          value={form.jobTitle}
                          onChange={set}
                          placeholder="e.g. Software Engineer"
                          className={inputCls(errors.jobTitle)}
                        />
                      </Field>
                      <Field label="Company Name" error={errors.companyName}>
                        <input
                          type="text"
                          name="companyName"
                          value={form.companyName}
                          onChange={set}
                          placeholder="e.g. Infosys"
                          className={inputCls(errors.companyName)}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Industry" error={errors.industry}>
                        <div className="relative">
                          <select
                            name="industry"
                            value={form.industry}
                            onChange={set}
                            className={selectCls(errors.industry)}
                          >
                            <option value="">Select Industry</option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind}>{ind}</option>
                            ))}
                          </select>
                          <ChevronRight
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                          />
                        </div>
                      </Field>
                      <Field
                        label="Office Contact Number"
                        error={errors.officeContact}
                      >
                        <input
                          type="tel"
                          name="officeContact"
                          value={form.officeContact}
                          onChange={set}
                          placeholder="+91 44 2222 3333"
                          className={inputCls(errors.officeContact)}
                        />
                      </Field>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Office Address
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field
                            label="Address Line 1"
                            error={errors.officeAddress1}
                          >
                            <input
                              type="text"
                              name="officeAddress1"
                              value={form.officeAddress1}
                              onChange={set}
                              placeholder="Street / Building"
                              className={inputCls(errors.officeAddress1)}
                            />
                          </Field>
                          <Field
                            label="Address Line 2"
                            error={errors.officeAddress2}
                          >
                            <input
                              type="text"
                              name="officeAddress2"
                              value={form.officeAddress2}
                              onChange={set}
                              placeholder="Area / Landmark"
                              className={inputCls(errors.officeAddress2)}
                            />
                          </Field>
                        </div>

                        {/* Office City with autocomplete */}
                        <div className="relative">
                          <Field label="City" error={errors.officeCity}>
                            <input
                              type="text"
                              name="officeCity"
                              value={form.officeCity}
                              onChange={(e) => {
                                set(e);
                                setActiveLocField("office");
                              }}
                              placeholder="Type to search city..."
                              autoComplete="off"
                              className={inputCls(errors.officeCity)}
                            />
                          </Field>
                          {offSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                              {offSuggestions.map((pl) => (
                                <div
                                  key={pl.place_id}
                                  onClick={() =>
                                    handleSelectLocation(pl, "office")
                                  }
                                  className="px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0 border-slate-100 flex items-center gap-2"
                                >
                                  <MapPin
                                    size={11}
                                    className="text-slate-400 shrink-0"
                                  />
                                  {pl.display_name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <Field label="State" error={errors.officeState}>
                            <input
                              type="text"
                              name="officeState"
                              value={form.officeState}
                              onChange={set}
                              placeholder="Tamil Nadu"
                              className={inputCls(errors.officeState)}
                            />
                          </Field>
                          <Field label="Pincode" error={errors.officePincode}>
                            <input
                              type="text"
                              name="officePincode"
                              value={form.officePincode}
                              onChange={set}
                              placeholder="641004"
                              className={inputCls(errors.officePincode)}
                            />
                          </Field>
                          <Field label="Country" error={errors.officeCountry}>
                            <input
                              type="text"
                              name="officeCountry"
                              value={form.officeCountry}
                              onChange={set}
                              placeholder="India"
                              className={inputCls(errors.officeCountry)}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ STEP 4: SOCIAL + DOCS + RESIDENCE ══════════ */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Social Media */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Social Media Links
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            name: "linkedin",
                            label: "LinkedIn",
                            placeholder: "https://linkedin.com/in/username",
                          },
                          {
                            name: "twitter",
                            label: "Twitter / X",
                            placeholder: "https://twitter.com/username",
                          },
                          {
                            name: "instagram",
                            label: "Instagram",
                            placeholder: "https://instagram.com/username",
                          },
                          {
                            name: "facebook",
                            label: "Facebook",
                            placeholder: "https://facebook.com/username",
                          },
                          {
                            name: "website",
                            label: "Personal Website",
                            placeholder: "https://yoursite.com",
                          },
                        ].map(({ name, label, placeholder }) => (
                          <Field key={name} label={label}>
                            <input
                              type="url"
                              name={name}
                              value={form[name]}
                              onChange={set}
                              placeholder={placeholder}
                              className={inputCls(false)}
                            />
                          </Field>
                        ))}
                      </div>
                    </div>

                    {/* Documents & Photos */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Documents &amp; Photos
                      </p>
                      {errors.currentPhoto && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1 mb-3">
                          <AlertCircle size={11} /> {errors.currentPhoto}
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FileUpload
                          label="Business Card"
                          icon="📇"
                          value={files.businessCard}
                          onChange={(f) =>
                            setFiles((p) => ({ ...p, businessCard: f }))
                          }
                        />
                        <FileUpload
                          label="ID Card"
                          icon="🪪"
                          value={files.idCard}
                          onChange={(f) =>
                            setFiles((p) => ({ ...p, idCard: f }))
                          }
                        />
                        <FileUpload
                          label="Entrepreneur Poster"
                          icon="📢"
                          value={files.entrepreneurPoster}
                          onChange={(f) =>
                            setFiles((p) => ({
                              ...p,
                              entrepreneurPoster: f,
                            }))
                          }
                        />
                        <FileUpload
                          label="Student Photo"
                          icon="🎓"
                          value={files.studentPhoto}
                          onChange={(f) =>
                            setFiles((p) => ({
                              ...p,
                              studentPhoto: f,
                            }))
                          }
                        />
                        <FileUpload
                          label="Current Photo"
                          icon="📷"
                          required
                          value={files.currentPhoto}
                          onChange={(f) =>
                            setFiles((p) => ({ ...p, currentPhoto: f }))
                          }
                        />
                      </div>
                    </div>

                    {/* Residence Address */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Residence Address
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field
                            label="Address Line 1"
                            error={errors.resAddress1}
                          >
                            <input
                              type="text"
                              name="resAddress1"
                              value={form.resAddress1}
                              onChange={set}
                              placeholder="Door No / Street"
                              className={inputCls(errors.resAddress1)}
                            />
                          </Field>
                          <Field
                            label="Address Line 2"
                            error={errors.resAddress2}
                          >
                            <input
                              type="text"
                              name="resAddress2"
                              value={form.resAddress2}
                              onChange={set}
                              placeholder="Area / Locality"
                              className={inputCls(errors.resAddress2)}
                            />
                          </Field>
                        </div>

                        {/* Residence City with autocomplete */}
                        <div className="relative">
                          <Field label="City" required error={errors.resCity}>
                            <input
                              type="text"
                              name="resCity"
                              value={form.resCity}
                              onChange={(e) => {
                                set(e);
                                setActiveLocField("residence");
                              }}
                              placeholder="Type to search city..."
                              autoComplete="off"
                              className={inputCls(errors.resCity)}
                            />
                          </Field>
                          {resSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                              {resSuggestions.map((pl) => (
                                <div
                                  key={pl.place_id}
                                  onClick={() =>
                                    handleSelectLocation(pl, "residence")
                                  }
                                  className="px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0 border-slate-100 flex items-center gap-2"
                                >
                                  <MapPin
                                    size={11}
                                    className="text-slate-400 shrink-0"
                                  />
                                  {pl.display_name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <Field label="State" required error={errors.resState}>
                            <input
                              type="text"
                              name="resState"
                              value={form.resState}
                              onChange={set}
                              placeholder="Tamil Nadu"
                              className={inputCls(errors.resState)}
                            />
                          </Field>
                          <Field label="Pincode" error={errors.resPincode}>
                            <input
                              type="text"
                              name="resPincode"
                              value={form.resPincode}
                              onChange={set}
                              placeholder="641004"
                              className={inputCls(errors.resPincode)}
                            />
                          </Field>
                          <Field
                            label="Country"
                            required
                            error={errors.resCountry}
                          >
                            <input
                              type="text"
                              name="resCountry"
                              value={form.resCountry}
                              onChange={set}
                              placeholder="India"
                              className={inputCls(errors.resCountry)}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div
                className={`flex mt-8 pt-6 border-t border-slate-100 ${step > 1 ? "justify-between" : "justify-end"}`}
              >
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200
                    text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all duration-150"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}

                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r
                    from-[#0052ab] to-[#0073e6] text-white text-sm font-semibold
                    hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-linear-to-r
                    from-[#0052ab] to-[#0073e6] text-white text-sm font-semibold
                    hover:shadow-lg hover:shadow-blue-200 transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check size={16} /> Submit Alumni Information
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="text-center text-xs text-slate-400 mt-5">
                Already registered?{" "}
                <Link
                  to="/alumni/login"
                  className="text-[#0052ab] font-semibold hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </motion.div>

          <p className="text-center text-[11px] text-slate-400 mt-6 pb-2">
            © {new Date().getFullYear()} PSG College of Arts &amp; Science
            Alumni Platform · Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlumniRegistration;