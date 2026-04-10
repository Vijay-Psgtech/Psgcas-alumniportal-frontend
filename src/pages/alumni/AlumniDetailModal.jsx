import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle, Linkedin, Twitter, Instagram,
  Mail, Phone, MapPin, Briefcase, BookOpen,
  GraduationCap, Hash, ChevronRight, ExternalLink
} from "lucide-react";

const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";

const GRADIENTS = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#84fab0", "#8fd3f4"],
];

const pickGradient = (str = "") =>
  GRADIENTS[str?.charCodeAt(0) % GRADIENTS.length];

const canSeeFullDetails = (viewer, subject) => {
  if (!viewer || !subject) return false;
  if (viewer.isAdmin) return true;
  return String(viewer.batchYear) === String(subject.batchYear);
};

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: { bg: "#f1f5f9", color: "#475569" },
    success: { bg: "#dcfce7", color: "#15803d" },
    info: { bg: "#dbeafe", color: "#1d4ed8" },
  };
  const s = styles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        background: s.bg,
        color: s.color,
      }}
    >
      {children}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} color="#94a3b8" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, color: "#1e293b", fontWeight: 500, wordBreak: "break-word" }}>
          {value}
        </div>
      </div>
    </div>
  );
};

const SocialBtn = ({ href, icon: Icon, label, color }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = color + "15";
        e.currentTarget.style.borderColor = color + "55";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "#f8fafc";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <Icon size={15} color={color} />
    </a>
  );
};

const AlumniDetailModal = ({ alumni, isOpen, onClose, apiBase, viewer }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !alumni) return null;

  const full = canSeeFullDetails(viewer, alumni);
  const photo = alumni.files?.currentPhoto || alumni.profileImage;
  const photoUrl = photo ? `${apiBase}/uploads/${photo}` : null;
  const [g1, g2] = pickGradient(alumni.firstName);
  const jobLine = alumni.jobTitle
    ? `${alumni.jobTitle}${alumni.currentCompany ? " · " + alumni.currentCompany : ""}`
    : alumni.occupation || null;
  const location = [alumni.city, alumni.country].filter(Boolean).join(", ") || null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "career", label: "Career" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(6px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 680,
              background: "#ffffff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 24px 64px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            {/* Hero Banner */}
            <div
              style={{
                height: 110,
                background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              >
                <X size={15} />
              </button>

              {/* Decorative circles */}
              <div style={{ position: "absolute", top: -20, right: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
              <div style={{ position: "absolute", bottom: -30, right: 20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* Avatar + Name row */}
            <div style={{ padding: "0 24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -44 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 18,
                    background: `linear-gradient(135deg, ${g1}, ${g2})`,
                    border: "4px solid #fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 26,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {photoUrl
                    ? <img src={photoUrl} alt={alumni.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : getInitials(alumni.firstName, alumni.lastName)}
                </div>

                {/* Name block */}
                <div style={{ paddingBottom: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                      {alumni.firstName} {alumni.lastName}
                    </h2>
                    {alumni.isApproved && (
                      <Badge variant="success">
                        <CheckCircle size={10} /> Verified
                      </Badge>
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 500, color: "#475569" }}>{alumni.department || "—"}</span>
                    <span style={{ color: "#cbd5e1" }}>·</span>
                    <span>{alumni.programmeType || "—"}</span>
                    <span style={{ color: "#cbd5e1" }}>·</span>
                    <span
                      style={{
                        background: `linear-gradient(135deg, ${g1}, ${g2})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: 700,
                      }}
                    >
                      {alumni.batchYear || "—"}
                    </span>
                  </div>
                  {jobLine && (
                    <div style={{ marginTop: 3, fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                      <Briefcase size={11} color="#94a3b8" />
                      <span>{jobLine}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alumni ID */}
              <div style={{ position: "absolute", bottom: 14, right: 24, fontSize: 10, color: "#cbd5e1", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                {alumni.alumniId}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, padding: "0 24px", borderBottom: "1px solid #f1f5f9", marginTop: 8 }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: activeTab === tab.id ? g1 : "#94a3b8",
                    background: "transparent",
                    border: "none",
                    borderBottom: activeTab === tab.id ? `2px solid ${g1}` : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "20px 24px 24px", minHeight: 240, maxHeight: "55vh", overflowY: "auto" }}>
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0 }}>
                    <InfoRow icon={GraduationCap} label="Degree" value={alumni.degree} />
                    <InfoRow icon={Hash} label="Roll Number" value={alumni.rollNumber} />
                    <InfoRow icon={MapPin} label="Location" value={location} />
                    <InfoRow icon={Briefcase} label="Current Role" value={jobLine} />
                  </div>
                </motion.div>
              )}

              {activeTab === "career" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
                    Career Highlights
                  </h4>
                  {alumni.career?.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {alumni.career.slice(0, 6).map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "#f8fafc",
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              background: `linear-gradient(135deg, ${g1}, ${g2})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "32px 0", textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>
                      <BookOpen size={28} color="#e2e8f0" style={{ marginBottom: 8 }} />
                      <div>No career highlights provided yet.</div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "contact" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  {full ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {alumni.email && (
                        <a
                          href={`mailto:${alumni.email}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            borderRadius: 12,
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            textDecoration: "none",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                          onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Mail size={16} color="#fff" />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "#86efac", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Email</div>
                            <div style={{ fontSize: 14, color: "#15803d", fontWeight: 600 }}>{alumni.email}</div>
                          </div>
                          <ChevronRight size={16} color="#86efac" style={{ marginLeft: "auto" }} />
                        </a>
                      )}

                      {alumni.phone && (
                        <a
                          href={`tel:${alumni.phone}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            borderRadius: 12,
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            textDecoration: "none",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                          onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Phone size={16} color="#fff" />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Phone</div>
                            <div style={{ fontSize: 14, color: "#1d4ed8", fontWeight: 600 }}>{alumni.phone}</div>
                          </div>
                          <ChevronRight size={16} color="#93c5fd" style={{ marginLeft: "auto" }} />
                        </a>
                      )}

                      <div style={{ paddingTop: 8 }}>
                        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                          Social Profiles
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <SocialBtn href={alumni.social?.linkedin} icon={Linkedin} label="LinkedIn" color="#0a66c2" />
                          <SocialBtn href={alumni.social?.twitter} icon={Twitter} label="Twitter / X" color="#1da1f2" />
                          <SocialBtn href={alumni.social?.instagram} icon={Instagram} label="Instagram" color="#e1306c" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                        <Mail size={22} color="#cbd5e1" />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Contact details restricted</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>Only visible to batch {alumni.batchYear} members and admins.</div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
                padding: "14px 24px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
              >
                <ExternalLink size={13} />
                Open Profile
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: `0 4px 14px ${g1}55`,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlumniDetailModal;