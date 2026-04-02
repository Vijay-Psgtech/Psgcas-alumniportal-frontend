import React, { useState, useEffect } from "react";
import { ArrowRight, Zap, Users, Globe, Sparkles } from "lucide-react";
import AuthCard from "../sections/Authcard.jsx";
import LoginCard from "../sections/Logincard.jsx";
import BgImage from ".././assets/Banner/B1.webp"

const EpicBanner = () => {
  const [authMode, setAuthMode] = useState(null);
  const [offsetY, setOffsetY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    { icon: Users, text: "12K+ Alumni Connected", delay: 0 },
    { icon: Globe, text: "35+ Countries", delay: 0.1 },
    { icon: Sparkles, text: "200+ Annual Events", delay: 0.2 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .epic-banner {
          position: relative;
          min-height: 120vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: 60px;
        }

        /* Animated background layers */
        .banner-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 1;
        }

        /* Dark overlay for better text readability */
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 60, 114, 0.6) 50%, rgba(42, 82, 152, 0.5) 100%);
          z-index: 2;
        }

        /* Dynamic gradient orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          mix-blend-mode: screen;
          z-index: 1;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #c83e7d 0%, transparent 70%);
          top: -150px;
          left: -150px;
          animation: orb-move-1 15s ease-in-out infinite;
        }

        .orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #1e3c72 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          animation: orb-move-2 18s ease-in-out infinite;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #2a9d8f 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation: orb-move-3 20s ease-in-out infinite;
          transform: translate(-50%, -50%);
        }

        @keyframes orb-move-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, 50px); }
        }

        @keyframes orb-move-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-60px, -60px); }
        }

        @keyframes orb-move-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Grid background */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(0deg, rgba(42, 82, 152, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42, 82, 152, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
          opacity: 0.3;
          z-index: 1;
        }

        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        /* Particles */
        .particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% { 
            opacity: 0;
            transform: translateY(100vh) translateX(0);
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            opacity: 0;
            transform: translateY(-100vh) translateX(var(--tx));
          }
        }

        .content {
          position: relative;
          z-index: 3;
          max-width: 1400px;
          width: 100%;
          padding: 0 50px;
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 100px;
          align-items: center;
        }

        .banner-left {
          color: white;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .banner-subtitle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(200, 62, 125, 0.15);
          border: 1px solid rgba(200, 62, 125, 0.3);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          color: #ff6b9d;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .banner-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(48px, 6vw, 84px);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .banner-description {
          font-size: 18px;
          opacity: 0.85;
          max-width: 500px;
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 48px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 0;
          animation: fadeInUp 1s ease-out backwards;
          opacity: 1;
        }

        .feature-item:nth-child(1) { animation-delay: 0.2s; }
        .feature-item:nth-child(2) { animation-delay: 0.4s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }

        .feature-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(200, 62, 125, 0.2);
          border-radius: 10px;
          color: #ff6b9d;
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 14px;
          font-weight: 600;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 16px 40px;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          color: white;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 24px rgba(30, 60, 114, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2a5298, #c83e7d);
          transition: left 0.4s ease;
          z-index: -1;
        }

        .btn-primary:hover::before {
          left: 0;
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(30, 60, 114, 0.5);
        }

        .btn-secondary {
          padding: 16px 32px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(12px);
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s ease;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px);
        }

        /* Auth card container */
        .banner-right {
          position: relative;
          animation: fadeIn 1s ease-out 0.3s backwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .auth-glass {
          position: relative;
          border-radius: 24px;
          padding: 3px;
          background: linear-gradient(135deg, rgba(200, 62, 125, 0.3), rgba(42, 82, 152, 0.3));
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          animation: glow-pulse 4s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 8px 32px rgba(200, 62, 125, 0.2), 
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 20px 50px rgba(200, 62, 125, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }

        .auth-inner {
          border-radius: 22px;
          padding: 28px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 1024px) {
          .content {
            grid-template-columns: 1fr;
            gap: 60px;
            padding: 0 30px;
          }

          .banner-title {
            font-size: 48px;
          }

          .banner-left {
            text-align: center;
          }

          .features-list {
            margin: 0 auto;
          }

          .cta-buttons {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .epic-banner {
            min-height: 100vh;
            margin-top: 50px;
          }

          .content {
            padding: 0 20px;
          }

          .banner-title {
            font-size: 36px;
          }

          .banner-description {
            font-size: 16px;
          }

          .orb-1, .orb-2, .orb-3 {
            filter: blur(80px);
            opacity: 0.3;
          }

          .banner-overlay {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 60, 114, 0.75) 50%, rgba(42, 82, 152, 0.7) 100%);
          }
        }
      `}</style>

      <div className="epic-banner">
        {/* Background Image */}
        <div 
          className="banner-bg"
          style={{
            backgroundImage: `url(${BgImage})`
          }}
        />
        
        {/* Dark Overlay for better readability */}
        <div className="banner-overlay" />
        
        {/* Animated Elements */}
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: Math.random() * 100 + "%",
                "--tx": (Math.random() - 0.5) * 200 + "px",
                animationDuration: (3 + Math.random() * 4) + "s",
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="content">
          <div className="banner-left">
            <div className="banner-subtitle">
              <Sparkles size={14} />
              Welcome to Excellence
            </div>

            <h1 className="banner-title">
              Connect, Grow & Lead Together
            </h1>

            <p className="banner-description">
              Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.
            </p>

            <div className="features-list">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="feature-item">
                    <div className="feature-icon">
                      <Icon size={18} />
                    </div>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => setAuthMode("signup")}
              >
                <Zap size={18} />
                Join Now
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>

          {/* <div className="banner-right">
            <div className="auth-glass">
              <div className="auth-inner">
                {authMode === "login" ? (
                  <LoginCard onSwitchToSignup={() => setAuthMode("signup")} />
                ) : authMode === "signup" ? (
                  <AuthCard onSwitchToLogin={() => setAuthMode("login")} />
                ) : (
                  <div style={{ textAlign: "center", color: "#fff" }}>
                    <div style={{ fontSize: "32px", marginBottom: "16px" }}>✨</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
                      Welcome to PSG Arts
                    </h3>
                    <p style={{ fontSize: "13px", opacity: "0.7", marginBottom: "24px" }}>
                      Sign in or create an account to unlock exclusive alumni benefits
                    </p>
                    <button
                      onClick={() => setAuthMode("login")}
                      style={{
                        padding: "10px 20px",
                        background: "linear-gradient(135deg, #c83e7d, #ff6b9d)",
                        border: "none",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "12px",
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default EpicBanner;