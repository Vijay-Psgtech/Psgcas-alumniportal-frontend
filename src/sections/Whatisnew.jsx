import React, { useState } from "react";
import {
  Calendar,
  Eye,
  Download,
  FileText,
  Sparkles,
  Lock,
  FileCheck,
} from "lucide-react";

const WhatIsNew = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const newsletters = [
    {
      id: 1,
      title: "PSG Arts Alumni Newsletter - Oct-Dec 2025",
      date: "Feb 04, 2026",
      views: 245,
      fileName: "PSG_Alumni_Newsletter_Oct-Dec_2025.pdf",
      fileSize: "18 MB",
      thumbnail: "linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop",
      pdfUrl: "/PDF/oct_dec_25.pdf",
      category: "newsletter",
      excerpt:
        "Stay updated with the latest alumni achievements, events, and success stories from our community.",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
    },
    {
      id: 2,
      title: "PSG Arts Alumni Newsletter - Jul - Sep 2025",
      date: "Nov 03, 2025",
      views: 512,
      fileName: "PSG_Alumni_Newsletter_Jul-Sep_2025.pdf",
      fileSize: "16 MB",
      thumbnail: "linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      pdfUrl: "/PDF/jul_sep_25.pdf",
      category: "newsletter",
      excerpt:
        "Connecting alumni across the globe through inspiring stories and valuable updates.",
      color: "#06B6D4",
      bgColor: "#F0FDFA",
    },
    {
      id: 3,
      title: "In Their Words: Thank You to Our Teachers",
      date: "Sep 09, 2025",
      views: 789,
      fileName: "",
      fileSize: "",
      thumbnail: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      pdfUrl: "",
      category: "alumni-stories",
      excerpt:
        "Celebrating the dedication and impact of our beloved faculty members.",
      color: "#8B5CF6",
      bgColor: "#FAF5FF",
    },
  ];

  const filteredNewsletters =
    activeTab === "all"
      ? newsletters
      : newsletters.filter((n) => n.category === activeTab);

  const handleOpenPDF = (pdf) => {
    if (pdf.pdfUrl) {
      window.open(pdf.pdfUrl, "_blank");
      console.log("📄 Opening PDF in new tab:", pdf.pdfUrl);
    } else {
      console.error("❌ PDF URL not available");
    }
  };

  const handleClosePDF = () => {
    // No longer needed
  };

  const downloadPDF = (pdf) => {
    if (pdf && pdf.pdfUrl) {
      const link = document.createElement("a");
      link.href = pdf.pdfUrl;
      link.download = pdf.fileName || "document.pdf";
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("📥 Downloaded:", pdf.fileName);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ==================== SECTION ==================== */
        .whats-new-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          padding: 140px 40px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
        }

        /* Background Decorations */
        .whats-new-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 0;
        }

        .bg-decoration {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.06;
          animation: float 15s ease-in-out infinite;
        }

        .deco-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          top: -200px;
          right: -100px;
          animation-delay: 0s;
        }

        .deco-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #06B6D4, #8B5CF6);
          bottom: -150px;
          left: -80px;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-50px);
          }
        }

        /* ==================== HEADER ==================== */
        .whats-new-header {
          position: relative;
          z-index: 10;
          margin-bottom: 80px;
          max-width: 900px;
        }

        .whats-new-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #F0F9FF;
          border: 1.5px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: 24px;
          font-size: 12px;
          font-weight: 700;
          color: #3B82F6;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
          animation: slideUp 0.8s ease-out 0.1s backwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .whats-new-title {
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 16px;
          letter-spacing: -1.5px;
          line-height: 1.1;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .whats-new-title span {
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .whats-new-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #64748B;
          line-height: 1.7;
          animation: slideUp 0.8s ease-out 0.3s backwards;
        }

        .header-line {
          width: 120px;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          margin-top: 32px;
          border-radius: 2px;
          animation: expandWidth 0.8s ease-out 0.4s backwards;
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 120px;
          }
        }

        /* ==================== TABS ==================== */
        .newsletter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 80px;
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
          animation: fadeIn 0.8s ease-out 0.5s backwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .tab-btn {
          padding: 12px 28px;
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          color: #64748B;
          border-radius: 50px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .tab-btn:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
          transform: translateY(-3px);
        }

        /* ==================== GRID ==================== */
        .newsletter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 48px;
          position: relative;
          z-index: 10;
        }

        /* ==================== CARD ==================== */
        .newsletter-card {
          group: newsletter-card;
          position: relative;
          cursor: pointer;
          animation: cardSlide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: both;
        }

        .newsletter-card:nth-child(1) { animation-delay: 0.6s; }
        .newsletter-card:nth-child(2) { animation-delay: 0.7s; }
        .newsletter-card:nth-child(3) { animation-delay: 0.8s; }
        .newsletter-card:nth-child(4) { animation-delay: 0.9s; }

        @keyframes cardSlide {
          from {
            opacity: 0;
            transform: translateY(60px) translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        .card-inner {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }

        .newsletter-card:hover .card-inner {
          border-color: var(--card-color);
          background: var(--card-bg);
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
        }

        /* Image Section */
        .newsletter-image-wrapper {
          position: relative;
          height: 320px;
          overflow: hidden;
          background: linear-gradient(135deg, var(--card-bg), #FFFFFF);
        }

        .newsletter-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .newsletter-card:hover .newsletter-image {
          transform: scale(1.15) rotate(1deg);
        }

        /* Overlay */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--thumbnail), var(--thumbnail));
          opacity: 0;
          transition: opacity 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .newsletter-card:hover .image-overlay {
          opacity: 0.85;
        }

        .overlay-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-color);
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        /* Content */
        .newsletter-content {
          padding: 40px 32px;
        }

        .newsletter-meta-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
        }

        .newsletter-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 12px;
          line-height: 1.3;
          letter-spacing: -0.5px;
        }

        .newsletter-excerpt {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .newsletter-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #E2E8F0;
          margin-bottom: 24px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          color: #64748B;
        }

        .meta-item svg {
          color: #3B82F6;
          width: 16px;
          height: 16px;
        }

        .file-info {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(59, 130, 246, 0.08);
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .file-info svg {
          color: #3B82F6;
          width: 14px;
          height: 14px;
        }

        .cta-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .view-btn {
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
        }

        .download-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: #3B82F6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .download-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: scale(1.1);
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 1400px) {
          .pdf-modal {
            width: 90vw;
            max-height: 90vh;
          }
        }

        @media (max-width: 1200px) {
          .whats-new-section {
            padding: 100px 30px;
          }

          .whats-new-title {
            font-size: 56px;
          }

          .newsletter-grid {
            gap: 40px;
          }

          .pdf-modal {
            width: 92vw;
            max-height: 90vh;
          }

          .modal-body {
            min-height: 400px;
          }
        }

        @media (max-width: 1024px) {
          .pdf-modal {
            width: 94vw;
            max-height: 88vh;
          }

          .modal-title {
            font-size: 22px;
          }

          .modal-body {
            padding: 28px;
            min-height: 380px;
          }

          .modal-footer {
            gap: 16px;
            padding: 18px 24px;
          }

          .page-indicator {
            font-size: 12px;
            padding: 0 10px;
          }
        }

        @media (max-width: 768px) {
          .whats-new-section {
            min-height: auto;
            padding: 80px 20px;
          }

          .whats-new-title {
            font-size: 40px;
          }

          .newsletter-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .newsletter-image-wrapper {
            height: 240px;
          }

          .newsletter-content {
            padding: 28px;
          }

          .newsletter-title {
            font-size: 20px;
          }

          .pdf-modal {
            width: 96vw;
            max-height: 85vh;
            border-radius: 24px;
          }

          .modal-header {
            padding: 20px 24px;
            gap: 16px;
          }

          .modal-title {
            font-size: 20px;
            -webkit-line-clamp: 2;
          }

          .modal-controls {
            gap: 6px;
          }

          .modal-btn {
            width: 36px;
            height: 36px;
          }

          .modal-body {
            padding: 24px;
            min-height: 320px;
          }

          .pdf-canvas {
            border-width: 1px;
          }

          .modal-footer {
            grid-template-columns: 1fr;
            padding: 16px 24px;
            gap: 12px;
          }

          .page-indicator {
            justify-self: center;
            width: 100%;
            text-align: center;
          }

          .nav-buttons {
            width: 100%;
            gap: 6px;
          }

          .nav-btn {
            flex: 1;
            height: 38px;
            padding: 0 12px;
            font-size: 11px;
          }

          .download-pdf-btn {
            width: 100%;
            height: 38px;
            font-size: 11px;
          }
        }

        @media (max-width: 640px) {
          .pdf-modal {
            width: 97vw;
            max-height: 82vh;
          }

          .modal-header {
            padding: 18px 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-btn {
            width: 34px;
            height: 34px;
          }

          .modal-body {
            padding: 20px;
            min-height: 300px;
          }

          .loading span {
            font-size: 13px;
          }

          .spinner {
            width: 40px;
            height: 40px;
          }

          .pdf-error {
            padding: 40px 24px;
            gap: 16px;
          }

          .pdf-error-icon {
            width: 80px;
            height: 80px;
          }

          .pdf-error-message {
            font-size: 15px;
            max-width: 100%;
          }

          .modal-footer {
            padding: 14px 20px;
            gap: 10px;
          }

          .page-indicator {
            height: 36px;
            font-size: 11px;
          }

          .nav-btn {
            height: 36px;
            padding: 0 10px;
            font-size: 10px;
            gap: 4px;
          }

          .download-pdf-btn {
            height: 36px;
            padding: 0 12px;
            font-size: 10px;
            gap: 4px;
          }
        }

        @media (max-width: 480px) {
          .whats-new-section {
            padding: 60px 16px;
          }

          .whats-new-title {
            font-size: 32px;
          }

          .newsletter-grid {
            gap: 24px;
          }

          .newsletter-image-wrapper {
            height: 200px;
          }

          .newsletter-content {
            padding: 20px;
          }

          .newsletter-title {
            font-size: 18px;
          }

          .pdf-modal {
            width: 98vw;
            max-height: 80vh;
            border-radius: 20px;
          }

          .modal-header {
            padding: 16px 18px;
            gap: 12px;
          }

          .modal-title {
            font-size: 16px;
            -webkit-line-clamp: 2;
          }

          .modal-btn {
            width: 32px;
            height: 32px;
          }

          .modal-body {
            padding: 18px;
            min-height: 280px;
          }

          .loading {
            gap: 12px;
          }

          .spinner {
            width: 36px;
            height: 36px;
            border-width: 3px;
          }

          .pdf-error {
            padding: 36px 20px;
            gap: 14px;
          }

          .pdf-error-icon {
            width: 72px;
            height: 72px;
          }

          .pdf-error-message {
            font-size: 14px;
          }

          .modal-footer {
            grid-template-columns: 1fr;
            padding: 12px 16px;
            gap: 10px;
          }

          .page-indicator {
            height: 34px;
            font-size: 10px;
            padding: 0 8px;
          }

          .nav-buttons {
            width: 100%;
            gap: 6px;
          }

          .nav-btn {
            flex: 1;
            height: 34px;
            padding: 0 8px;
            font-size: 9px;
            gap: 3px;
            border-radius: 6px;
          }

          .download-pdf-btn {
            width: 100%;
            height: 34px;
            padding: 0;
            font-size: 9px;
            gap: 3px;
            border-radius: 6px;
          }
        }

        @media (max-width: 360px) {
          .pdf-modal {
            width: 99vw;
            max-height: 75vh;
          }

          .modal-title {
            font-size: 14px;
          }

          .modal-btn {
            width: 30px;
            height: 30px;
          }

          .modal-body {
            min-height: 250px;
          }

          .page-indicator {
            height: 32px;
            font-size: 9px;
          }

          .nav-btn {
            height: 32px;
            font-size: 8px;
          }

          .download-pdf-btn {
            height: 32px;
            font-size: 8px;
          }
        }

          .nav-buttons {
            width: 100%;
            flex-direction: column;
          }

          .nav-btn {
            flex: 1;
            justify-content: center;
          }

          .download-pdf-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <section className="whats-new-section">
        {/* Background */}
        <div className="whats-new-bg">
          <div className="bg-decoration deco-1"></div>
          <div className="bg-decoration deco-2"></div>
        </div>

        {/* Header */}
        <div className="whats-new-header">
          <div className="whats-new-badge">
            <Sparkles size={16} />
            Explore Latest
          </div>
          <h2 className="whats-new-title">
            What's <span>New</span>
          </h2>
          <p className="whats-new-subtitle">
            Discover the latest alumni newsletters and brochures. Click any card
            to view the complete PDF with our interactive viewer.
          </p>
          <div className="header-line"></div>
        </div>

        {/* Tabs */}
        <div className="newsletter-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`tab-btn ${activeTab === "newsletter" ? "active" : ""}`}
            onClick={() => setActiveTab("newsletter")}
          >
            Newsletters
          </button>
          <button
            className={`tab-btn ${activeTab === "alumni-stories" ? "active" : ""}`}
            onClick={() => setActiveTab("alumni-stories")}
          >
            Alumni Stories
          </button>
        </div>

        {/* Grid */}
        <div className="newsletter-grid">
          {filteredNewsletters.map((item) => (
            <div
              key={item.id}
              className="newsletter-card"
              style={{
                "--card-color": item.color,
                "--card-bg": item.bgColor,
                "--thumbnail": item.thumbnail,
              }}
              onClick={() => handleOpenPDF(item)}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-inner">
                {/* Image */}
                <div className="newsletter-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="newsletter-image"
                  />
                  <div className="image-overlay">
                    <div className="overlay-icon">
                      <FileText size={32} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="newsletter-content">
                  <div className="newsletter-meta-top">
                    <span className="meta-badge">
                      <Lock size={12} />
                      PDF
                    </span>
                  </div>

                  <h3 className="newsletter-title">{item.title}</h3>
                  <p className="newsletter-excerpt">{item.excerpt}</p>

                  <div className="file-info">
                    <FileCheck size={14} />
                    {item.fileName} • {item.fileSize}
                  </div>

                  <div className="newsletter-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <div className="meta-item">
                      <Eye size={14} />
                      {item.views}
                    </div>
                  </div>

                  <div className="cta-group">
                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenPDF(item);
                      }}
                    >
                      <FileText size={16} />
                      View PDF
                    </button>
                    <button
                      className="download-btn"
                      title="Download"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadPDF(item);
                      }}
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WhatIsNew;
