import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newsLetterAPI, API_BASE } from "../services/api";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setIsLoading(true);
        const response = await newsLetterAPI.getById(id);
        const data = response.data?.data ?? response.data;
        setNewsletter(data);
      } catch (fetchError) {
        console.error("Error fetching newsletter details:", fetchError);
        setError("Unable to load newsletter details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNewsletter();
    }
  }, [id]);

  const normalizeImage = (path) => {
    if (!path) return null;
    const normalized = path.replace(/\\/g, "/");
    return normalized.startsWith("http")
      ? normalized
      : `${API_BASE}/${normalized}`;
  };

  const renderDescription = (text) => {
    if (!text) return null;
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line, index) => (
        <p key={index} className="detail-paragraph">
          {line}
        </p>
      ));
  };

  const imageSrc = newsletter?.imageUrl
    ? normalizeImage(newsletter.imageUrl)
    : null;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 md:py-20 px-4 md:px-8 font-inter text-slate-900">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-96 bg-white rounded-card shadow-card p-8">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full"></div>
                </div>
                <p className="text-slate-600 text-lg">
                  Loading newsletter details...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-96 bg-red-50 rounded-card shadow-card p-8 border border-red-200">
              <div className="text-center">
                <p className="text-red-600 text-lg font-semibold">{error}</p>
              </div>
            </div>
          ) : !newsletter ? (
            <div className="flex items-center justify-center min-h-96 bg-white rounded-card shadow-card p-8">
              <p className="text-slate-500 text-lg">Newsletter not found.</p>
            </div>
          ) : (
            <article className="bg-white rounded-card shadow-card overflow-hidden">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative bg-slate-100 min-h-80 lg:min-h-96 overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={newsletter.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <div className="text-center">
                        <EyeOff
                          size={48}
                          className="text-slate-400 mx-auto mb-2"
                        />
                        <p className="text-slate-500 font-medium">
                          No image available
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex flex-col justify-center gap-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary-700 rounded-full w-fit">
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    <span className="text-sm font-bold tracking-wide">
                      {newsletter.category || "NEWSLETTER"}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                    {newsletter.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="space-y-3 text-sm md:text-base">
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 font-semibold">
                        Published:
                      </span>
                      <span className="text-slate-700">
                        {new Date(newsletter.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 font-semibold">
                        Posted by:
                      </span>
                      <span className="text-slate-700">
                        {newsletter.author || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-slate-500 font-semibold">
                        Created:
                      </span>
                      <span className="text-slate-700">
                        {new Date(newsletter.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className="px-8 md:px-10 py-8 md:py-10 border-t border-slate-100 bg-slate-50">
                <div className="prose prose-sm max-w-none prose-p:text-slate-600 prose-p:leading-relaxed">
                  {renderDescription(newsletter.description)}
                </div>
              </div>

              {/* Footer Section */}
              <div className="px-8 md:px-10 py-8 md:py-10 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(newsletter.tags) &&
                  newsletter.tags.length > 0 ? (
                    newsletter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-4 py-2 bg-blue-50 text-primary-700 rounded-full text-sm font-semibold"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block px-4 py-2 bg-blue-50 text-primary-700 rounded-full text-sm font-semibold">
                      {newsletter.category || "Alumni Stories"}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-btn hover:bg-slate-200 transition-colors font-semibold border border-slate-300 hover:border-slate-400"
                  >
                    ← Back to News
                  </button>
                  {newsletter.pdfUrl && (
                    <>
                      {/* <button
                        type="button"
                        onClick={() => setShowPdfModal(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-100 text-primary-700 rounded-btn hover:bg-primary-200 transition-colors font-semibold border border-primary-300"
                      >
                        <Eye size={18} />
                        Preview PDF
                      </button> */}
                      <a
                        href={normalizeImage(newsletter.pdfUrl)}
                        download
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-100 text-primary-700 rounded-btn hover:bg-primary-200 transition-colors font-semibold border border-primary-300"
                      >
                        <Download size={18} />
                        Download PDF
                      </a>
                    </>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsDetailPage;
