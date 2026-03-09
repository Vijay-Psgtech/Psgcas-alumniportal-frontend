import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, ShieldCheck, UploadCloud, Heart } from "lucide-react";

export default function DonationGate() {
  const [formData, setFormData] = useState({ fullName: "", address: "", pan: "", mobile: "", email: "", purpose: "" });
  const [files, setFiles] = useState({ aadhaar: null, pan: null, consent: null });
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileUpload = (key) => (e) => setFiles({ ...files, [key]: e.target.files[0] });
  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true); setSubmitted(true);
    setTimeout(() => { setVerified(true); setLoading(false); }, 2500);
  };

  const docs = [
    { key: "aadhaar", label: "Aadhaar Card Copy" },
    { key: "pan", label: "PAN Card Copy" },
    { key: "consent", label: "Contribution Consent Letter" },
  ];

  const steps = [
    { n: 1, label: "Donor KYC", done: submitted },
    { n: 2, label: "Review", done: verified },
    { n: 3, label: "Donate", done: verified },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
        .dg { min-height: 100vh; background: #080b18; padding: 110px 24px 80px; font-family: "Outfit",sans-serif; position: relative; overflow-x: hidden; }
        .dg-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
        .dg-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 2; }
        .dg-head { text-align: center; margin-bottom: 44px; }
        .dg-icon { width: 62px; height: 62px; border-radius: 14px; background: linear-gradient(135deg,#b8882a,#e0bc55); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; }
        .dg-h1 { font-family: "Playfair Display",serif; font-size: clamp(34px,5vw,52px); font-weight: 800; color: #f2ede3; letter-spacing: -.025em; margin-bottom: 8px; }
        .dg-h1 em { font-style: italic; background: linear-gradient(130deg,#c9a84c,#f0d870); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .dg-sub { font-size: 15px; font-weight: 300; color: rgba(200,215,240,.48); }
        /* STEPS */
        .steps-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 36px; }
        .step { padding: 14px 10px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.022); transition: all .35s ease; }
        .step.done { border-color: rgba(201,168,76,.3); background: rgba(201,168,76,.07); }
        .step.active { border-color: rgba(201,168,76,.2); background: rgba(201,168,76,.04); }
        .step-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; margin: 0 auto 8px; background: rgba(255,255,255,.07); color: rgba(200,215,240,.4); transition: all .35s; }
        .step.done .step-num { background: linear-gradient(135deg,#b8882a,#e0bc55); color: #08090f; }
        .step.active .step-num { background: rgba(201,168,76,.18); color: #c9a84c; border: 1px solid rgba(201,168,76,.3); }
        .step-lbl { font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: rgba(200,215,240,.32); transition: color .3s; }
        .step.done .step-lbl { color: #c9a84c; }
        .step.active .step-lbl { color: rgba(201,168,76,.7); }
        /* CARD */
        .dg-card { background: rgba(255,255,255,.025); border: 1px solid rgba(201,168,76,.15); border-radius: 14px; overflow: hidden; }
        .dg-card::before { content: ""; display: block; height: 2px; background: linear-gradient(90deg,#b8882a,#e8c560,#b8882a); }
        .dg-card-body { padding: 44px; }
        /* FORM */
        .sec-h { font-family: "Playfair Display",serif; font-size: 20px; font-weight: 700; color: #f2ede3; margin-bottom: 22px; display: flex; align-items: center; gap: 12px; }
        .sec-accent { width: 3px; height: 24px; border-radius: 2px; background: linear-gradient(to bottom,#c9a84c,#f0d870); flex-shrink: 0; }
        .fg { margin-bottom: 18px; }
        .fl { display: block; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(200,215,240,.45); margin-bottom: 7px; }
        .fi { width: 100%; padding: 11px 14px; border: 1.5px solid rgba(255,255,255,.08); border-radius: 8px; font-family: "Outfit",sans-serif; font-size: 14px; color: #e8e0cc; background: rgba(255,255,255,.04); outline: none; transition: all .25s; box-sizing: border-box; }
        .fi:focus { border-color: rgba(201,168,76,.5); background: rgba(201,168,76,.04); box-shadow: 0 0 0 3px rgba(201,168,76,.08); }
        .fi::placeholder { color: rgba(200,215,240,.2); }
        .fg-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); margin: 28px 0; }
        /* FILE UPLOADS */
        .doc-card { background: rgba(255,255,255,.03); border: 1.5px solid rgba(255,255,255,.07); border-radius: 9px; padding: 16px 18px; cursor: pointer; transition: all .28s ease; margin-bottom: 12px; display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden; }
        .doc-card:hover { border-color: rgba(201,168,76,.3); background: rgba(201,168,76,.04); }
        .doc-card.uploaded { border-color: rgba(201,168,76,.4); background: rgba(201,168,76,.06); }
        .doc-icon { color: #c9a84c; flex-shrink: 0; }
        .doc-label { font-size: 13px; font-weight: 600; color: #e8e0cc; margin-bottom: 2px; }
        .doc-sub { font-size: 11px; color: rgba(200,215,240,.3); }
        .doc-check { margin-left: auto; flex-shrink: 0; }
        .doc-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        /* SUBMIT */
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg,#b8882a 0%,#e8c255 50%,#b8882a 100%); background-size: 200% 100%; background-position: right; border: none; border-radius: 9px; font-family: "Outfit",sans-serif; font-size: 14px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #08090f; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .4s ease; margin-top: 6px; }
        .submit-btn:hover { background-position: left; box-shadow: 0 10px 32px rgba(201,168,76,.32); transform: translateY(-1px); }
        /* LOADING */
        .loading-state { text-align: center; padding: 60px 20px; }
        .spin-icon { animation: spin 2s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-h { font-family: "Playfair Display",serif; font-size: 28px; font-weight: 700; color: #f2ede3; margin: 20px 0 8px; }
        .loading-p { font-size: 14px; font-weight: 300; color: rgba(200,215,240,.42); }
        /* VERIFIED */
        .verified-state { padding: 52px 44px; text-align: center; }
        .ver-badge { font-family: "Playfair Display",serif; font-size: 36px; font-weight: 800; background: linear-gradient(135deg,#c9a84c,#f0d870); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 16px 0 6px; }
        .ver-sub { font-size: 14px; font-weight: 300; color: rgba(200,215,240,.48); margin-bottom: 30px; }
        .ver-summary { background: rgba(201,168,76,.06); border: 1px solid rgba(201,168,76,.18); border-radius: 10px; padding: 22px; text-align: left; margin-bottom: 28px; }
        .ver-sum-lbl { font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #c9a84c; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .ver-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; }
        .ver-row-k { color: rgba(200,215,240,.42); }
        .ver-row-v { color: #f2ede3; font-weight: 500; }
        .proceed-btn { width: 100%; padding: 15px; background: linear-gradient(135deg,#1a5c2a,#2e8b44,#1a5c2a); background-size: 200% 100%; background-position: right; border: none; border-radius: 9px; font-family: "Outfit",sans-serif; font-size: 14px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #f2ede3; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .4s ease; }
        .proceed-btn:hover { background-position: left; box-shadow: 0 10px 32px rgba(46,139,68,.35); transform: translateY(-1px); }
        .ver-note { margin-top: 14px; font-size: 12px; color: rgba(200,215,240,.3); }
        @media(max-width:580px) { .dg-card-body { padding: 28px 20px; } .fg-2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dg">
        <div className="dg-orb" style={{ width: 480, height: 480, top: -140, right: -140, background: "rgba(201,168,76,.055)" }} />
        <div className="dg-orb" style={{ width: 360, height: 360, bottom: -100, left: -100, background: "rgba(70,110,220,.04)" }} />

        <div className="dg-inner">
          {/* HEADER */}
          <motion.div className="dg-head" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="dg-icon"><Heart size={28} style={{ color: "#08090f" }} /></div>
            <h1 className="dg-h1">Support <em>PSG Tech</em></h1>
            <p className="dg-sub">Alumni Philanthropy Gateway</p>
          </motion.div>

          {/* STEPS */}
          <motion.div className="steps-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .1 }}>
            {steps.map((s, i) => (
              <div key={s.label} className={`step${s.done ? " done" : i === 1 && submitted && !verified ? " active" : ""}`}>
                <div className="step-num">{s.done ? "✓" : s.n}</div>
                <div className="step-lbl">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* MAIN CARD */}
          <motion.div className="dg-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .18 }}>

            {/* FORM */}
            {!submitted && (
              <div className="dg-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="sec-h"><div className="sec-accent" />Donor Information</div>

                  <div className="fg">
                    <label className="fl">Full Name <span style={{ color: "#e04444" }}>*</span></label>
                    <input name="fullName" placeholder="Enter full name as per records" className="fi" onChange={handleChange} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Residential Address <span style={{ color: "#e04444" }}>*</span></label>
                    <input name="address" placeholder="Address for 80G compliance" className="fi" onChange={handleChange} required />
                  </div>
                  <div className="fg">
                    <label className="fl">PAN Number <span style={{ color: "#e04444" }}>*</span></label>
                    <input name="pan" placeholder="ABCDE1234F" className="fi" onChange={handleChange} required />
                  </div>
                  <div className="fg-2">
                    <div className="fg">
                      <label className="fl">Mobile Number <span style={{ color: "#e04444" }}>*</span></label>
                      <input name="mobile" placeholder="10-digit mobile" className="fi" onChange={handleChange} required />
                    </div>
                    <div className="fg">
                      <label className="fl">Email ID <span style={{ color: "#e04444" }}>*</span></label>
                      <input name="email" type="email" placeholder="Official email for receipts" className="fi" onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="sec-h"><div className="sec-accent" />KYC Documents</div>
                  {docs.map(doc => (
                    <motion.div key={doc.key} className={`doc-card${files[doc.key] ? " uploaded" : ""}`} whileHover={{ scale: 1.01 }}>
                      <UploadCloud size={20} className="doc-icon" />
                      <div>
                        <div className="doc-label">{doc.label} <span style={{ color: "#e04444" }}>*</span></div>
                        <div className="doc-sub">{files[doc.key] ? `✓ ${files[doc.key].name}` : "Click to upload — PDF, JPG, PNG"}</div>
                      </div>
                      {files[doc.key] && <ShieldCheck size={18} style={{ color: "#c9a84c", marginLeft: "auto", flexShrink: 0 }} />}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload(doc.key)} required className="doc-input" />
                    </motion.div>
                  ))}

                  <div className="divider" />

                  <div className="fg">
                    <label className="fl">Donation Purpose <span style={{ color: "#e04444" }}>*</span></label>
                    <textarea name="purpose" placeholder="Optional note for the alumni committee" className="fi" style={{ height: 90, resize: "none" }} onChange={handleChange} required />
                  </div>

                  <button type="submit" className="submit-btn">Submit for Verification</button>
                </form>
              </div>
            )}

            {/* LOADING */}
            {submitted && !verified && (
              <motion.div className="loading-state" initial={{ opacity: .3 }} animate={{ opacity: 1 }}>
                <UploadCloud size={52} style={{ color: "#c9a84c" }} className="spin-icon" />
                <div className="loading-h">{loading ? "Validating for Compliance…" : "Under Review"}</div>
                <p className="loading-p">Your KYC documents are being processed</p>
              </motion.div>
            )}

            {/* VERIFIED */}
            {verified && (
              <motion.div className="verified-state" initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5 }}>
                <FileCheck size={52} style={{ color: "#c9a84c" }} />
                <div className="ver-badge">KYC Approved!</div>
                <p className="ver-sub">Your verification is complete — proceed to donate</p>

                <div className="ver-summary">
                  <div className="ver-sum-lbl"><ShieldCheck size={14} /> Verified Donor Profile</div>
                  {[
                    ["Name", formData.fullName],
                    ["PAN", formData.pan],
                    ["Mobile", formData.mobile],
                    ["Email", formData.email],
                  ].map(([k, v]) => (
                    <div className="ver-row" key={k}>
                      <span className="ver-row-k">{k}:</span>
                      <span className="ver-row-v" style={{ maxWidth: "60%", textAlign: "right", overflowWrap: "break-word" }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>

                <motion.button className="proceed-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                  onClick={() => alert("Redirecting to payment gateway")}>
                  Proceed to Payment →
                </motion.button>
                <p className="ver-note">You'll receive a receipt at your registered email address</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

