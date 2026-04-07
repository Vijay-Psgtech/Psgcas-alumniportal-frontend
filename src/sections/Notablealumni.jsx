import React, { useState } from "react";
import { Award, Briefcase, Zap, ChevronRight, Star } from "lucide-react";
import alumniImage1 from "../assets/Images/Alum1.png";
import alumniImage2 from "../assets/Images/Alum2.png";
import alumniImage3 from "../assets/Images/Alum3.png";

const NotableAlumni = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (alumniId) => {
    console.warn(`Image failed to load for alumni ${alumniId}`);
    setImageErrors((prev) => ({
      ...prev,
      [alumniId]: true,
    }));
  };

  const getFallbackImage = (alumniId) => {
    if (alumniId === 1) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
    } else if (alumniId === 2) {
      return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
    } else if (alumniId === 3) {
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop";
    }
    return "https://via.placeholder.com/400?text=Alumni";
  };

  const alumni = [
    {
      id: 1,
      name: "Dr. R. Ravichandan",
      batch: "1982 - 1987",
      degree: "B.Sc Nutrition & Dietetics",
      title: "Vice President and Head of Asia Business Operation",
      company: "Indian Immunological Ltd Hyderabad, Telangana",
      image: alumniImage1,
      category: "healthcare",
      icon: Award,
      achievement: "Healthcare Innovation",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 2,
      name: "Mrs. Vanathi Srinivasan",
      batch: "1987-1990",
      degree: "B.Sc Chemistry",
      title: "National President of the Women's wing of",
      company: "Bharathiya Jananta Party (BJP) Member of Tamil",
      image: alumniImage2,
      category: "politics",
      icon: Star,
      achievement: "Political Leadership",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 3,
      name: "Dr. K. Kathirvelu",
      batch: "1986-1989",
      degree: "B.Sc Zoology & MSC Environmental Science",
      title: 'Scientist "F" DEBEL Defence Research and',
      company: "Development Organization (DRDO)",
      image: alumniImage3,
      category: "research",
      icon: Zap,
      achievement: "Defence Technology",
      color: "#06B6D4",
      bgColor: "#F0FDFA",
      borderColor: "#A5F3FC",
    },
  ];

  const filteredAlumni =
    selectedCategory === "all"
      ? alumni
      : alumni.filter((a) => a.category === selectedCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        /* Notable Alumni Section */
        .notable-alumni-section {
          padding: 100px 40px;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
        }

        /* Background Decorations */
        .alumni-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .alumni-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.04;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          background: #3B82F6;
          top: -100px;
          right: 10%;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          background: #8B5CF6;
          bottom: -50px;
          left: 5%;
        }

        .blob-3 {
          width: 250px;
          height: 250px;
          background: #06B6D4;
          top: 50%;
          right: -50px;
        }

        /* Header */
        .alumni-header {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-bottom: 60px;
          animation: slideUp 0.8s ease-out;
        }

        .alumni-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #F0F9FF;
          border: 1px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: 16px;
          font-size: 12px;
          font-weight: 700;
          color: #3B82F6;
          letter-spacing: 0.8px;
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

        .alumni-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .alumni-subtitle {
          font-size: 16px;
          color: #64748B;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
          line-height: 1.6;
          animation: slideUp 0.8s ease-out 0.3s backwards;
        }

        .alumni-header::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6, #06B6D4);
          border-radius: 2px;
          margin: 20px auto 0;
          animation: expandWidth 0.8s ease-out 0.4s backwards;
        }

        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 60px;
            opacity: 1;
          }
        }

        /* Filter Tabs */
        .alumni-filters {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 60px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.8s ease-out 0.5s backwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-btn {
          padding: 11px 22px;
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          border-radius: 50px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-btn:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .filter-btn.active:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        /* Alumni Grid */
        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        /* Alumni Card */
        .alumni-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03);
        }

        .alumni-card:hover {
          transform: translateY(-12px);
          border-color: var(--accent-color);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        /* Image Wrapper */
        .alumni-image-wrapper {
          position: relative;
          height: 300px;
          overflow: hidden;
          background: var(--bg-color);
          aspect-ratio: 4 / 5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alumni-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          background: var(--bg-color);
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .alumni-card:hover .alumni-card-image {
          transform: scale(1.08);
        }

        /* Image Overlay */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          align-items: flex-end;
          padding: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .alumni-card:hover .image-overlay {
          opacity: 1;
        }

        /* Achievement Badge */
        .achievement-badge {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-darker));
          color: white;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
        }

        /* Icon Badge */
        .icon-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 48px;
          height: 48px;
          background: #FFFFFF;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.05);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .alumni-card:hover .icon-badge {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(15, 23, 42, 0.08);
        }

        /* Content */
        .alumni-content {
          padding: 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: linear-gradient(135deg, #FFFFFF 0%, rgba(248, 250, 251, 0.4) 100%);
        }

        .alumni-meta {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-color);
          font-family: 'Poppins', sans-serif;
          opacity: 0.9;
        }

        .alumni-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 4px 0 2px 0;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }

        .alumni-degree {
          font-size: 12px;
          color: var(--accent-color);
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .alumni-position {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          flex: 1;
          margin: 8px 0 12px 0;
          font-family: 'Poppins', sans-serif;
        }

        .alumni-position strong {
          color: #0F172A;
          font-weight: 600;
        }

        /* Button */
        .alumni-btn {
          align-self: flex-start;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-darker));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.6px;
          margin-top: auto;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
        }

        .alumni-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
        }

        /* Stats */
        .alumni-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          padding: 48px 40px;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
        }

        /* Responsive Design */
        @media(max-width: 1024px) {
          .notable-alumni-section {
            padding: 60px 30px;
          }

          .alumni-title {
            font-size: 40px;
          }

          .alumni-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .alumni-image-wrapper {
            height: 280px;
          }

          .alumni-content {
            padding: 28px;
          }

          .alumni-stats {
            gap: 24px;
            padding: 40px;
          }
        }

        @media(max-width: 768px) {
          .notable-alumni-section {
            padding: 60px 20px;
          }

          .alumni-header {
            margin-bottom: 50px;
          }

          .alumni-title {
            font-size: 32px;
          }

          .alumni-subtitle {
            font-size: 15px;
          }

          .alumni-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .alumni-image-wrapper {
            height: 260px;
          }

          .alumni-content {
            padding: 24px;
          }

          .alumni-name {
            font-size: 22px;
          }

          .alumni-stats {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 32px;
          }

          .alumni-filters {
            gap: 8px;
            margin-bottom: 50px;
          }

          .filter-btn {
            padding: 8px 16px;
            font-size: 12px;
          }
        }

        @media(max-width: 640px) {
          .notable-alumni-section {
            padding: 40px 16px;
          }

          .alumni-header {
            margin-bottom: 40px;
          }

          .alumni-title {
            font-size: 28px;
            margin-bottom: 12px;
          }

          .alumni-subtitle {
            font-size: 14px;
          }

          .alumni-badge {
            padding: 8px 16px;
            font-size: 11px;
          }

          .alumni-grid {
            gap: 20px;
            margin-bottom: 40px;
          }

          .alumni-image-wrapper {
            height: 240px;
          }

          .alumni-content {
            padding: 20px;
          }

          .alumni-name {
            font-size: 20px;
          }

          .alumni-position {
            font-size: 12px;
          }

          .alumni-btn {
            padding: 10px 14px;
            font-size: 11px;
          }

          .icon-badge {
            width: 44px;
            height: 44px;
          }

          .alumni-stats {
            gap: 16px;
            padding: 24px 16px;
          }

          .stat-number {
            font-size: 32px;
          }

          .stat-label {
            font-size: 11px;
          }
        }
      `}</style>

      <section className="notable-alumni-section">
        {/* Decorative Background */}
        <div className="alumni-bg-decoration">
          <div className="alumni-blob blob-1"></div>
          <div className="alumni-blob blob-2"></div>
          <div className="alumni-blob blob-3"></div>
        </div>

        {/* Header */}
        <div className="alumni-header">
          <div className="alumni-badge">⭐ Excellence in Education</div>
          <h2 className="alumni-title">Distinguished Alumni</h2>
          <p className="alumni-subtitle">
            Celebrating the achievements of our distinguished graduates who are
            making a global impact across various fields
          </p>
        </div>

        {/* Filters */}
        <div className="alumni-filters">
          <button
            className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
            aria-label="Show all alumni"
          >
            All Alumni
          </button>
          <button
            className={`filter-btn ${selectedCategory === "healthcare" ? "active" : ""}`}
            onClick={() => setSelectedCategory("healthcare")}
            aria-label="Filter healthcare alumni"
          >
            Healthcare
          </button>
          <button
            className={`filter-btn ${selectedCategory === "politics" ? "active" : ""}`}
            onClick={() => setSelectedCategory("politics")}
            aria-label="Filter politics alumni"
          >
            Politics
          </button>
          <button
            className={`filter-btn ${selectedCategory === "research" ? "active" : ""}`}
            onClick={() => setSelectedCategory("research")}
            aria-label="Filter research alumni"
          >
            Research
          </button>
        </div>

        {/* Alumni Grid */}
        <div className="alumni-grid">
          {filteredAlumni.map((person) => {
            const IconComponent = person.icon;
            const imageUrl = imageErrors[person.id]
              ? getFallbackImage(person.id)
              : person.image;

            return (
              <div
                key={person.id}
                className="alumni-card"
                style={{
                  "--accent-color": person.color,
                  "--accent-darker": person.borderColor,
                  "--bg-color": person.bgColor,
                }}
                onMouseEnter={() => setHoveredId(person.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="alumni-image-wrapper">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={person.name}
                      className="alumni-card-image"
                      onError={() => handleImageError(person.id)}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="image-loading">
                      <span>Unable to load image</span>
                    </div>
                  )}
                  <div className="image-overlay">
                    <div className="achievement-badge">
                      {person.achievement}
                    </div>
                  </div>
                  <div className="icon-badge">
                    <IconComponent size={24} />
                  </div>
                </div>

                <div className="alumni-content">
                  <div className="alumni-meta">{person.batch}</div>
                  <h3 className="alumni-name">{person.name}</h3>
                  <p className="alumni-degree">{person.degree}</p>
                  <p className="alumni-position">
                    <strong>{person.title}</strong>
                    <br />
                    {person.company}
                  </p>
                  <button className="alumni-btn">
                    Learn More <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        {/* <div className="alumni-stats">
          <div className="stat-item">
            <div className="stat-number">3K+</div>
            <div className="stat-label">Successful Alumni</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Leading Companies</div>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default NotableAlumni;
