import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Patrons } from "../content/data/PatronsData";

const LeadershipPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});

  // Organize patrons by role/category for role-wise UI sections
  const chiefPatron = Patrons.find(
    (p) => p.rank === "Chief Patron" || p.role === "Managing Trustee",
  );

  const roleGroupsConfig = [
    { title: "Patrons", roles: ["Secretary", "Principal"], rank: "Patron" },
    {
      title: "Office Bearers",
      roles: [
        "President",
        "Vice President",
        "Joint Secretary",
        "Treasurer",
        "Auditor",
        "Co-ordinator",
      ],
      rank: "Office Bearer"
    },
    {
      title: "Executive Committee Members",
      roles: ["EC Member", "Executive Committee Member"],
      rank: "Executive Committee Members"
    },
    {
      title: "Past Presidents",
      roles: [
        "Founder President",
        "Past President",
        "Immediate Past President",
      ],
      rank: "Past Presidents"
    },
  ];

  const groupedPatrons = roleGroupsConfig.map((group) => ({
    ...group,
    members: Patrons.filter((p) => group.rank.includes(p.rank)),
  }));

  // const otherMembers = Patrons.filter(
  //   (p) => !roleGroupsConfig.some((group) => group.rank.includes(p.rank)),
  // );

  // if (otherMembers.length) {
  //   groupedPatrons.push({
  //     title: "Other Leadership",
  //     roles: [],
  //     members: otherMembers,
  //   });
  // }

  // Animation for counting stats
  useEffect(() => {
    const stats = [
      { key: "members", target: 27 },
      { key: "commitment", target: 100 },
      { key: "alumni", target: 10 },
      { key: "rank", target: 1 },
    ];

    stats.forEach((stat) => {
      let current = 0;
      const increment = stat.target / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          setAnimatedStats((prev) => ({ ...prev, [stat.key]: stat.target }));
          clearInterval(interval);
        } else {
          setAnimatedStats((prev) => ({
            ...prev,
            [stat.key]: Math.floor(current),
          }));
        }
      }, 50);
      return () => clearInterval(interval);
    });
  }, []);

  // Advanced animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -16,
      scale: 1.03,
      transition: { duration: 0.4, ease: "easeOut" },
      boxShadow: "0 30px 80px rgba(59, 130, 246, 0.15)",
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, linear: true },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .leadership-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          background: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          color: #0F172A;
          padding: 100px 24px;
          overflow: hidden;
          border-bottom: 1px solid #E2E8F0;
        }

        @media (min-width: 768px) {
          .hero-section {
            padding: 140px 24px;
          }
        }

        .hero-section::before,
        .hero-section::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.06;
        }

        .hero-section::before {
          top: 0;
          right: 0;
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
        }

        .hero-section::after {
          bottom: -200px;
          left: 0;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #06B6D4, #8B5CF6);
        }

        .hero-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-label {
          display: inline-block;
          padding: 12px 24px;
          background: #F0F9FF;
          border: 1px solid #BFDBFE;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          color: #3B82F6;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 24px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          line-height: 1.2;
          font-weight: 900;
          margin-bottom: 24px;
          color: #0F172A;
          letter-spacing: -1px;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 64px;
          }
        }

        .hero-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #64748B;
          max-width: 600px;
          margin: 0 auto 32px;
        }

        .hero-divider {
          height: 3px;
          width: 100px;
          margin: 0 auto;
          background: linear-gradient(90deg, #3B82F6, #06B6D4);
          border-radius: 2px;
        }

        /* Chief Patron Section */
        .chief-section {
          padding: 100px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .chief-section {
            padding: 140px 24px;
          }
        }

        .section-label {
          text-align: center;
          color: #64748B;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 16px;
          font-family: 'Poppins', sans-serif;
        }

        .leadership-title {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          line-height: 1.2;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 80px;
          letter-spacing: -1px;
        }

        @media (min-width: 768px) {
          .leadership-title {
            font-size: 56px;
          }
        }

        .chief-content {
          display: flex;
          flex-direction: column;
          gap: 80px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .chief-content {
            flex-direction: row;
            gap: 80px;
            align-items: flex-start;
          }
        }

        .chief-image-wrapper {
          flex-shrink: 0;
          width: 100%;
        }

        @media (min-width: 768px) {
          .chief-image-wrapper {
            width: 380px;
            min-width: 380px;
          }
        }

        .chief-image {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
          background: #F0F9FF;
          border: 1.5px solid #E2E8F0;
        }

        .chief-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .chief-image:hover img {
          transform: scale(1.12);
        }

        .chief-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(59, 130, 246, 0.2), transparent);
          transition: background 500ms ease-out;
        }

        .chief-image:hover .chief-overlay {
          background: linear-gradient(to top, rgba(59, 130, 246, 0.4), transparent);
        }

        .chief-text {
          flex: 1;
        }

        .chief-badge {
          display: inline-block;
          padding: 10px 20px;
          background: #F0F9FF;
          color: #3B82F6;
          border: 1.5px solid #BFDBFE;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 24px;
          font-family: 'Poppins', sans-serif;
        }

        .chief-name {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 12px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        @media (min-width: 768px) {
          .chief-name {
            font-size: 48px;
          }
        }

        .chief-role {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          color: #3B82F6;
          font-weight: 700;
          margin-bottom: 28px;
          letter-spacing: -0.3px;
        }

        .chief-bio {
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          color: #64748B;
          line-height: 1.8;
          margin-bottom: 28px;
        }

        /* Leadership Grid Section */
        .leadership-section {
          padding: 100px 24px;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
        }

        .role-group-wrapper {
          margin-top: 64px;
        }

        .section-heading {
          margin-bottom: 24px;
          text-align: center;
        }

        .section-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin: 8px 0 0;
        }

        @media (min-width: 768px) {
          .leadership-section {
            padding: 140px 24px;
          }
        }

        .leadership-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .tabs-wrapper {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 80px;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 12px 28px;
          border: 2px solid #E2E8F0;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          background: #FFFFFF;
          color: #64748B;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .tab-button:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          border-color: transparent;
          color: white;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 36px;
        }

        @media (min-width: 768px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .card {
          position: relative;
          background: #FFFFFF;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1.5px solid #E2E8F0;
        }

        .card:hover {
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.15);
          transform: translateY(-12px);
          border-color: #3B82F6;
        }

        .card-image {
          position: relative;
          height: 280px;
          overflow: hidden;
          background: linear-gradient(135deg, #F0F9FF, #FFFFFF);
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card:hover .card-image img {
          transform: scale(1.12) rotate(1deg);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(59, 130, 246, 0.3), transparent);
          opacity: 0;
          transition: opacity 400ms;
        }

        .card:hover .card-overlay {
          opacity: 1;
        }

        .card-role-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          color: white;
          padding: 8px 14px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(-12px) scale(0.8);
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
        }

        .card:hover .card-role-tag {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .card-content {
          padding: 28px;
        }

        .card-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.3px;
        }

        .card-position {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          color: #3B82F6;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .card-bio {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-accent {
          padding-top: 16px;
          border-top: 1px solid #E2E8F0;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6, #0EA5E9, #06B6D4);
          border-radius: 2px;
          transform: scaleX(0.3);
          transform-origin: left;
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card:hover .card-accent {
          transform: scaleX(1);
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 24px;
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 50%, #06B6D4 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .cta-section {
            padding: 140px 24px;
          }
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .cta-container {
          max-width: 896px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: 40px;
          font-weight: 900;
          margin-bottom: 24px;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        @media (min-width: 768px) {
          .cta-title {
            font-size: 56px;
          }
        }

        .cta-text {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .btn {
          padding: 14px 32px;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-primary {
          background: #FFFFFF;
          color: #3B82F6;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          transform: translateY(-4px);
        }

        /* Stats Section */
        .stats-section {
          padding: 100px 24px;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          border-top: 1px solid #E2E8F0;
        }

        .stats-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 40px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat {
          padding: 40px 24px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 900;
          color: #3B82F6;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="leadership-wrapper">
        <motion.div variants={pageVariants} initial="hidden" animate="visible">
          {/* Hero Section */}
          <section className="hero-section">
            <motion.div
              className="hero-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="hero-label">
                Leadership Excellence
              </motion.div>

              <motion.h1 variants={itemVariants} className="hero-title">
                Meet Our Team
              </motion.h1>

              <motion.p variants={itemVariants} className="hero-subtitle">
                Visionary leaders and mentors dedicated to institutional
                excellence and student success
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="hero-divider"
              ></motion.div>
            </motion.div>
          </section>

          {/* Chief Patron Section */}
          {chiefPatron && (
            <section className="chief-section">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="section-label">Institutional Leadership</p>
                <h2 className="leadership-title">Chief Patron</h2>

                <div className="chief-content">
                  <motion.div
                    className="chief-image-wrapper"
                    variants={itemVariants}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="chief-image"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img src={chiefPatron.image} alt={chiefPatron.name} />
                      <div className="chief-overlay"></div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="chief-text"
                    variants={containerVariants}
                  >
                    <motion.div variants={itemVariants} className="chief-badge">
                      Managing Trustee
                    </motion.div>

                    <motion.h3 variants={itemVariants} className="chief-name">
                      {chiefPatron.name}
                    </motion.h3>

                    <motion.p variants={itemVariants} className="chief-role">
                      {chiefPatron.role}
                    </motion.p>

                    <motion.p variants={itemVariants} className="chief-bio">
                      {chiefPatron.bio ||
                        "Dedicated leader committed to institutional excellence and student success."}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </section>
          )}

          {/* Leadership Grid Section */}
          <section className="leadership-section">
            <div className="leadership-container">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <p className="section-label">Our Team</p>
                <h2 className="leadership-title">Leadership Team</h2>
              </motion.div>
              {groupedPatrons.map((group, groupIndex) => (
                <div key={group.title} className="role-group-wrapper">
                  <motion.div
                    className="section-heading"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <h3 className="section-subtitle">{`${group.title} (${group.members.length})`}</h3>
                  </motion.div>
                  <motion.div
                    className="cards-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {group.members.map((patron, index) => (
                      <motion.div
                        key={`${patron.name}-${groupIndex}-${index}`}
                        variants={cardVariants}
                        whileHover="hover"
                        onMouseEnter={() =>
                          setHoveredCard(
                            `${patron.name}-${groupIndex}-${index}`,
                          )
                        }
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="card">
                          <div className="card-image">
                            <img src={patron.image} alt={patron.name} />
                            <div className="card-overlay"></div>
                            <motion.div
                              className="card-role-tag"
                              initial={{ opacity: 0, y: -10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {patron.role}
                            </motion.div>
                          </div>
                          <div className="card-content">
                            <h3 className="card-name">{patron.name}</h3>
                            <p className="card-position">{patron.role}</p>
                            <p className="card-bio">
                              {patron.note || patron.bio}
                            </p>
                            <div className="card-accent"></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <motion.div
              className="cta-container"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 variants={itemVariants} className="cta-title">
                Join Our Community
              </motion.h2>

              <motion.p variants={itemVariants} className="cta-text">
                Connect with our leadership team and become part of a thriving
                community dedicated to excellence.
              </motion.p>

              <motion.div className="cta-buttons" variants={itemVariants}>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In Touch
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-container">
              <motion.div
                className="stats-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {[
                  { number: "27+", label: "Team Members", key: "members" },
                  { number: "100%", label: "Commitment", key: "commitment" },
                  { number: "10K+", label: "Alumni Network", key: "alumni" },
                  { number: "#1", label: "Institution", key: "rank" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="stat"
                    whileInView={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.p
                      className="stat-number"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, delay: index * 0.1 }}
                    >
                      {stat.number}
                    </motion.p>
                    <p className="stat-label">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </>
  );
};

export default LeadershipPage;
