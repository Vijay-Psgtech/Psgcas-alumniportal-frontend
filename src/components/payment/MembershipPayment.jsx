// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/payment/MembershipPayment.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { membershipAPI, departmentAPI } from "../../services/api";

// Simple inline styles for portability (swap with Tailwind / MUI as needed)
const styles = {
  container: {
    maxWidth: 680,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
    color: "#fff",
    padding: "32px 36px",
  },
  headerTitle: { fontSize: 24, fontWeight: 700, margin: 0 },
  headerSub: { fontSize: 14, opacity: 0.85, marginTop: 6 },
  body: { padding: "32px 36px" },
  tierGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  tierCard: (selected) => ({
    border: selected ? "2px solid #2563eb" : "2px solid #e2e8f0",
    borderRadius: 10,
    padding: "14px 12px",
    cursor: "pointer",
    background: selected ? "#eff6ff" : "#f8fafc",
    transition: "all 0.18s",
    textAlign: "center",
  }),
  tierLabel: { fontWeight: 600, fontSize: 13, color: "#1e3a5f" },
  tierAmount: { fontSize: 20, fontWeight: 800, color: "#2563eb", margin: "6px 0" },
  tierDuration: { fontSize: 11, color: "#64748b" },
  fieldGroup: { marginBottom: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    fontSize: 14,
    background: "#fff",
    boxSizing: "border-box",
  },
  divider: { borderTop: "1px solid #e2e8f0", margin: "24px 0" },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 16 },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    marginTop: 8,
    transition: "opacity 0.18s",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 20,
  },
  summary: {
    background: "#eff6ff",
    borderRadius: 10,
    padding: "16px 20px",
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: "#1e40af", fontWeight: 600 },
  summaryAmount: { fontSize: 22, fontWeight: 800, color: "#1e40af" },
  badge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 8,
  },
  secureNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
  },
};

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electrical Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Business Administration",
  "Other",
];

const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const MembershipPayment = ({ userId = null, prefillData = {} }) => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: tier selection, 2: personal info
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    firstName: prefillData.firstName || "",
    lastName: prefillData.lastName || "",
    email: prefillData.email || "",
    phone: prefillData.phone || "",
    batchYear: prefillData.batchYear || "",
    department: prefillData.department || "",
    city: prefillData.city || "",
    state: prefillData.state || "",
    pincode: prefillData.pincode || "",
  });

  useEffect(() => {
    membershipAPI.fetchMembershipTiers()
      .then((data) => {
        const tierList = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data?.data?.tiers)
            ? data.data.tiers
            : [];
        setTiers(tierList);
        if (tierList.length > 0 && tierList[0]?.key) setSelectedTier(tierList[0].key);
      })
      .catch(() => setError("Failed to load membership tiers."));
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      firstName: prefillData.firstName || "",
      lastName: prefillData.lastName || "",
      email: prefillData.email || "",
      phone: prefillData.phone || "",
      batchYear: prefillData.batchYear || "",
      department: prefillData.department || "",
      city: prefillData.city || "",
      state: prefillData.state || "",
      pincode: prefillData.pincode || "",
    }));
  }, [prefillData]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentAPI.getAll();
        if (res.data?.data?.departments) {
          setDepartments(res.data.data.departments);
        }
      } catch (error) {
        console.log("Error fetching departments", error);
        setDepartments([]);
      }
    }
    fetchDepartments();
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required.";
    if (!/^\d{10}$/.test(form.phone)) return "Valid 10-digit phone number is required.";
    if (!form.batchYear) return "Graduation year is required.";
    if (!form.department) return "Department is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        tier: selectedTier,
        userId,
        address: { city: form.city, state: form.state, pincode: form.pincode },
      };

      const result = await membershipAPI.initiateMembershipPayment(payload);
      console.log("Payment initiation result:", result);
      if (result.data.success && result.data.paymentUrl) {
        // Redirect to Easebuzz payment page
        window.location.href = result.data.paymentUrl;
      }
    } catch (err) {
      setError(err.message || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentTierData = (Array.isArray(tiers) ? tiers : []).find((t) => t.key === selectedTier);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            🎓 Alumni Membership Registration
          </h2>
          <p style={styles.headerSub}>
            Join our alumni network — secure payment via Easebuzz
          </p>
        </div>

        <div style={styles.body}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          {/* ── Step 1: Tier Selection ─────────────────────────────────── */}
          <p style={styles.sectionTitle}>Select Membership Plan</p>
          <div style={styles.tierGrid}>
            {tiers.map((tier) => (
              <div
                key={tier.key}
                style={styles.tierCard(selectedTier === tier.key)}
                onClick={() => setSelectedTier(tier.key)}
                role="radio"
                aria-checked={selectedTier === tier.key}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedTier(tier.key)}
              >
                <div style={styles.tierLabel}>{tier.label}</div>
                <div style={styles.tierAmount}>₹{tier.amount.toLocaleString("en-IN")}</div>
                <div style={styles.tierDuration}>
                  {tier.durationMonths ? `${tier.durationMonths} months` : "Lifetime"}
                </div>
              </div>
            ))}
          </div>

          {/* Amount Summary */}
          {currentTierData && (
            <div style={styles.summary}>
              <div>
                <span style={styles.summaryLabel}>{currentTierData.label}</span>
                <span style={styles.badge}>
                  {currentTierData.durationMonths
                    ? `${currentTierData.durationMonths} months`
                    : "Lifetime"}
                </span>
              </div>
              <div style={styles.summaryAmount}>
                ₹{currentTierData.amount.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          <div style={styles.divider} />

          {/* ── Step 2: Personal Info Form ─────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <p style={styles.sectionTitle}>Personal Information</p>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="firstName">First Name *</label>
                <input
                  style={styles.input}
                  id="firstName" name="firstName"
                  value={form.firstName} onChange={handleChange}
                  placeholder="Ramesh" required
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="lastName">Last Name *</label>
                <input
                  style={styles.input}
                  id="lastName" name="lastName"
                  value={form.lastName} onChange={handleChange}
                  placeholder="Kumar" required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="email">Email Address *</label>
                <input
                  style={styles.input}
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="ramesh@email.com" required
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="phone">Phone Number *</label>
                <input
                  style={styles.input}
                  id="phone" name="phone" type="tel"
                  maxLength={10}
                  value={form.phone} onChange={handleChange}
                  placeholder="9XXXXXXXXX" required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="batchYear">Graduation Year *</label>
                <select
                  style={styles.select}
                  id="batchYear" name="batchYear"
                  value={form.batchYear} onChange={handleChange} required
                >
                  <option value="">Select Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="department">Department *</label>
                <select
                  style={styles.select}
                  id="department" name="department"
                  value={form.department} onChange={handleChange} required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id || dept.id || dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.divider} />
            <p style={styles.sectionTitle}>Address (Optional)</p>

            <div style={{ ...styles.row, gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="city">City</label>
                <input
                  style={styles.input}
                  id="city" name="city"
                  value={form.city} onChange={handleChange}
                  placeholder="Coimbatore"
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="state">State</label>
                <input
                  style={styles.input}
                  id="state" name="state"
                  value={form.state} onChange={handleChange}
                  placeholder="Tamil Nadu"
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="pincode">Pincode</label>
                <input
                  style={styles.input}
                  id="pincode" name="pincode" maxLength={6}
                  value={form.pincode} onChange={handleChange}
                  placeholder="641001"
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading || !selectedTier}
            >
              {loading
                ? "⏳ Initiating Payment..."
                : `🔒 Pay ₹${currentTierData?.amount?.toLocaleString("en-IN") || ""} & Register`}
            </button>
          </form>

          <p style={styles.secureNote}>
            🔐 Secured by Easebuzz · UPI · Cards · Net Banking · Wallets accepted
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPayment;