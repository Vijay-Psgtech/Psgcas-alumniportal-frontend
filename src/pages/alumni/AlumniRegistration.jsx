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
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
          .pending-wrap { min-height:100vh; background:linear-gradient(165deg,#f8f5ee 0%,#fdfcf9 45%,#f2f4fa 100%); display:flex; align-items:center; justify-content:center; padding:24px; font-family:'Outfit',sans-serif; }
          .pending-card { background:white; border-radius:16px; padding:52px 44px; max-width:460px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.08); border:1px solid rgba(0,0,0,0.08); position:relative; overflow:hidden; }
          .pending-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#667eea,#764ba2,#667eea); }
          .pending-icon { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,rgba(102,126,234,0.1),rgba(118,75,162,0.1)); border:2px solid rgba(102,126,234,0.25); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; font-size:30px; }
          .pending-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:#0c0e1a; margin-bottom:12px; }
          .pending-desc { font-size:14px; color:#666e80; line-height:1.7; margin-bottom:28px; }
          .pending-steps { background:#f8f9fc; border-radius:10px; padding:18px 20px; text-align:left; margin-bottom:28px; display:flex; flex-direction:column; gap:0; }
          .p-step { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:13px; color:#0c0e1a; }
          .p-step:last-child { border-bottom:none; }
          .p-dot { width:26px; height:26px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; }
          .dot-done { background:#dcfce7; color:#166534; }
          .dot-wait { background:#fef3c7; color:#92400e; }
          .dot-next { background:#e0e7ff; color:#3730a3; }
          .btn-home { width:100%; padding:13px; border-radius:8px; border:none; cursor:pointer; background:linear-gradient(135deg,#667eea,#764ba2); color:white; font-family:'Outfit',sans-serif; font-size:14px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; transition:all 0.3s; }
          .btn-home:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(102,126,234,0.35); }
        `}</style>
        <div className="pending-wrap">
          <div className="pending-card">
            <div className="pending-icon">⏳</div>
            <h2 className="pending-title">Registration Submitted!</h2>
            <p className="pending-desc">
              Your alumni account has been created. An admin will review and
              approve your application. You'll gain full access once approved.
            </p>
            <div className="pending-steps">
              <div className="p-step">
                <div className="p-dot dot-done">
                  <Check size={13} />
                </div>
                Account registered
              </div>
              <div className="p-step">
                <div className="p-dot dot-wait">
                  <Clock size={13} />
                </div>
                Waiting for admin approval
              </div>
              <div className="p-step">
                <div className="p-dot dot-next">3</div>Access alumni network
                &amp; features
              </div>
            </div>
            <button className="btn-home" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Registration Form ────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }

        .reg-section { background:linear-gradient(165deg,#f8f5ee 0%,#fdfcf9 45%,#f2f4fa 100%); min-height:100vh; padding:80px 24px 60px; font-family:'Outfit',sans-serif; position:relative; overflow:hidden; }
        .reg-section::before { content:''; position:absolute; top:-200px; right:-200px; width:500px; height:500px; background:radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%); pointer-events:none; }
        .reg-inner { max-width:600px; margin:0 auto; position:relative; z-index:2; }

        .reg-head { text-align:center; margin-bottom:36px; }
        .reg-icon { width:68px; height:68px; background:linear-gradient(135deg,#667eea,#764ba2); border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; color:white; }
        .reg-title { font-family:'Playfair Display',serif; font-size:32px; font-weight:800; color:#0c0e1a; margin-bottom:8px; letter-spacing:-0.02em; }
        .reg-sub { font-size:14px; color:#666e80; font-weight:300; }

        .step-bar { display:flex; justify-content:center; align-items:center; margin-bottom:30px; }
        .s-step { display:flex; flex-direction:column; align-items:center; gap:6px; }
        .s-circle { width:38px; height:38px; border-radius:50%; border:2px solid #e0e6f0; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:14px; color:#a0aec0; transition:all 0.3s; }
        .s-step.active .s-circle { background:linear-gradient(135deg,#667eea,#764ba2); color:white; border-color:#667eea; }
        .s-step.done .s-circle { background:#dcfce7; color:#166534; border-color:#bbf7d0; }
        .s-label { font-size:11px; font-weight:600; color:#a0aec0; text-transform:uppercase; letter-spacing:0.05em; }
        .s-step.active .s-label { color:#667eea; }
        .s-line { width:56px; height:2px; background:#e0e6f0; margin:0 8px 18px; transition:background 0.3s; }
        .s-line.done { background:#667eea; }

        .reg-card { background:white; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:44px; box-shadow:0 20px 60px rgba(0,0,0,0.08); position:relative; }
        .reg-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#667eea,#764ba2,#667eea); border-radius:16px 16px 0 0; }

        .sec-title { font-size:15px; font-weight:700; color:#0c0e1a; margin:0 0 18px; padding-bottom:12px; border-bottom:2px solid #e2e8f0; }
        .f-row { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px; }
        .f-row.full { grid-template-columns:1fr; }
        .f-grp { display:flex; flex-direction:column; gap:7px; }
        .f-grp.location-group { position:relative; }
        .f-lbl { font-size:12px; font-weight:600; color:#0c0e1a; text-transform:uppercase; letter-spacing:0.05em; }
        .f-inp { padding:11px 13px; border:1px solid #e0e6f0; border-radius:8px; font-family:'Outfit',sans-serif; font-size:14px; color:#0c0e1a; background:#fafbfc; transition:all 0.3s; box-sizing:border-box; width:100%; }
        .f-inp:focus { outline:none; border-color:#667eea; background:white; box-shadow:0 0 0 3px rgba(102,126,234,0.1); }
        .f-inp.err { border-color:#dc2626; }
        .reg-location-suggestions { position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e0e6f0; border-radius:8px; margin-top:6px; z-index:10; max-height:200px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .reg-location-item { padding:12px 13px; cursor:pointer; border-bottom:1px solid #f0f3f9; font-size:13px; color:#0c0e1a; transition:background 0.2s; }
        .reg-location-item:last-child { border-bottom:none; }
        .reg-location-item:hover { background:#f8f9fc; color:#667eea; font-weight:600; }
        .f-err { font-size:12px; color:#dc2626; display:flex; align-items:center; gap:5px; }
        .err-banner { background:#fee2e2; border:1px solid #fecaca; border-radius:8px; padding:12px 14px; color:#991b1b; font-size:13px; display:flex; align-items:center; gap:8px; margin-bottom:20px; }
        .f-actions { display:flex; gap:12px; margin-top:28px; }
        .btn-next,.btn-sub { flex:1; padding:12px 18px; background:linear-gradient(135deg,#667eea,#764ba2); color:white; border:none; border-radius:8px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; transition:all 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; min-height:44px; }
        .btn-next:hover,.btn-sub:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 25px rgba(102,126,234,0.3); }
        .btn-sub:disabled { opacity:0.6; cursor:not-allowed; }
        .btn-bk { padding:12px 18px; background:transparent; color:#667eea; border:1px solid #667eea; border-radius:8px; font-family:'Outfit',sans-serif; font-size:14px; font-weight:600; text-transform:uppercase; cursor:pointer; transition:all 0.3s; display:flex; align-items:center; gap:6px; }
        .btn-bk:hover { background:rgba(102,126,234,0.05); }
        .reg-foot { text-align:center; margin-top:22px; font-size:13px; color:#666e80; }
        .reg-foot a { color:#667eea; text-decoration:none; font-weight:600; }
        .reg-foot a:hover { color:#764ba2; }

        @media(max-width:600px) {
          .reg-card { padding:28px 18px; }
          .reg-title { font-size:26px; }
          .f-row { grid-template-columns:1fr; gap:14px; }
        }
      `}</style>

      <motion.div
        className="reg-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="reg-inner">
          {/* Header */}
          <div className="reg-head">
            <motion.div
              className="reg-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <UserPlus size={36} />
            </motion.div>
            <h1 className="reg-title">Join Alumni Network</h1>
            <p className="reg-sub">
              Register to connect with fellow PSG Tech alumni worldwide
            </p>
          </div>

          {/* Step bar */}
          <div className="step-bar">
            <div
              className={`s-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "done" : ""}`}
            >
              <div className="s-circle">
                {currentStep > 1 ? <Check size={16} /> : "1"}
              </div>
              <div className="s-label">Personal</div>
            </div>
            <div className={`s-line ${currentStep > 1 ? "done" : ""}`} />
            <div className={`s-step ${currentStep >= 2 ? "active" : ""}`}>
              <div className="s-circle">2</div>
              <div className="s-label">Profile</div>
            </div>
          </div>

          {/* Card */}
          <motion.form
            onSubmit={handleSubmit}
            className="reg-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general && (
              <div className="err-banner">
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
                <p className="sec-title">Personal Information</p>

                <div className="f-row">
                  <div className="f-grp">
                    <label className="f-lbl">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className={`f-inp ${errors.firstName ? "err" : ""}`}
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="f-grp">
                    <label className="f-lbl">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className={`f-inp ${errors.lastName ? "err" : ""}`}
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="f-row full">
                  <div className="f-grp">
                    <label className="f-lbl">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className={`f-inp ${errors.email ? "err" : ""}`}
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="f-row">
                  <div className="f-grp">
                    <label className="f-lbl">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className={`f-inp ${errors.password ? "err" : ""}`}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="f-grp">
                    <label className="f-lbl">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`f-inp ${errors.confirmPassword ? "err" : ""}`}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="f-row full">
                  <div className="f-grp">
                    <label className="f-lbl">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      className="f-inp"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="f-actions">
                  <button
                    type="button"
                    className="btn-next"
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
                <p className="sec-title">Academic Information</p>

                <div className="f-row">
                  <div className="f-grp">
                    <label className="f-lbl">Department *</label>
                    <input
                      type="text"
                      name="department"
                      className={`f-inp ${errors.department ? "err" : ""}`}
                      placeholder="Computer Science"
                      value={formData.department}
                      onChange={handleChange}
                    />
                    {errors.department && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.department}
                      </div>
                    )}
                  </div>
                  <div className="f-grp">
                    <label className="f-lbl">Graduation Year *</label>
                    <input
                      type="number"
                      name="graduationYear"
                      className={`f-inp ${errors.graduationYear ? "err" : ""}`}
                      placeholder="2020"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      min="1950"
                      max="2030"
                    />
                    {errors.graduationYear && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.graduationYear}
                      </div>
                    )}
                  </div>
                </div>

                <div className="f-row full">
                  <div className="f-grp">
                    <label className="f-lbl">Roll Number (Optional)</label>
                    <input
                      type="text"
                      name="rollNumber"
                      className="f-inp"
                      placeholder="e.g. 20CSE001"
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <p className="sec-title" style={{ marginTop: "24px" }}>
                  Professional &amp; Location
                </p>

                <div className="f-row">
                  <div className="f-grp">
                    <label className="f-lbl">Company (Optional)</label>
                    <input
                      type="text"
                      name="currentCompany"
                      className="f-inp"
                      placeholder="Company name"
                      value={formData.currentCompany}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="f-grp">
                    <label className="f-lbl">Job Title (Optional)</label>
                    <input
                      type="text"
                      name="jobTitle"
                      className="f-inp"
                      placeholder="Software Engineer"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="f-row full">
                  <div className="f-grp location-group">
                    <label className="f-lbl">Location *</label>
                    <input
                      type="text"
                      name="location"
                      className={`f-inp ${errors.coordinates ? "err" : ""}`}
                      placeholder="Type to search city..."
                      value={locationQuery}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                      <div className="reg-location-suggestions">
                        {suggestions.map((place) => (
                          <div
                            key={place.place_id}
                            className="reg-location-item"
                            onClick={() => handleSelect(place)}
                          >
                            {place.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.coordinates && (
                      <div className="f-err">
                        <AlertCircle size={12} />
                        {errors.coordinates}
                      </div>
                    )}
                  </div>
                </div>

                <div className="f-row full">
                  <div className="f-grp">
                    <label className="f-lbl">LinkedIn (Optional)</label>
                    <input
                      type="url"
                      name="linkedin"
                      className="f-inp"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="f-actions">
                  <button
                    type="button"
                    className="btn-bk"
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="btn-sub" disabled={loading}>
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: "2px solid white",
                            borderTop: "2px solid transparent",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />{" "}
                        Registering…
                      </>
                    ) : (
                      <>
                        <Check size={16} /> Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            <div className="reg-foot">
              Already have an account?{" "}
              <Link to="/alumni/login">Sign in here</Link>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
};

export default AlumniRegistration;
