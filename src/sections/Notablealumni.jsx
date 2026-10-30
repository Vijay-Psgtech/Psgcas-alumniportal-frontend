import React, { useState } from "react";
import { Award, Briefcase, Zap, Star, Users } from "lucide-react";
import { getSiteImageUrl } from "../services/api";

import { DEFAULT_NOTABLE_ALUMNI } from "../content/data/notableAlumniDefaults";
import { DEFAULT_HOME_CONTENT } from "../content/data/siteContentDefaults";
import useSiteContent from "../hooks/useSiteContent";

const NotableAlumni = () => {
  const [imageErrors, setImageErrors] = useState({});
  const homeContent = useSiteContent("home", DEFAULT_HOME_CONTENT);
  const alumni = homeContent.notable.alumni || DEFAULT_NOTABLE_ALUMNI;
  const sectionContent = homeContent.notable;

  const handleImageError = (alumniId) => {
    console.warn(`Image failed to load for alumni ${alumniId}`);
    setImageErrors((prev) => ({
      ...prev,
      [alumniId]: true,
    }));
  };

  const getFallbackImage = (alumniId) => {
    const images = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    ];
    return images[alumniId % images.length];
  };



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Notable Alumni Section */
        .notable-alumni-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
          min-height: auto;
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
          margin-bottom: 3.5rem;
          animation: slideUp 0.8s ease-out;
          padding: 0 2rem;
        }

        .alumni-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.625rem 1.125rem;
          background: #F0F9FF;
          border: 1px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: 1rem;
          font-size: clamp(10px, 1.5vw, 12px);
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
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
          animation: slideUp 0.8s ease-out 0.2s backwards;
          line-height: 1.2;
        }

        .alumni-subtitle {
          font-size: clamp(14px, 2vw, 16px);
          color: #64748B;
          font-weight: 400;
          max-width: 700px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
          line-height: 1.7;
          animation: slideUp 0.8s ease-out 0.3s backwards;
        }

        .alumni-header::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #3B82F6, #06B6D4);
          border-radius: 2px;
          margin: 1.5rem auto 0;
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

        /* Scroll Container */
        .alumni-scroll-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          padding: 2rem 0;
          margin-top: 2rem;
        }

        .alumni-scroll-container {
          display: flex;
          gap: 2rem;
          padding: 1rem 2rem;
          animation: scroll-left 120s linear infinite;
          width: fit-content;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 2rem));
          }
        }

        .alumni-scroll-wrapper:hover .alumni-scroll-container {
          animation-play-state: paused;
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
          height: 100%;
          width: 320px;
          min-width: 320px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .alumni-card:hover {
          transform: translateY(-12px);
          border-color: var(--accent-color);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        /* Image Wrapper */
        .alumni-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
          background: var(--bg-color);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alumni-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          background: var(--bg-color);
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .alumni-card:hover .alumni-card-image {
          transform: scale(1.05);
        }

        /* Image Overlay */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
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
          padding: 0.65rem 1rem;
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
          top: 1rem;
          right: 1rem;
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
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
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
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .alumni-degree {
          font-size: 11px;
          color: var(--accent-color);
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          opacity: 0.85;
        }

        .alumni-position {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
          flex: 1;
          margin: 0.5rem 0 0.75rem 0;
          font-family: 'Poppins', sans-serif;
        }

        .alumni-position strong {
          color: #0F172A;
          font-weight: 600;
        }

        /* Stats */
        .alumni-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          padding: clamp(2rem, 4vw, 3rem);
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          margin: 3rem auto;
          max-width: 1000px;
          width: calc(100% - 4rem);
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 800;
          color: #3B82F6;
          margin-bottom: 0.5rem;
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
        @media (max-width: 640px) {
          .notable-alumni-section {
            padding: 2.5rem 0;
          }

          .alumni-header {
            padding: 0 1rem;
            margin-bottom: 2.5rem;
          }

          .alumni-scroll-container {
            gap: 1rem;
            padding: 1rem;
          }

          .alumni-card {
            width: 280px;
            min-width: 280px;
            height: auto;
          }

          .alumni-image-wrapper {
            height: 240px;
          }

          .alumni-content {
            padding: 1.25rem;
            gap: 0.625rem;
          }

          .alumni-name {
            font-size: 18px;
          }

          .alumni-stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1.5rem;
            margin: 2rem 1rem;
            width: auto;
          }

          .stat-number {
            font-size: 32px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .alumni-scroll-container {
            gap: 1.5rem;
          }

          .alumni-card {
            width: 300px;
            min-width: 300px;
          }

          .alumni-stats {
            grid-template-columns: repeat(2, 1fr);
            padding: 2.5rem;
            margin: 2.5rem 1rem;
            width: auto;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .alumni-scroll-container {
            animation: none;
          }

          .alumni-card:hover {
            transform: none;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .notable-alumni-section {
            background: linear-gradient(135deg, #1A1F35 0%, #0F1420 50%, #162A4C 100%);
            border-top-color: #374151;
          }

          .alumni-title {
            color: #FFFFFF;
          }

          .alumni-subtitle {
            color: #CBD5E1;
          }

          .alumni-card {
            background: #1F2937;
            border-color: #374151;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .alumni-name {
            color: #FFFFFF;
          }

          .alumni-position {
            color: #D1D5DB;
          }

          .alumni-position strong {
            color: #FFFFFF;
          }

          .alumni-content {
            background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
          }

          .alumni-stats {
            background: linear-gradient(135deg, #1A1F35 0%, #111827 100%);
            border-color: #374151;
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
          <div className="alumni-badge">{sectionContent.badge}</div>
          <h2 className="alumni-title">{sectionContent.title}</h2>
          <p className="alumni-subtitle">{sectionContent.description}</p>
        </div>

        {/* Horizontal Scrolling Section */}
        <div className="alumni-scroll-wrapper">
          <div className="alumni-scroll-container">
            {alumni.concat(alumni).map((person, index) => {
              const iconByCategory = {
                healthcare: Award,
                business: Briefcase,
                research: Zap,
                politics: Star,
                education: Users,
                sports: Briefcase,
              };
              const IconComponent =
                person.icon || iconByCategory[person.category] || Users;
              const imageUrl = imageErrors[person.id]
                ? getFallbackImage(person.id)
                : getSiteImageUrl(person.image);

              return (
                <div
                  key={`${person.id}-${index}`}
                  className="alumni-card"
                  style={{
                    "--accent-color": person.color,
                    "--accent-darker": person.borderColor,
                    "--bg-color": person.bgColor,
                  }}
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
                      <div style={{ color: "var(--accent-color)" }}>
                        No Image
                      </div>
                    )}
                    <div className="image-overlay">
                      <div className="achievement-badge">
                        {person.achievement}
                      </div>
                    </div>
                    <div className="icon-badge">
                      <IconComponent size={24} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="alumni-content">
                    {person.batch && (
                      <div className="alumni-meta">{person.batch}</div>
                    )}
                    <h3 className="alumni-name">{person.name}</h3>
                    {person.degree && (
                      <p className="alumni-degree">{person.degree}</p>
                    )}
                    <p className="alumni-position">
                      <strong>{person.title}</strong>
                      <br />
                      {person.company}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="alumni-stats">
          {sectionContent.stats?.map((stat, index) => (
            <div className="stat-item" key={`${stat.label}-${index}`}>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default NotableAlumni;