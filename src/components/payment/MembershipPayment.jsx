// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/payment/MembershipPayment.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { membershipAPI, departmentAPI } from "../../services/api";

// Simple inline styles for portability (swap with Tailwind / MUI as needed)
const styles = {
  container: {
    minHeight: "calc(100vh - 120px)",
    padding: "clamp(16px, 3vw, 48px)",
    background:
      "radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.10), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    maxWidth: 1040,
    margin: "0 auto",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 24,
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
    overflow: "hidden",
  },
  header: {
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(37, 99, 235, 0.98) 48%, rgba(56, 189, 248, 0.95) 100%)",
    color: "#fff",
    padding: "clamp(24px, 4vw, 40px)",
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, 0.9fr)",
    gap: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: 1.2,
    margin: 0,
    letterSpacing: "-0.03em",
  },
  headerSub: { fontSize: 15, opacity: 0.92, margin: "12px 0 0", lineHeight: 1.7, maxWidth: 580 },
  body: { padding: "clamp(20px, 4vw, 40px)" },
  section: {
    display: "grid",
    gap: 18,
  },
  tierGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },
  tierCard: (selected) => ({
    minHeight: 132,
    border: selected ? "1.5px solid #2563eb" : "1px solid #dbe4f0",
    borderRadius: 18,
    padding: "18px 16px",
    cursor: "pointer",
    background: selected
      ? "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,0.55) 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    boxShadow: selected ? "0 16px 35px rgba(37, 99, 235, 0.12)" : "0 10px 24px rgba(15, 23, 42, 0.05)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
    textAlign: "left",
    display: "grid",
    alignContent: "space-between",
    gap: 10,
  }),
  tierMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  tierLabel: { fontWeight: 700, fontSize: 14, color: "#0f172a", lineHeight: 1.35 },
  tierTag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: 999,
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  tierAmount: { fontSize: 28, fontWeight: 900, color: "#1d4ed8", margin: 0, letterSpacing: "-0.03em" },
  tierDuration: { fontSize: 12, color: "#64748b", margin: 0 },
  fieldGroup: { display: "grid", gap: 8 },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    minHeight: 50,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #d8e1ee",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
  },
  select: {
    width: "100%",
    minHeight: 50,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #d8e1ee",
    fontSize: 14,
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
  },
  divider: { borderTop: "1px solid #e2e8f0", margin: "4px 0" },
  sectionTitle: { fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  sectionDescription: { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 },
  summary: {
    background: "linear-gradient(180deg, #eff6ff 0%, #eaf2ff 100%)",
    border: "1px solid #cfe0ff",
    borderRadius: 18,
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  summaryLabel: { fontSize: 14, color: "#1e40af", fontWeight: 800 },
  summaryAmount: { fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "#1e40af", letterSpacing: "-0.03em" },
  submitBtn: {
    width: "100%",
    minHeight: 54,
    padding: "14px 18px",
    background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    marginTop: 4,
    boxShadow: "0 16px 30px rgba(37, 99, 235, 0.20)",
    transition: "transform 0.15s ease, opacity 0.18s ease, box-shadow 0.18s ease",
  },
  error: {
    background: "linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)",
    border: "1px solid #fda4af",
    borderRadius: 14,
    padding: "14px 16px",
    color: "#be123c",
    fontSize: 14,
    marginBottom: 18,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 800,
    marginLeft: 10,
  },
  secureNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#64748b",
    marginTop: 16,
    lineHeight: 1.6,
  },
  formShell: {
    display: "grid",
    gap: 22,
  },
  formCard: {
    display: "grid",
    gap: 18,
    padding: "20px",
    borderRadius: 20,
    border: "1px solid #e2e8f0",
    background: "#fff",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.04)",
  },
};

const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const MembershipPayment = ({ userId = null, prefillData = {} }) => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    };
    fetchDepartments();
  }, []);

  const currentTierData = (Array.isArray(tiers) ? tiers : []).find((t) => t.key === selectedTier);
  const selectedTierLabel = currentTierData?.label || "Membership plan";
  const selectedTierMonths = currentTierData?.durationMonths
    ? `${currentTierData.durationMonths} months`
    : "Lifetime access";

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerGrid}>
            <div>
              <h2 style={styles.headerTitle}>
                🎓 Alumni Membership Registration
              </h2>
              <p style={styles.headerSub}>
                Join our alumni network — secure payment via Easebuzz
              </p>
            </div>
          </div>
        </div>

        <div style={styles.body}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <div style={styles.section}>
            <div>
              <p style={styles.sectionTitle}>Select membership plan</p>
              <p style={styles.sectionDescription}>
                Choose the tier that fits your alumni profile. The cards are wider, easier to scan, and tap-friendly.
              </p>
            </div>

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
                  onMouseEnter={(e) => {
                    if (selectedTier !== tier.key) e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={styles.tierMeta}>
                    <div style={styles.tierLabel}>{tier.label}</div>
                    <span style={styles.tierTag}>{tier.durationMonths ? "Limited" : "Flexible"}</span>
                  </div>
                  <div>
                    <div style={styles.tierAmount}>₹{tier.amount.toLocaleString("en-IN")}</div>
                    <div style={styles.tierDuration}>
                      {tier.durationMonths ? `${tier.durationMonths} months` : "Lifetime membership"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentTierData && (
              <div style={styles.summary}>
                <div>
                  <span style={styles.summaryLabel}>{selectedTierLabel}</span>
                  <span style={styles.badge}>{selectedTierMonths}</span>
                </div>
                <div style={styles.summaryAmount}>
                  ₹{currentTierData.amount.toLocaleString("en-IN")}
                </div>
              </div>
            )}
          </div>

          <div style={styles.divider} />

          <form onSubmit={handleSubmit}>
            <div style={styles.formShell}>
              <div>
                <p style={styles.sectionTitle}>Personal information</p>
                <p style={styles.sectionDescription}>
                  Keep the layout readable by grouping related fields. The grid collapses to one column on smaller screens.
                </p>
              </div>

              <div style={styles.formCard}>
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

                <div>
                  <p style={styles.sectionTitle}>Address</p>
                  <p style={styles.sectionDescription}>Optional, but useful for alumni records and future communication.</p>
                </div>

                <div style={styles.row}>
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
              </div>

              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading || !selectedTier ? 0.72 : 1 }}
                disabled={loading || !selectedTier}
              >
                {loading
                  ? "Initiating payment..."
                  : `Pay ₹${currentTierData?.amount?.toLocaleString("en-IN") || "0"} & Register`}
              </button>
            </div>
          </form>

          <p style={styles.secureNote}>
            Secure checkout via Easebuzz. UPI, cards, net banking, and wallets are supported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPayment;