// ─────────────────────────────────────────────────────────────────────────────
// client/src/pages/payment/PaymentStatus.jsx
// Shown after redirect from Easebuzz — reads URL query params
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { paymentStatusAPI } from "../../services/api";

const useQuery = () => new URLSearchParams(window.location.search);

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    fontFamily: "'Segoe UI', sans-serif",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    padding: "48px 40px",
    textAlign: "center",
    maxWidth: 480,
    width: "100%",
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: (success) => ({
    fontSize: 26,
    fontWeight: 800,
    color: success ? "#065f46" : "#991b1b",
    margin: "0 0 8px",
  }),
  subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 28 },
  detailsBox: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: "16px 20px",
    textAlign: "left",
    marginBottom: 28,
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "5px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  detailLabel: { color: "#6b7280", fontWeight: 600 },
  detailValue: { color: "#1e293b", fontWeight: 700 },
  btnPrimary: {
    display: "inline-block",
    padding: "12px 28px",
    background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginRight: 10,
    textDecoration: "none",
  },
  btnSecondary: {
    display: "inline-block",
    padding: "12px 28px",
    background: "#f1f5f9",
    color: "#374151",
    borderRadius: 10,
    border: "1.5px solid #d1d5db",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  },
  txnNote: { fontSize: 11, color: "#94a3b8", marginTop: 20 },
};

const PaymentSuccess = () => {
  const query = useQuery();
  const txnid = query.get("txnid");
  const module = query.get("module");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (txnid) {
      paymentStatusAPI.getStatus(txnid)
        .then((data) => 
          console.log("Payment status data:", data) ||
          setPayment(data?.data.payment))
        .catch(() => {});
    }
  }, [txnid]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title(true)}>Payment Successful!</h1>
        <p style={styles.subtitle}>
          {module === "MEMBERSHIP"
            ? "Your alumni membership has been activated."
            : "Thank you for your generous donation!"}
        </p>

        {payment && (
          <div style={styles.detailsBox}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Transaction ID</span>
              <span style={styles.detailValue}>{payment.txnid}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Amount Paid</span>
              <span style={styles.detailValue}>
                ₹{payment.amount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Payment Mode</span>
              <span style={styles.detailValue}>{payment.gatewayResponse?.mode || payment.paymentMode || "N/A"}</span>
            </div>
            <div style={{ ...styles.detailRow, borderBottom: "none" }}>
              <span style={styles.detailLabel}>Module</span>
              <span style={styles.detailValue}>{payment.module}</span>
            </div>
          </div>
        )}

        <div>
          <a href="/alumni/dashboard" style={styles.btnPrimary}>Go to Dashboard</a>
        </div>
        {txnid && (
          <p style={styles.txnNote}>Reference: {txnid}</p>
        )}
      </div>
    </div>
  );
};

const PaymentFailure = () => {
  const query = useQuery();
  const txnid = query.get("txnid");
  const module = query.get("module");
  const reason = query.get("reason");

  const reasonMessages = {
    hash_mismatch: "Payment verification failed. Please contact support.",
    not_found: "Transaction not found.",
    server_error: "A server error occurred.",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>❌</div>
        <h1 style={styles.title(false)}>Payment Failed</h1>
        <p style={styles.subtitle}>
          {reasonMessages[reason] ||
            "Your payment was not completed. No amount has been deducted."}
        </p>

        <div style={styles.detailsBox}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Transaction ID</span>
            <span style={styles.detailValue}>{txnid || "N/A"}</span>
          </div>
          <div style={{ ...styles.detailRow, borderBottom: "none" }}>
            <span style={styles.detailLabel}>Status</span>
            <span style={{ ...styles.detailValue, color: "#dc2626" }}>Failed</span>
          </div>
        </div>

        <div>
          <a
            href={module === "MEMBERSHIP" ? "/register/membership" : "/donate"}
            style={styles.btnPrimary}
          >
            Try Again
          </a>
          <a href="/support" style={styles.btnSecondary}>Contact Support</a>
        </div>
        {txnid && <p style={styles.txnNote}>Reference: {txnid}</p>}
      </div>
    </div>
  );
};

// Export both as named exports — wire up in React Router
export { PaymentSuccess, PaymentFailure };