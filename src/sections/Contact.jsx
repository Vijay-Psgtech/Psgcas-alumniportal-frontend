import React, { useState } from "react";
import { Send, CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  usePageTitle("Contact Us");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          padding: 120px 40px 80px;
          text-align: center;
          color: #0F172A;
          position: relative;
          overflow: hidden;
          margin-top: 64px;
          border-bottom: 1px solid #E2E8F0;
        }

        .contact-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08), transparent),
                      radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.08), transparent);
          pointer-events: none;
        }

        .contact-hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeInDown 0.8s ease;
        }

        .contact-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .contact-hero p {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #64748B;
          line-height: 1.6;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Main Content */
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 40px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
          margin-bottom: 80px;
        }

        /* Form Section */
        .contact-form-section {
          background: #FFFFFF;
          padding: 40px;
          border-radius: 24px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 30px;
          letter-spacing: -0.5px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .required {
          color: #EF4444;
        }

        .form-input,
        .form-textarea {
          padding: 13px 16px;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #0F172A;
          background: #FFFFFF;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #CBD5E1;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #F8FAFC;
        }

        .form-input.error,
        .form-textarea.error {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 140px;
          font-family: 'Poppins', sans-serif;
        }

        .form-full {
          grid-column: 1 / -1;
        }

        .field-error {
          font-size: 12px;
          color: #EF4444;
          margin-top: 2px;
          font-family: 'Poppins', sans-serif;
        }

        .submit-btn {
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          color: white;
          border: none;
          padding: 13px 32px;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(59, 130, 246, 0.35);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #15803D;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
          animation: slideUp 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .success-message.show {
          display: flex;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Info Section */
        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeInUp 0.8s ease 0.4s both;
        }

        .info-box {
          background: #FFFFFF;
          padding: 28px;
          border-radius: 24px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border-left: 4px solid #3B82F6;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-box:hover {
          transform: translateY(-6px);
          border-left-color: #0EA5E9;
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.12);
          border-color: #BFDBFE;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .info-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.1));
          border-radius: 12px;
          color: #3B82F6;
          flex-shrink: 0;
        }

        .info-box:hover .info-icon {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.15));
          color: #0EA5E9;
        }

        .info-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .info-content {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #64748B;
          line-height: 1.8;
        }

        .info-content a {
          color: #3B82F6;
          text-decoration: none;
          font-weight: 600;
          transition: all 300ms ease;
        }

        .info-content a:hover {
          color: #0EA5E9;
          text-decoration: underline;
        }

        /* Map Section */
        .map-section {
          margin-top: 60px;
          animation: fadeInUp 0.8s ease 0.6s both;
        }

        .map-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 30px;
          text-align: center;
          letter-spacing: -0.5px;
        }

        .map-container {
          width: 100%;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
          border: 1.5px solid #E2E8F0;
        }

        .map-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .contact-container {
            padding: 60px 30px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .map-container {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding: 80px 20px 60px;
          }

          .contact-container {
            padding: 40px 20px;
          }

          .contact-form-section,
          .info-box {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .form-title {
            font-size: 24px;
          }

          .map-title {
            font-size: 28px;
          }

          .map-container {
            height: 300px;
          }
        }

        @media (max-width: 640px) {
          .contact-hero {
            padding: 60px 16px 40px;
          }

          .contact-hero h1 {
            font-size: 32px;
          }

          .contact-container {
            padding: 30px 16px;
          }

          .contact-form-section,
          .info-box {
            padding: 20px;
          }

          .form-input,
          .form-textarea {
            padding: 12px 12px;
          }

          .submit-btn {
            padding: 11px 20px;
            font-size: 12px;
          }

          .map-container {
            height: 250px;
          }

          .contact-grid {
            gap: 24px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="contact-container">
        {/* Contact Form & Info Grid */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="form-title">Send a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 XXXX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group form-full">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea
                  name="message"
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                <Send size={14} />
                {isLoading ? "Sending..." : "Send Message"}
              </button>

              {submitted && (
                <div className="success-message show">
                  <CheckCircle size={16} />
                  Message sent successfully!
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="info-box">
              <div className="info-header">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <h3 className="info-title">Phone</h3>
              </div>
              <div className="info-content">
                <p><a href="tel:+914224303300">+91 (422) 430-3300</a></p>
                <p><a href="tel:+914224303317">+91 (422) 430-3317</a></p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-header">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <h3 className="info-title">Email</h3>
              </div>
              <div className="info-content">
                <p><a href="mailto:alumni@psgcas.ac.in">alumni@psgcas.ac.in</a></p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-header">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <h3 className="info-title">Address</h3>
              </div>
              <div className="info-content">
                PSG College of Arts & Science<br/>
                Coimbatore, Tamil Nadu 641 014<br/>
                India
              </div>
            </div>

            <div className="info-box">
              <div className="info-header">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <h3 className="info-title">Hours</h3>
              </div>
              <div className="info-content">
                Monday - Friday: 9:00 AM - 5:00 PM<br/>
                Saturday - Sunday: Closed<br/>
                Public Holidays: Closed
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="map-section">
          <h2 className="map-title">Find Us On Map</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0537513396685!2d77.03128737498163!3d11.03459415437885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba858526b5c0591%3A0x6c452206816788d4!2sPSG%20College%20of%20Arts%20and%20Science!5e0!3m2!1sen!2sus!4v1773208195155!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PSG College of Arts and Science Location"
            ></iframe>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;