
// frontend/src/pages/DonatePage.jsx
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, DollarSign, IndianRupee, AlertCircle, CheckCircle } from "lucide-react";
import { donationAPI } from "../Services/api";
// import "./donate.css";

const DonatePage = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ✅ Validate form
  const validateForm = useCallback(() => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      setError("Please enter a valid donation amount");
      return false;
    }

    if (!isAnonymous && (!donorName || !donorEmail)) {
      setError("Please enter your name and email");
      return false;
    }

    if (!isAnonymous && !donorEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  }, [donationAmount, isAnonymous, donorName, donorEmail]);

  // ✅ Handle Razorpay payment
  const handleRazorpayPayment = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Create donation record
      const donationData = {
        amount: parseFloat(donationAmount),
        currency: "INR",
        paymentMethod: "razorpay",
        donorName: isAnonymous ? "Anonymous" : donorName,
        donorEmail: isAnonymous ? "anonymous@psgtech.ac.in" : donorEmail,
        message: message || "",
        isAnonymous,
      };

      // Call backend to create donation & get Razorpay order
      const response = await donationAPI.createDonation(donationData);

      const { razorpayOrderId, amount, currency: orderCurrency } = response.data;

      if (!razorpayOrderId) {
        setError("Failed to create payment order. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: orderCurrency,
        order_id: razorpayOrderId,
        name: "PSG Arts Alumni Foundation",
        description: "Support PSG Tech's Excellence & Student Aid",
        image: "/psg_logo.png",
        handler: async (paymentResponse) => {
          try {
            // Verify payment with backend
            const verifyResponse = await donationAPI.verifyRazorpayPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              setSuccess(true);
              setDonationAmount("");
              setDonorName("");
              setDonorEmail("");
              setMessage("");
              setTimeout(() => setSuccess(false), 5000);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: isAnonymous ? "Anonymous Donor" : donorName,
          email: isAnonymous ? "" : donorEmail,
        },
        notes: {
          message: message,
          isAnonymous: isAnonymous,
        },
        theme: {
          color: "#667eea",
        },
      };

      // Load Razorpay script if not loaded
      if (typeof Razorpay === "undefined") {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const rzp = new Razorpay(options);
          rzp.open();
        };
        script.onerror = () => {
          setError("Failed to load payment gateway. Please try again.");
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        const rzp = new Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Razorpay error:", err);
      setError(err.response?.data?.message || "Payment initiation failed");
      setLoading(false);
    }
  }, [donationAmount, currency, isAnonymous, donorName, donorEmail, message]);

  // ✅ Handle Stripe payment
  const handleStripePayment = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Create donation record
      const donationData = {
        amount: parseFloat(donationAmount),
        currency: "USD",
        paymentMethod: "stripe",
        donorName: isAnonymous ? "Anonymous" : donorName,
        donorEmail: isAnonymous ? "anonymous@psgtech.ac.in" : donorEmail,
        message: message || "",
        isAnonymous,
      };

      // Call backend to create donation & get Stripe session
      const response = await donationAPI.createDonation(donationData);

      const { stripeSessionId } = response.data;

      if (!stripeSessionId) {
        setError("Failed to create payment session. Please try again.");
        setLoading(false);
        return;
      }

      // Load Stripe and redirect to checkout
      const stripe = await window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: stripeSessionId,
      });

      if (redirectError) {
        setError(redirectError.message);
      }
    } catch (err) {
      console.error("Stripe error:", err);
      setError(err.response?.data?.message || "Payment initiation failed");
      setLoading(false);
    }
  }, [donationAmount, currency, isAnonymous, donorName, donorEmail, message]);

  // ✅ Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      if (currency === "INR" && paymentMethod === "razorpay") {
        handleRazorpayPayment();
      } else if (currency === "USD" && paymentMethod === "stripe") {
        handleStripePayment();
      } else {
        setError("Invalid payment method selected");
      }
    },
    [
      validateForm,
      currency,
      paymentMethod,
      handleRazorpayPayment,
      handleStripePayment,
    ]
  );

  const quickAmounts = [
    { amount: 1000, label: "₹1,000" },
    { amount: 5000, label: "₹5,000" },
    { amount: 10000, label: "₹10,000" },
    { amount: 50000, label: "₹50,000" },
  ];

  const quickAmountsUSD = [
    { amount: 10, label: "$10" },
    { amount: 25, label: "$25" },
    { amount: 50, label: "$50" },
    { amount: 100, label: "$100" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
        
        .donate-section {
          background: linear-gradient(165deg, #f8f5ee 0%, #fdfcf9 45%, #f2f4fa 100%);
          padding: 110px 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .donate-section::before {
          content: '';
          position: absolute;
          top: -180px;
          right: -180px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 68%);
          pointer-events: none;
        }

        .donate-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .donate-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .donate-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #667eea;
          margin-bottom: 20px;
        }

        .donate-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800;
          color: #0c0e1a;
          margin-bottom: 16px;
          letter-spacing: -0.025em;
        }

        .donate-subtitle {
          font-size: 16px;
          color: #535e78;
          max-width: 600px;
          margin: 0 auto;
        }

        .donate-form-wrapper {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .form-column-left {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #0c0e1a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #0c0e1a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 14px;
          border: 1px solid #e0e6f0;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #0c0e1a;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .amount-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .amount-btn {
          flex: 1;
          min-width: 90px;
          padding: 12px;
          background: #f0f3f9;
          border: 1px solid #e0e6f0;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .amount-btn:hover,
        .amount-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkbox-group input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .error-message {
          padding: 12px 14px;
          background: #fee2e2;
          border: 1px solid #fc8181;
          border-radius: 8px;
          color: #742a2a;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .success-message {
          padding: 12px 14px;
          background: #c6f6d5;
          border: 1px solid #48bb78;
          border-radius: 8px;
          color: #22543d;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-column-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .payment-summary {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          position: sticky;
          top: 80px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          font-size: 14px;
        }

        .summary-row.total {
          border-top: 2px solid #e2e8f0;
          padding-top: 16px;
          margin-top: 16px;
          font-weight: 700;
          color: #0c0e1a;
          font-size: 16px;
        }

        .summary-value {
          text-align: right;
          color: #667eea;
          font-weight: 600;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .impact-section {
          margin-top: 40px;
          padding: 28px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .impact-title {
          font-weight: 600;
          color: #0c0e1a;
          margin-bottom: 12px;
        }

        .impact-text {
          font-size: 13px;
          color: #535e78;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .donate-form-wrapper {
            padding: 28px;
          }

          .payment-summary {
            position: static;
          }
        }
      `}</style>

      <section className="donate-section">
        <div className="donate-inner">
          {/* Header */}
          <motion.div
            className="donate-header"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <span className="donate-eyebrow">
                <Heart size={14} />
                Make Your Impact
              </span>
            </motion.div>

            <motion.h1 className="donate-h1" variants={itemVariants}>
              Support PSG Arts Excellence
            </motion.h1>

            <motion.p className="donate-subtitle" variants={itemVariants}>
              Your donation directly supports student scholarships, research initiatives, and campus development. Every contribution makes a difference.
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="donate-form-wrapper"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="form-grid">
              {/* Left Column */}
              <div className="form-column-left">
                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="success-message">
                    <CheckCircle size={16} />
                    Donation processed successfully! Thank you for your support.
                  </div>
                )}

                {/* Currency Selection */}
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency("INR");
                        setPaymentMethod("razorpay");
                      }}
                      className={`amount-btn ${currency === "INR" ? "active" : ""}`}
                    >
                      ₹ INR
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrency("USD");
                        setPaymentMethod("stripe");
                      }}
                      className={`amount-btn ${currency === "USD" ? "active" : ""}`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>

                {/* Donation Amount */}
                <div className="form-group">
                  <label className="form-label">
                    Donation Amount
                    {currency === "INR" ? " (₹)" : " ($)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="form-input"
                    required
                  />

                  {/* Quick Amount Buttons */}
                  <div className="amount-group">
                    {(currency === "INR" ? quickAmounts : quickAmountsUSD).map(
                      (item) => (
                        <button
                          key={item.amount}
                          type="button"
                          onClick={() => setDonationAmount(item.amount.toString())}
                          className={`amount-btn ${
                            parseFloat(donationAmount) === item.amount ? "active" : ""
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Donor Info */}
                <div>
                  <h3 className="form-section-title">
                    <Heart size={18} /> Donor Information
                  </h3>

                  {/* Anonymous Checkbox */}
                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <label htmlFor="anonymous" className="form-label">
                        Donate anonymously
                      </label>
                    </div>
                  </div>

                  {/* Name & Email */}
                  {!isAnonymous && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Your full name"
                          className="form-input"
                          required={!isAnonymous}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="form-input"
                          required={!isAnonymous}
                        />
                      </div>
                    </>
                  )}

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label">Message (Optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share why you're supporting PSG Tech..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="form-column-right">
                <div className="payment-summary">
                  <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px" }}>
                    Payment Summary
                  </h3>

                  <div className="summary-row">
                    <span>Donation Amount</span>
                    <span className="summary-value">
                      {currency === "INR" ? "₹" : "$"}
                      {donationAmount || "0"}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Processing Fee</span>
                    <span className="summary-value">
                      {currency === "INR" ? "₹" : "$"}
                      {donationAmount ? (parseFloat(donationAmount) * 0.02).toFixed(2) : "0"}
                    </span>
                  </div>

                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>
                      {currency === "INR" ? "₹" : "$"}
                      {donationAmount
                        ? (parseFloat(donationAmount) * 1.02).toFixed(2)
                        : "0"}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !donationAmount}
                    className="submit-btn"
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid white",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart size={18} />
                        Donate Now
                      </>
                    )}
                  </button>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#a0aec0",
                      textAlign: "center",
                      marginTop: "12px",
                    }}
                  >
                    Secure payment powered by{" "}
                    {currency === "INR" ? "Razorpay" : "Stripe"}
                  </p>
                </div>

                {/* Impact Section */}
                <div className="impact-section">
                  <div className="impact-title">💡 Your Impact</div>
                  <div className="impact-text">
                    {currency === "INR" && donationAmount ? (
                      <>
                        ₹{donationAmount} can provide a scholarship to one deserving
                        student for a semester or support one research project.
                      </>
                    ) : currency === "USD" && donationAmount ? (
                      <>
                        ${donationAmount} can contribute to campus facilities and
                        educational resources.
                      </>
                    ) : (
                      <>
                        Your donation will directly support PSG Tech's mission of
                        excellence in education and student support.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default DonatePage;