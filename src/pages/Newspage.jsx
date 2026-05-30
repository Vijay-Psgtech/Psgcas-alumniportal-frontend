import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { newsLetterAPI, API_BASE } from "../services/api";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  usePageTitle("News & Updates");

  // Now use the defined newsData in state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [years, setYears] = useState([]);
  const [filteredNews, setFilteredNews] = useState(newsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract unique years from news data for filtering
  useEffect(() => {
    const uniqueYears = [
      ...new Set(
        newsData
          .map((news) => new Date(news.date).getFullYear())
          .filter(Boolean),
      ),
    ].sort((a, b) => b - a);
    setYears(uniqueYears);
  }, [newsData]);

  // Categories sidebar
  const categories = [
    { id: "all", label: "All Posts", icon: "📰" },
    { id: "newsletters", label: "Newsletters", icon: "📬" },
    { id: "alumni-stories", label: "Alumni Stories", icon: "👥" },
    { id: "institute-updates", label: "Institute Updates", icon: "🏫" },
    { id: "events", label: "Events", icon: "🎯" },
    { id: "accolades", label: "Accolades/Accreditations", icon: "🏆" },
  ];

  // Fetch news data from API on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsLetterAPI.getAll();
        setNewsData(response.data.data);
        setFilteredNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNews();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterNews(query, selectedCategory, selectedYear);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterNews(searchQuery, category, selectedYear);
  };

  // Handle year filter
  const handleYearFilter = (year) => {
    setSelectedYear(year);
    filterNews(searchQuery, selectedCategory, year);
  };

  // Filter news based on search, category, and year
  const filterNews = (query, category, year) => {
    let filtered = newsData;

    if (category !== "All Posts") {
      filtered = filtered.filter(
        (news) =>
          news.category === category ||
          (news.tags && news.tags.includes(category)),
      );
    }

    if (year !== "All Years") {
      filtered = filtered.filter(
        (news) => new Date(news.date).getFullYear().toString() === year,
      );
    }

    if (query.trim()) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.description.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredNews]);

  const paginationPages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* News Page Container */
        .news-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 100px 60px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .news-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 40px;
        }

        /* Sidebar */
        .news-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Search Box */
        .search-box {
          display: flex;
          gap: 0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
        }

        .search-box input {
          flex: 1;
          padding: 14px 18px;
          border: none;
          font-size: 14px;
          color: #1f2937;
          background: white;
          font-family: inherit;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .search-box input:focus {
          outline: none;
          background: #fafbfc;
        }

        .search-btn {
          padding: 0 18px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-btn:hover {
          transform: translateX(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        /* Categories Section */
        .categories-section {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
        }

        .categories-title {
          padding: 20px 18px;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .category-list {
          list-style: none;
        }

        .category-item {
          border-bottom: 1px solid #e5e7eb;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .category-item:last-child {
          border-bottom: none;
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          background: white;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .years-section {
          margin-top: 24px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
        }

        .years-title {
          padding: 20px 18px;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .category-link:hover {
          background: #f3f4f6;
          color: #0052cc;
          padding-left: 22px;
        }

        .category-link.active {
          background: #eff6ff;
          color: #0052cc;
          font-weight: 600;
          border-left: 4px solid #dc2626;
          padding-left: 14px;
        }

        /* Main Content */
        .news-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* News Card */
        .news-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(31, 41, 55, 0.08);
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: grid;
          grid-template-columns: 1fr;
        }

        .news-card:hover {
          box-shadow: 0 8px 20px rgba(31, 41, 55, 0.12);
          transform: translateY(-4px);
        }

        .news-card.with-image {
          grid-template-columns: 280px 1fr;
        }

        .news-image {
          width: 100%;
          height: 100%;
          min-height: 200px;
          object-fit: cover;
          background: #e5e7eb;
        }

        .news-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .news-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .news-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-weight: 500;
        }

        .news-share {
          cursor: pointer;
          color: #9ca3af;
          transition: color 300ms;
        }

        .news-share:hover {
          color: #0052cc;
        }

        .news-title {
          font-size: 18px;
          font-weight: 700;
          color: #0052cc;
          margin-bottom: 12px;
          line-height: 1.4;
          text-decoration: none;
          display: block;
          transition: color 300ms;
          cursor: pointer;
        }

        .news-title:hover {
          color: #1a73e8;
          text-decoration: underline;
        }

        .news-excerpt {
          font-size: 14px;
          color: #6b7280;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .news-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .news-tag {
          display: inline-block;
          padding: 6px 12px;
          background: #eff6ff;
          color: #0052cc;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .news-author {
          font-size: 12px;
          color: #9ca3af;
          margin-left: auto;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state-text {
          font-size: 16px;
          color: #4b5563;
        }

        /* Pagination */
        .news-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(31, 41, 55, 0.08);
        }

        .pagination-summary {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 200ms ease;
          font-family: inherit;
        }

        .pagination-btn:hover:not(:disabled):not(.active) {
          border-color: #0052cc;
          color: #0052cc;
          background: #eff6ff;
        }

        .pagination-btn.active {
          border-color: #dc2626;
          background: #dc2626;
          color: white;
          cursor: default;
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .pagination-ellipsis {
          width: 28px;
          text-align: center;
          color: #9ca3af;
          font-weight: 700;
        }

        /* Responsive */
        @media(max-width: 1024px) {
          .news-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .news-card.with-image {
            grid-template-columns: 240px 1fr;
          }

          .news-sidebar {
            order: 2;
          }

          .news-content {
            order: 1;
          }
        }

        @media(max-width: 768px) {
          .news-page {
            padding: 40px 16px;
          }

          .news-container {
            gap: 24px;
          }

          .news-card.with-image {
            grid-template-columns: 200px 1fr;
          }

          .news-body {
            padding: 20px;
          }

          .news-title {
            font-size: 16px;
          }

          .news-excerpt {
            font-size: 13px;
          }
        }

        @media(max-width: 640px) {
          .news-page {
            padding: 30px 12px;
          }

          .news-container {
            grid-template-columns: 1fr;
          }

          .news-card.with-image {
            grid-template-columns: 1fr;
          }

          .news-image {
            min-height: 180px;
          }

          .news-body {
            padding: 16px;
          }

          .news-title {
            font-size: 15px;
          }

          .search-box {
            margin-bottom: 16px;
          }

          .news-pagination {
            align-items: stretch;
            flex-direction: column;
          }

          .pagination-controls {
            justify-content: center;
          }

          .pagination-summary {
            text-align: center;
          }
        }
      `}</style>

      <div className="news-page">
        <motion.div
          className="news-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Sidebar */}
          <motion.aside className="news-sidebar" variants={itemVariants}>
            {/* Search Box */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                className="search-btn"
                onClick={() => handleSearch(searchQuery)}
              >
                <Search size={20} />
              </button>
            </div>

            <div className="years-section">
              <div className="years-title">Filter by Year</div>
              <ul className="category-list">
                <li className="category-item">
                  <button
                    className={`category-link ${
                      selectedYear === "All Years" ? "active" : ""
                    }`}
                    onClick={() => handleYearFilter("All Years")}
                  >
                    <span>📅</span>
                    <span>All Years</span>
                  </button>
                </li>
                {years.map((year) => (
                  <li key={year} className="category-item">
                    <button
                      className={`category-link ${
                        selectedYear.toString() === year.toString()
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleYearFilter(year.toString())}
                    >
                      <span>📅</span>
                      <span>{year}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="categories-section">
              <div className="categories-title">Categories</div>
              <ul className="category-list">
                {categories.map((category) => (
                  <li key={category.id} className="category-item">
                    <button
                      className={`category-link ${
                        selectedCategory === category.label ? "active" : ""
                      }`}
                      onClick={() => handleCategoryFilter(category.label)}
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main className="news-content" variants={containerVariants}>
            {filteredNews.length > 0 ? (
              paginatedNews.map((news, idx) => {
                const imageSrc = news.imageUrl
                  ? `${API_BASE}/${news.imageUrl}`
                  : news.image;
                const hasImage = Boolean(imageSrc);
                return (
                  <motion.article
                    key={news._id || news.id || idx}
                    className={`news-card ${hasImage ? "with-image" : ""}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {hasImage && (
                      <img
                        src={imageSrc}
                        alt={news.title}
                        className="news-image"
                      />
                    )}
                    <div className="news-body">
                      <div>
                        <div className="news-header">
                          <span className="news-date">
                            <Calendar size={16} />
                            {new Date(news.date).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span className="news-share">
                            <Share2 size={18} />
                          </span>
                        </div>
                        <Link
                          to={`/news/${news._id || news.id}`}
                          className="news-title"
                        >
                          <h2 className="news-title">{news.title}</h2>
                        </Link>

                        <p className="news-excerpt">{news.description}</p>
                      </div>

                      <div className="news-footer">
                        <span className="news-tag">{news.category}</span>
                        <span className="news-author">{news.author}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p className="empty-state-text">
                  No posts found. Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {filteredNews.length > 0 && totalPages > 1 && (
              <nav className="news-pagination" aria-label="News pagination">
                <div className="pagination-summary">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredNews.length)} of{" "}
                  {filteredNews.length} posts
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {paginationPages.map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="pagination-ellipsis"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </nav>
            )}
          </motion.main>
        </motion.div>
      </div>
    </>
  );
};

export default NewsPage;
