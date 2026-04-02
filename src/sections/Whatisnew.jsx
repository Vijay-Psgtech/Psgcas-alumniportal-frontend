import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Eye,
  Download,
  FileText,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Lock,
  AlertCircle,
  FileCheck,
} from "lucide-react";

const WhatIsNew = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);

  // Load PDF.js library with proper worker configuration
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;

        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            console.log("PDF.js loaded successfully");
          }
        };

        script.onerror = () => {
          console.error("Failed to load PDF.js");
          setPdfError("Failed to load PDF viewer library");
        };

        document.head.appendChild(script);

        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        console.error("Error setting up PDF.js:", error);
      }
    };

    loadPdfJs();
  }, []);

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
      pdfUrl: "/PDF/1280_1770202969_9176bc0da808261ed71c27738f77553d.pdf",
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
      pdfUrl:
        "https://arxiv.org/pdf/quant-ph/0410100.pdf",
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
      fileName: "Teachers_Appreciation_2025.pdf",
      fileSize: "12 MB",
      thumbnail: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      pdfUrl:
        "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf",
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

  const handleOpenPDF = async (pdf) => {
    setSelectedPDF(pdf);
    setCurrentPage(1);
    setLoading(true);
    setPdfError(null);

    try {
      if (!window.pdfjsLib) {
        setPdfError("PDF viewer is not loaded. Please refresh the page.");
        setLoading(false);
        return;
      }

      const pdfUrl = pdf.pdfUrl;
      console.log("Loading PDF from:", pdfUrl);

      const loadingTask = window.pdfjsLib.getDocument({
        url: pdfUrl,
        withCredentials: false,
      });

      const pdfDoc = await loadingTask.promise;
      pdfDocRef.current = pdfDoc;
      setTotalPages(pdfDoc.numPages);
      setLoading(false);

      renderPage(1, pdfDoc);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setPdfError(
        `Failed to load PDF: ${error.message}. Make sure the PDF URL is correct and accessible.`
      );
      setLoading(false);
    }
  };

  const renderPage = async (pageNum, pdfDoc = null) => {
    try {
      if (!canvasRef.current) return;

      setLoading(true);
      const doc = pdfDoc || pdfDocRef.current;

      if (!doc) {
        setPdfError("PDF document not loaded");
        setLoading(false);
        return;
      }

      const page = await doc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const scale = 2;
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      setLoading(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setPdfError(`Error rendering page: ${error.message}`);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      renderPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      renderPage(prevPage);
    }
  };

  const handleClosePDF = () => {
    setSelectedPDF(null);
    setCurrentPage(1);
    setTotalPages(0);
    setIsFullscreen(false);
    setPdfError(null);
    pdfDocRef.current = null;
  };

  const downloadPDF = () => {
    if (selectedPDF) {
      const link = document.createElement("a");
      link.href = selectedPDF.pdfUrl;
      link.download = selectedPDF.fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

        /* ==================== PDF MODAL ==================== */
        .pdf-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeInOverlay 0.3s ease;
          overflow: auto;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pdf-modal {
          background: white;
          border: 2px solid #E2E8F0;
          border-radius: 32px;
          overflow: hidden;
          max-width: 90vw;
          max-height: 85vh;
          width: 1000px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 120px rgba(59, 130, 246, 0.2);
          animation: slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUpModal {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 2px solid #E2E8F0;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%);
          flex-shrink: 0;
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .modal-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .modal-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.15);
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          color: #3B82F6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .modal-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: scale(1.05);
        }

        .modal-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          overflow: auto;
          position: relative;
          background: linear-gradient(180deg, #F8FAFB 0%, #F0F9FF 100%);
          min-height: 400px;
        }

        .pdf-viewer {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          overflow: hidden;
        }

        .pdf-canvas {
          max-width: 100%;
          max-height: 100%;
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.15);
          border-radius: 8px;
          display: block;
          border: 1px solid #E2E8F0;
        }

        .pdf-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #0F172A;
          text-align: center;
          padding: 40px;
        }

        .pdf-error-icon {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: rgba(59, 130, 246, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3B82F6;
        }

        .pdf-error-message {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          max-width: 400px;
          line-height: 1.6;
          color: #475569;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F172A;
          gap: 12px;
          flex-direction: column;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3B82F6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-top: 2px solid #E2E8F0;
          background: linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%);
          flex-wrap: wrap;
          gap: 16px;
          flex-shrink: 0;
        }

        .page-indicator {
          font-family: 'Poppins', sans-serif;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
        }

        .nav-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .nav-btn {
          padding: 10px 20px;
          background: rgba(59, 130, 246, 0.15);
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          color: #3B82F6;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.25);
          transform: translateY(-2px);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .download-pdf-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          border: none;
          color: white;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .download-pdf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
        }

        /* ==================== RESPONSIVE ==================== */
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
            width: 95vw;
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
            width: 98vw;
            max-height: 80vh;
            border-radius: 20px;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-body {
            padding: 20px;
            min-height: 300px;
          }

          .modal-footer {
            padding: 20px;
            justify-content: center;
            flex-direction: column;
          }

          .nav-buttons {
            width: 100%;
            justify-content: center;
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

          .modal-title {
            font-size: 18px;
          }

          .pdf-modal {
            width: 99vw;
            max-height: 75vh;
          }

          .modal-body {
            min-height: 250px;
          }

          .modal-footer {
            flex-direction: column;
            align-items: stretch;
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
            Discover the latest alumni newsletters and brochures. Click any card to view the complete PDF with our interactive viewer.
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
                '--card-color': item.color,
                '--card-bg': item.bgColor,
                '--thumbnail': item.thumbnail
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
                    <button className="view-btn">
                      <FileText size={16} />
                      View PDF
                    </button>
                    <button className="download-btn" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PDF Modal */}
      {selectedPDF && (
        <div className="pdf-modal-overlay" onClick={handleClosePDF}>
          <div
            className="pdf-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">{selectedPDF.title}</h2>
              <div className="modal-controls">
                <button
                  className="modal-btn"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title="Fullscreen"
                >
                  <Maximize2 size={20} />
                </button>
                <button
                  className="modal-btn"
                  onClick={handleClosePDF}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="modal-body">
              {pdfError ? (
                <div className="pdf-error">
                  <div className="pdf-error-icon">
                    <AlertCircle size={40} />
                  </div>
                  <div className="pdf-error-message">
                    {pdfError}
                  </div>
                  <p style={{fontSize: '12px', color: '#64748b'}}>
                    To use your own PDFs, replace the pdfUrl in the component with your accessible PDF URL
                  </p>
                </div>
              ) : loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <span>Loading PDF...</span>
                </div>
              ) : (
                <div className="pdf-viewer">
                  <canvas
                    ref={canvasRef}
                    className="pdf-canvas"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>
              <div className="nav-buttons">
                <button
                  className="nav-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  className="nav-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
                <button className="download-pdf-btn" onClick={downloadPDF}>
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatIsNew;