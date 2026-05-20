// src/Components/Homepage.jsx
// ✅ FIXED - Properly imports and uses FindAlumni

import React from "react";
import BannerInnovative from "./Banner";
import FindAlumni from "../pages/FindAlumni";
import NotableAlumni from "../sections/Notablealumni";
import Events from "../sections/Events";
import Contact from "../sections/Contact";
import WhatIsNew from "../sections/Whatisnew";
import Stats from "../sections/Stats";
import WelcomeSection from "../sections/Welcomesection";
import usePageTitle from "../hooks/usePageTitle";

const HomePageInnovative = () => {
  usePageTitle("Offical Community Portal for PSG Arts Alumni");
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8f9fb;
          color: #333;
          scroll-behavior: smooth;
        }

        /* Page Wrapper */
        .page-wrapper {
          background: linear-gradient(180deg, #f8f9fb 0%, #ffffff 15%, #f8f9fb 100%);
          min-height: 100vh;
        }

        /* Find Alumni Section */
        .find-alumni-section {
          padding: 0;
          background: transparent;
        }

        /* Welcome Section */
        .welcome-section {
          padding: 80px 30px;
          text-align: left;
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-heading {
          font-size: 42px;
          font-weight: 800;
          color: #1e3c72;
          margin-bottom: 60px;
          position: relative;
          display: inline-block;
          letter-spacing: -1px;
        }

        .welcome-heading::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 0;
          width: 80px;
          height: 5px;
          background: linear-gradient(90deg, #2a5298, #7e57c2);
          border-radius: 3px;
        }

        .welcome-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px;
          align-items: center;
          margin-top: 40px;
        }

        .welcome-card {
          background: white;
          border-radius: 16px;
          padding: 40px 35px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .welcome-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #2a5298, #7e57c2);
        }

        .welcome-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(42, 82, 152, 0.15);
        }

        .welcome-card img {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 24px;
          border: 5px solid #2a5298;
          transition: all 0.3s ease;
        }

        .welcome-card:hover img {
          border-color: #7e57c2;
          transform: scale(1.05);
        }

        .welcome-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 10px;
        }

        .welcome-card p {
          font-size: 15px;
          color: #7e7e7e;
          line-height: 1.6;
        }

        /* Divider Section */
        .divider-section {
          height: 80px;
          background: linear-gradient(90deg, transparent, rgba(42, 82, 152, 0.1), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .divider-line {
          width: 100%;
          max-width: 1400px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #2a5298, transparent);
        }

        /* Section Spacing */
        .section-spacer {
          height: 40px;
        }

        /* Responsive Design */
        @media(max-width: 768px) {
          .welcome-section {
            padding: 60px 20px;
          }

          .welcome-heading {
            font-size: 32px;
            margin-bottom: 40px;
          }

          .welcome-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .welcome-card {
            padding: 30px 20px;
          }

          .divider-section {
            height: 60px;
          }
        }

        @media(max-width: 480px) {
          .welcome-section {
            padding: 40px 16px;
          }

          .welcome-heading {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="page-wrapper">
        {/* Banner Section - Hero with Auth */}
        <BannerInnovative />

        {/* Welcome Section */}
        <WelcomeSection />

        {/* Divider */}
        <div className="divider-section">
          <div className="divider-line"></div>
        </div>

        {/* Stats Section */}
        <Stats />

        {/* Find Alumni Section - NOW WORKING */}
        <section className="find-alumni-section">
          <FindAlumni />
        </section>

        {/* Divider */}
        <div className="divider-section">
          <div className="divider-line"></div>
        </div>

        {/* Notable Alumni Section */}
        <NotableAlumni />

        {/* What's New Section */}
        <WhatIsNew />

        {/* Events Section */}
        <Events />

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
};

export default HomePageInnovative;