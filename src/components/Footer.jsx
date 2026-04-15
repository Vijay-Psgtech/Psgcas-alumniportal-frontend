import React from "react";
import { Mail, Linkedin, Twitter, Instagram, ArrowRight, Heart } from "lucide-react";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Explore",
      links: [
        { name: "Find Alumni", href: "/find-alumni" },
        { name: "Events", href: "/events" },
        { name: "News & Updates", href: "/news" },
        { name: "Reunions", href: "/reunions" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Join Community", href: "/join" },
        { name: "Contribute", href: "/contribute" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Job Board", href: "/jobs" },
        { name: "Mentorship", href: "/mentorship" },
        { name: "Publications", href: "/publications" },
        { name: "Directory", href: "/directory" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

        .modern-footer {
          background: linear-gradient(180deg, #0f1729 0%, #1a2847 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        /* Animated background elements */
        .footer-bg {
          position: absolute;
          top: 0;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(200, 62, 125, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-40px) translateX(-40px); }
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 50px 40px;
          position: relative;
          z-index: 2;
        }

        /* Main grid */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 18px;
          text-decoration: none;
          color: white;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .footer-description {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.6;
          max-width: 280px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .social-btn:hover {
          background: linear-gradient(135deg, #1e3c72, #c83e7d);
          border-color: rgba(200, 62, 125, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(200, 62, 125, 0.3);
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          position: relative;
          padding-bottom: 12px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, #1e3c72, #c83e7d);
        }

        .section-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #1e3c72, #c83e7d);
          transition: width 0.3s ease;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .footer-link:hover {
          color: white;
          padding-left: 6px;
        }

        /* Newsletter */
        .newsletter-section {
          background: linear-gradient(135deg, rgba(30, 60, 114, 0.2), rgba(200, 62, 125, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 60px;
          backdrop-filter: blur(10px);
        }

        .newsletter-title {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .newsletter-desc {
          font-size: 13px;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: white;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(200, 62, 125, 0.5);
          box-shadow: 0 0 0 2px rgba(200, 62, 125, 0.1);
        }

        .newsletter-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .newsletter-btn:hover {
          background: linear-gradient(135deg, #2a5298, #c83e7d);
          transform: translateY(-2px);
        }

        /* Divider */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin-bottom: 40px;
        }

        /* Bottom section */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 12px;
          opacity: 0.6;
        }

        .footer-copyright {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .footer-links-bottom {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .footer-link-bottom {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link-bottom:hover {
          color: white;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .footer-content {
            padding: 60px 30px 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .newsletter-section {
            padding: 30px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-links-bottom {
            justify-content: center;
          }

          .footer-content {
            padding: 40px 20px 30px;
          }
        }
      `}</style>

      <footer className="modern-footer">
        <div className="footer-bg"></div>

        <div className="footer-content">
          {/* Newsletter */}
          <div className="newsletter-section">
            <h3 className="newsletter-title">Stay Updated</h3>
            <p className="newsletter-desc">Get the latest news, events, and opportunities from PSG Arts Alumni community</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email..."
                required
              />
              <button className="newsletter-btn">
                <ArrowRight size={16} />
                Subscribe
              </button>
            </form>
          </div>

          {/* Main Grid */}
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <div className="logo-icon">✨</div>
                <span>PSG Arts Alumni</span>
              </a>
              <p className="footer-description">
                Connecting global alumni through community, mentorship, and exclusive opportunities for lifelong growth and success.
              </p>
              <div className="footer-social">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      className="social-btn"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, idx) => (
              <div key={idx} className="footer-section">
                <h4 className="section-title">{section.title}</h4>
                <div className="section-links">
                  {section.links.map((link, lidx) => (
                    <a
                      key={lidx}
                      href={link.href}
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>&copy; {currentYear} Powered by Central IT Services</span>
              <Heart size={14} style={{ color: "#c83e7d" }} />
              <span>PSG Institutions</span>
            </div>
            <div className="footer-links-bottom">
              <a href="#" className="footer-link-bottom">Privacy Policy</a>
              <a href="#" className="footer-link-bottom">Terms of Service</a>
              <a href="#" className="footer-link-bottom">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ModernFooter;