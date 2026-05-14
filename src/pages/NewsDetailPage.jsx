import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { newsLetterAPI, API_BASE } from "../services/api";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  EyeOff,
  FileText,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
} from "lucide-react";

// ─── PDF.js worker ────────────────────────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ─── Font tokens (style prop only — Tailwind can't embed @font-face) ─────────
const FONT_DISPLAY = "'DM Serif Display', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

// ─── Component ────────────────────────────────────────────────────────────────
const NewsDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [newsletter,  setNewsletter]  = useState(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [pdfUrl,      setPdfUrl]      = useState(null);
  const [numPages,    setNumPages]    = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setIsLoading(true);
        const response = await newsLetterAPI.getById(id);
        const data = response.data?.data ?? response.data;
        setNewsletter(data);
        if (data?.pdfUrl) setPdfUrl(normalizeUrl(data.pdfUrl));
      } catch (err) {
        console.error("Error fetching newsletter:", err);
        setError("Unable to load newsletter details.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchNewsletter();
  }, [id]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const normalizeUrl = (path) => {
    if (!path) return null;
    const n = path.replace(/\\/g, "/");
    return n.startsWith("http") ? n : `${API_BASE}/${n}`;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  const renderDescription = (text) => {
    if (!text) return null;
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line, i) => (
        <p key={i} className="mb-[18px] last:mb-0 text-base leading-[1.85] text-[#4b5261]">
          {line}
        </p>
      ));
  };

  const handlePdfLoad = ({ numPages: n }) => {
    setNumPages(n);
    setCurrentPage(1);
  };

  const imageSrc = newsletter?.imageUrl ? normalizeUrl(newsletter.imageUrl) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#fafaf8] text-[#0f1117]"
        style={{ fontFamily: FONT_BODY }}
      >
        <main className="max-w-[1100px] mx-auto px-6 py-10 pb-20 flex flex-col gap-7">

          {/* ── Back button ─────────────────────────────────────────────────── */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-full
                bg-white border border-[#e8e6e1] text-[#4b5261] text-[13.5px] font-medium
                cursor-pointer transition-all duration-200
                shadow-[0_1px_3px_rgba(15,17,23,.06),0_1px_2px_rgba(15,17,23,.04)]
                hover:border-[#c8522a] hover:text-[#c8522a] hover:bg-[#fff5f2] hover:-translate-x-0.5"
            >
              <ArrowLeft size={15} />
              Back to News
            </button>
          </div>

          {/* ── Loading state ────────────────────────────────────────────────── */}
          {isLoading && (
            <div className="min-h-[60vh] flex items-center justify-center rounded-3xl bg-white
              shadow-[0_4px_16px_rgba(15,17,23,.08),0_1px_4px_rgba(15,17,23,.05)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full border-[3px] border-[#e8e6e1] border-t-[#c8522a] animate-spin" />
                <p className="text-[22px] text-[#0f1117]" style={{ fontFamily: FONT_DISPLAY }}>
                  Loading newsletter…
                </p>
                <p className="text-sm text-[#8891a4]">Fetching the latest content for you</p>
              </div>
            </div>
          )}

          {/* ── Error state ──────────────────────────────────────────────────── */}
          {!isLoading && error && (
            <div className="min-h-[60vh] flex items-center justify-center rounded-3xl bg-white
              shadow-[0_4px_16px_rgba(15,17,23,.08)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <EyeOff size={40} className="text-[#c8522a]" />
                <p className="text-[22px] text-[#0f1117]" style={{ fontFamily: FONT_DISPLAY }}>
                  Something went wrong
                </p>
                <p className="text-sm text-[#8891a4]">{error}</p>
              </div>
            </div>
          )}

          {/* ── Not-found state ──────────────────────────────────────────────── */}
          {!isLoading && !error && !newsletter && (
            <div className="min-h-[60vh] flex items-center justify-center rounded-3xl bg-white
              shadow-[0_4px_16px_rgba(15,17,23,.08)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <FileText size={40} className="text-[#8891a4]" />
                <p className="text-[22px] text-[#0f1117]" style={{ fontFamily: FONT_DISPLAY }}>
                  Newsletter not found
                </p>
                <p className="text-sm text-[#8891a4]">
                  The article you're looking for doesn't exist or was removed.
                </p>
              </div>
            </div>
          )}

          {/* ── Main content ─────────────────────────────────────────────────── */}
          {!isLoading && !error && newsletter && (
            <>
              {/* ╔══════════════════════════════════════╗
                  ║  HERO CARD                           ║
                  ╚══════════════════════════════════════╝ */}
              <article className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-white
                shadow-[0_16px_48px_rgba(15,17,23,.12),0_4px_12px_rgba(15,17,23,.06)] min-h-[480px]">

                {/* Image half */}
                <div className="group relative overflow-hidden bg-[#f2f1ee] min-h-[340px]">
                  {imageSrc ? (
                    <>
                      <img
                        src={imageSrc}
                        alt={newsletter.title}
                        className="w-full h-full object-cover
                          transition-transform duration-[600ms] ease-[cubic-bezier(.4,0,.2,1)]
                          group-hover:scale-[1.04]"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(15,17,23,.18)] to-transparent pointer-events-none" />
                    </>
                  ) : (
                    /* Hatched no-image placeholder — repeating-linear-gradient needs style prop */
                    <div
                      className="w-full h-full min-h-[340px] flex flex-col items-center justify-center gap-3 text-[#8891a4]"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg,#f2f1ee 0,#f2f1ee 1px,#fafaf8 0,#fafaf8 50%) 0/20px 20px",
                      }}
                    >
                      <EyeOff size={36} />
                      <span className="text-[13px] font-medium">No image available</span>
                    </div>
                  )}
                </div>

                {/* Content half */}
                <div className="flex flex-col justify-center gap-5 p-10 md:p-[52px_48px] max-sm:p-9">

                  {/* Category badge */}
                  <span className="inline-flex items-center gap-[7px] w-fit
                    px-[14px] py-[5px] rounded-full uppercase tracking-[.06em]
                    text-[11.5px] font-semibold text-[#c8522a]
                    bg-[rgba(200,82,42,.08)] border border-[rgba(200,82,42,.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8522a] shrink-0" />
                    {newsletter.category || "Newsletter"}
                  </span>

                  {/* Title — clamp() needs style prop */}
                  <h1
                    className="leading-[1.18] tracking-[-0.01em] text-[#0f1117]"
                    style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(26px, 3.5vw, 44px)" }}
                  >
                    {newsletter.title}
                  </h1>

                  {/* Gold rule */}
                  <div className="w-10 h-[3px] bg-[#d4a849] rounded-sm" />

                  {/* Meta rows */}
                  <div className="flex flex-col gap-3">
                    {[
                      { icon: <Calendar size={14} />, label: "Published", value: formatDate(newsletter.date) },
                      { icon: <User     size={14} />, label: "Author",    value: newsletter.author || "Anonymous" },
                      // { icon: <Clock    size={14} />, label: "Created",   value: formatDate(newsletter.createdAt) },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-center gap-[10px] text-[13.5px] text-[#4b5261]">
                        <span className="text-[#1a3d6e] shrink-0">{icon}</span>
                        <span className="font-semibold text-[#8891a4] min-w-[70px]">{label}</span>
                        <span className="text-[#0f1117]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* ╔══════════════════════════════════════╗
                  ║  DESCRIPTION BODY                    ║
                  ╚══════════════════════════════════════╝ */}
              {newsletter.description && (
                <section className="relative overflow-hidden rounded-3xl bg-white
                  px-14 py-[52px] max-sm:px-6 max-sm:py-8
                  shadow-[0_4px_16px_rgba(15,17,23,.08),0_1px_4px_rgba(15,17,23,.05)]">

                  {/* Decorative large opening quote — replaces ::before pseudo-element */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[-24px] left-6 text-[180px] leading-none text-[#f2f1ee] pointer-events-none select-none"
                    style={{ fontFamily: FONT_DISPLAY }}
                  >
                    &ldquo;
                  </span>

                  {/* Section heading + hairline rule — replaces ::after pseudo-element */}
                  <div className="relative z-10 flex items-center gap-3 mb-6">
                    <p
                      className="text-[20px] text-[#1a3d6e] shrink-0"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      About this newsletter
                    </p>
                    <div className="flex-1 h-px bg-[#e8e6e1]" />
                  </div>

                  {/* Body copy */}
                  <div className="relative z-10">
                    {renderDescription(newsletter.description)}
                  </div>
                </section>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  INLINE PDF VIEWER                   ║
                  ╚══════════════════════════════════════╝ */}
              {pdfUrl && (
                <section className="rounded-3xl overflow-hidden bg-[#0f1117]
                  shadow-[0_16px_48px_rgba(15,17,23,.12),0_4px_12px_rgba(15,17,23,.06)]">

                  {/* ── PDF header bar ── */}
                  <div className="flex items-center justify-between flex-wrap gap-4
                    px-8 py-5 bg-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.08)]">

                    <div className="flex items-center gap-3">
                      {/* File icon badge */}
                      <div className="w-10 h-10 rounded-[10px] bg-[rgba(200,82,42,.2)] flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-[#c8522a]" />
                      </div>
                      <div>
                        <p className="text-[17px] text-white" style={{ fontFamily: FONT_DISPLAY }}>
                          Attached Document
                        </p>
                        <p className="text-[12px] text-[rgba(255,255,255,.45)] mt-[1px]">
                          {numPages ? `${numPages} page${numPages > 1 ? "s" : ""}` : "PDF Preview"}
                        </p>
                      </div>
                    </div>

                    {/* Download pill */}
                    <a
                      href={pdfUrl}
                      download
                      className="inline-flex items-center gap-[7px] px-[18px] py-[9px] rounded-full
                        bg-[#c8522a] text-white text-[13px] font-semibold no-underline
                        transition-all duration-200
                        hover:bg-[#b84422] hover:-translate-y-px
                        hover:shadow-[0_6px_20px_rgba(200,82,42,.35)]"
                    >
                      <Download size={14} />
                      Download PDF
                    </a>
                  </div>

                  {/* ── PDF canvas area ── */}
                  <div className="flex flex-col items-center justify-start bg-[#1c1e26] px-6 py-8 min-h-[520px]">
                    <div className="bg-white rounded-md overflow-hidden max-w-full shadow-[0_8px_32px_rgba(0,0,0,.4)]">
                      <Document
                        file={pdfUrl}
                        onLoadSuccess={handlePdfLoad}
                        loading={
                          <div className="flex items-center gap-[10px] py-[60px] px-6
                            text-[rgba(255,255,255,.5)] text-[14px]">
                            <div className="w-5 h-5 rounded-full border-2 border-[rgba(255,255,255,.15)] border-t-[#c8522a] animate-spin" />
                            Loading document…
                          </div>
                        }
                      >
                        <Page
                          pageNumber={currentPage}
                          width={Math.min(
                            820,
                            (typeof window !== "undefined" ? window.innerWidth : 900) - 80
                          )}
                        />
                      </Document>
                    </div>
                  </div>

                  {/* ── PDF controls bar ── */}
                  {numPages && (
                    <div className="flex items-center justify-between flex-wrap gap-4
                      px-8 py-[18px]
                      bg-[rgba(255,255,255,.02)] border-t border-[rgba(255,255,255,.07)]">

                      {/* Left: page info */}
                      <span className="text-[13px] text-[rgba(255,255,255,.5)]">
                        Page {currentPage} / {numPages}
                      </span>

                      {/* Centre: prev / input / next */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage <= 1}
                          className="w-9 h-9 rounded-lg flex items-center justify-center
                            border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.06)]
                            text-[rgba(255,255,255,.7)] transition-all duration-200
                            hover:enabled:bg-[rgba(255,255,255,.14)]
                            hover:enabled:border-[rgba(255,255,255,.25)]
                            disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <input
                          type="number"
                          min={1}
                          max={numPages}
                          value={currentPage}
                          onChange={(e) =>
                            setCurrentPage(
                              Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages)
                            )
                          }
                          className="w-12 h-9 rounded-lg text-center text-[13px] font-medium text-white
                            border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.06)]
                            outline-none transition-all duration-200
                            focus:border-[#c8522a] focus:bg-[rgba(200,82,42,.1)]
                            [appearance:textfield]
                            [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                          disabled={currentPage >= numPages}
                          className="w-9 h-9 rounded-lg flex items-center justify-center
                            border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.06)]
                            text-[rgba(255,255,255,.7)] transition-all duration-200
                            hover:enabled:bg-[rgba(255,255,255,.14)]
                            hover:enabled:border-[rgba(255,255,255,.25)]
                            disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Right: read % */}
                      <span className="text-[13px] text-[rgba(255,255,255,.5)] text-right">
                        {Math.round((currentPage / numPages) * 100)}% read
                      </span>
                    </div>
                  )}
                </section>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  FOOTER / TAGS                       ║
                  ╚══════════════════════════════════════╝ */}
              <footer className="flex items-center justify-between flex-wrap gap-5
                px-10 py-7 max-sm:px-5 rounded-3xl bg-white
                shadow-[0_4px_16px_rgba(15,17,23,.08),0_1px_4px_rgba(15,17,23,.05)]">

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(newsletter.tags) && newsletter.tags.length > 0 ? (
                    newsletter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-[5px]
                          px-[14px] py-[6px] rounded-full
                          bg-[#f2f1ee] border border-[#e8e6e1]
                          text-[12.5px] font-medium text-[#4b5261]
                          transition-all duration-200
                          hover:bg-[rgba(26,61,110,.08)]
                          hover:border-[rgba(26,61,110,.2)]
                          hover:text-[#1a3d6e]"
                      >
                        <Tag size={11} />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-[5px]
                      px-[14px] py-[6px] rounded-full
                      bg-[#f2f1ee] border border-[#e8e6e1]
                      text-[12.5px] font-medium text-[#4b5261]">
                      <Tag size={11} />
                      {newsletter.category || "Alumni Stories"}
                    </span>
                  )}
                </div>

                {/* Back button */}
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-[7px] px-[18px] py-[10px] rounded-full
                    bg-white border border-[#e8e6e1] text-[#4b5261] text-[13.5px] font-medium
                    cursor-pointer transition-all duration-200
                    shadow-[0_1px_3px_rgba(15,17,23,.06)]
                    hover:border-[#c8522a] hover:text-[#c8522a] hover:bg-[#fff5f2] hover:-translate-x-0.5"
                >
                  <ArrowLeft size={14} />
                  Back to News
                </button>
              </footer>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default NewsDetailPage;