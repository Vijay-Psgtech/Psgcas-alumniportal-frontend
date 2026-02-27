import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle, Check, Clock } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AlumniRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registered, setRegistered] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    graduationYear: new Date().getFullYear(),
    rollNumber: "",
    currentCompany: "",
    jobTitle: "",
    country: "",
    city: "",
    fullAddress: "",
    coordinates: [],
    linkedin: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (locationQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${locationQuery}`,
        )
          .then((res) => res.json())
          .then((data) => setSuggestions(data));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationQuery]);

  const handleSelect = (place) => {
    console.log("Place", place);
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const city =
      place.address?.city ||
      place.address?.state_district ||
      place.address?.town ||
      place.address?.village ||
      "";
    const country = place.address?.country || "";

    setFormData((prev) => ({
      ...prev,
      city: city || place.display_name,
      country: country || place.display_name.split(",").slice(-1)[0].trim(),
      fullAddress: place.display_name,
      coordinates: [lon, lat],
    }));
    setLocationQuery(place.display_name);
    setSuggestions([]);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    name === "location"
      ? setLocationQuery(value)
      : setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const validateStep = useCallback(() => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.email = "Valid email required";
      if (!formData.password) newErrors.password = "Password required";
      if (formData.password.length < 6)
        newErrors.password = "Minimum 6 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    } else {
      if (!formData.department.trim())
        newErrors.department = "Department required";
      if (!formData.graduationYear)
        newErrors.graduationYear = "Graduation year required";
      if (!formData.coordinates.length)
        newErrors.coordinates = "Please select a location from suggestions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep]);

  const handleNext = useCallback(() => {
    if (validateStep()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateStep]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateStep()) return;
      setLoading(true);
      setErrors({});
      try {
        const payload = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          graduationYear: Number(formData.graduationYear),
          rollNumber: formData.rollNumber.trim(),
          currentCompany: formData.currentCompany.trim(),
          jobTitle: formData.jobTitle.trim(),
          country: formData.country.trim(),
          city: formData.city.trim(),
          fullAddress: formData.fullAddress.trim(),
          coordinates: formData.coordinates,
          linkedin: formData.linkedin.trim(),
        };
        const response = await authAPI.register(payload);
        // Server sets HttpOnly cookie automatically — no token in response body
        const alumni = response.data.alumni;
        if (alumni) {
          await login(alumni); // seed AuthContext state; cookie already set by server
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
    [formData, validateStep, login],
  );

  // ── Pending Approval Screen ──────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <div className="bg-white rounded-xl p-12 max-w-md w-full text-center shadow-lg border border-gray-200 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center mx-auto mb-6 text-4xl">
            ⏳
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
            Registration Submitted!
          </h2>
          <p className="text-sm text-gray-600 mb-7">
            Your alumni account has been created. An admin will review and
            approve your application. You'll gain full access once approved.
          </p>
          <div className="bg-gray-50 rounded-lg p-5 text-left mb-7 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-900">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-100 text-green-700">
                <Check size={13} />
              </div>
              Account registered
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-900">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-yellow-100 text-yellow-800">
                <Clock size={13} />
              </div>
              Waiting for admin approval
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-900">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-100 text-indigo-700">
                3
              </div>
              Access alumni network &amp; features
            </div>
          </div>
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0052ab] to-[#0052ab]/80 text-white font-semibold uppercase hover:shadow-lg transition"
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Registration Form ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-20 px-4 flex items-center justify-center relative">
      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-9">
          <motion.div
            className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#0052ab] to-[#0052ab]/80 flex items-center justify-center mx-auto mb-5 text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <UserPlus size={36} />
          </motion.div>
          <h1 className="font-serif text-3xl font-extrabold text-gray-900 mb-2">
            Join Alumni Network
          </h1>
          <p className="text-sm text-gray-600 font-light">
            Register to connect with fellow PSG Tech alumni worldwide
          </p>
        </div>

        {/* Step bar */}
        <div className="flex justify-center items-center mb-8">
          <div
            className={`flex flex-col items-center gap-1 ${
              currentStep >= 1 ? "" : ""
            } ${currentStep > 1 ? "" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-gray-400 transition ${
                currentStep > 1
                  ? "bg-green-100 text-green-700 border-green-100"
                  : currentStep === 1
                    ? "bg-[#0052ab] text-white border-[#0052ab]"
                    : "border-gray-300"
              }`}
            >
              {currentStep > 1 ? <Check size={16} /> : "1"}
            </div>
            <div
              className={`text-xs font-semibold uppercase tracking-wide ${
                currentStep >= 1 ? "text-[#0052ab]" : "text-gray-400"
              }`}
            >
              Personal
            </div>
          </div>
          <div
            className={`w-14 h-0.5 bg-gray-300 mx-2 mb-4 transition ${
              currentStep > 1 ? "bg-[#0052ab]" : ""
            }`}
          />
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-gray-400 transition ${
                currentStep === 2
                  ? "bg-[#0052ab] text-white border-[#0052ab]"
                  : "border-gray-300"
              }`}
            >
              2
            </div>
            <div
              className={`text-xs font-semibold uppercase tracking-wide ${
                currentStep === 2 ? "text-[#0052ab]" : "text-gray-400"
              }`}
            >
              Profile
            </div>
          </div>
        </div>

        {/* Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-10 shadow-lg relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-center gap-2 mb-5">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          {/* ── Step 1 ── */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-sm font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Personal Information
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full border-gray-300"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="py-2 px-6 bg-gradient-to-r from-[#0052ab] to-[#0052ab]/80 text-white rounded-lg font-semibold uppercase tracking-wide hover:shadow-lg transition"
                  onClick={handleNext}
                >
                  Next Step →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2 ── */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-sm font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Academic Information
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                  />
                  {errors.department && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.department}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.graduationYear
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="2020"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    min="1950"
                    max="2030"
                  />
                  {errors.graduationYear && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.graduationYear}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Roll Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full border-gray-300"
                    placeholder="e.g. 20CSE001"
                    value={formData.rollNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-900 mt-6 mb-4 border-b-2 border-gray-200 pb-2">
                Professional &amp; Location
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full border-gray-300"
                    placeholder="Company name"
                    value={formData.currentCompany}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full border-gray-300"
                    placeholder="Software Engineer"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 mb-4 relative">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    className={`px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full ${
                      errors.coordinates ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Type to search city..."
                    value={locationQuery}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-20 max-h-48 overflow-y-auto shadow-sm">
                      {suggestions.map((place) => (
                        <div
                          key={place.place_id}
                          className="px-3 py-2 cursor-pointer border-b last:border-b-0 text-sm text-gray-900 hover:bg-gray-100 hover:text-indigo-600"
                          onClick={() => handleSelect(place)}
                        >
                          {place.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.coordinates && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.coordinates}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    LinkedIn (Optional)
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-gray-900 focus:border-[#0052ab] focus:bg-white focus:ring-1 focus:ring-indigo-200 w-full border-gray-300"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-8">
                <button
                  type="button"
                  className="py-2 px-4 border border-[#0052ab] text-[#0052ab] rounded-lg font-semibold uppercase tracking-wide hover:bg-indigo-50 transition"
                  onClick={() => setCurrentStep(1)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-[#0052ab] to-[#0052ab]/80 text-white rounded-lg font-semibold uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Check size={16} /> Complete Registration
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/alumni/login"
              className="text-[#0052ab] font-semibold hover:text-purple-600"
            >
              Sign in here
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AlumniRegistration;
