import React, { useState } from "react";
import { Award, Briefcase, Zap, Star, Users, Image as ImageIcon } from "lucide-react";

const NotableAlumni = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const alumni = [
    {
      id: 1,
      name: "Dr. Nalla G Palaniswami",
      batch: "PUC",
      degree: "",
      title: "Chairman",
      company: "Kovai Medical Centre & Hospital Ltd.",
      category: "healthcare",
      icon: Award,
      achievement: "Healthcare Leader",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 2,
      name: "Shri V Gopalakrishnan",
      batch: "",
      degree: "",
      title: "Managing Director",
      company: "Sri Ramakrishna Oxygen Ltd.",
      category: "business",
      icon: Briefcase,
      achievement: "Business Innovation",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 3,
      name: "Dr. M Ramaswamy",
      batch: "PUC",
      degree: "",
      title: "Hon. Medical Director",
      company: "Masonic Medical Centre",
      category: "healthcare",
      icon: Award,
      achievement: "Medical Excellence",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 4,
      name: "Dr. V Venkitaswamy Raju",
      batch: "",
      degree: "",
      title: "Director",
      company: "Centre for Advanced Manufacturing",
      category: "research",
      icon: Zap,
      achievement: "Research Pioneer",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 5,
      name: "Shri Mohan P. Kandaswamy",
      batch: "",
      degree: "MLA",
      title: "MLA",
      company: "Political Leader",
      category: "politics",
      icon: Star,
      achievement: "Political Leadership",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 6,
      name: "Shri C Muthukumaraswamy",
      batch: "",
      degree: "IAS",
      title: "Secretary",
      company: "State Election Commission",
      category: "politics",
      icon: Star,
      achievement: "Admin Excellence",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 7,
      name: "Thiru MP Vijayakumar",
      batch: "",
      degree: "IAS",
      title: "Addl. Secretary to Govt.",
      company: "School Education Dept.",
      category: "politics",
      icon: Star,
      achievement: "Education Advocate",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 8,
      name: "Shri Kavidasan",
      batch: "",
      degree: "",
      title: "AGM - Corporate HRD",
      company: "Roots Industries Limited",
      category: "business",
      icon: Briefcase,
      achievement: "HR Leadership",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 9,
      name: "Mr Mahendra Ramadas",
      batch: "1974-1975 PUC",
      degree: "B.Sc Physics",
      title: "Managing Director",
      company: "Mahendra Pumps Pvt Ltd",
      category: "business",
      icon: Briefcase,
      achievement: "Industrial Leader",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 10,
      name: "Dr. G Bakthavathsalam",
      batch: "PUC",
      degree: "",
      title: "Chairman",
      company: "KG Hospitals",
      category: "healthcare",
      icon: Award,
      achievement: "Healthcare Pioneer",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 11,
      name: "Dr. Natesan Jambulingam",
      batch: "",
      degree: "",
      title: "Senior Reliability Engineer",
      company: "NASA Kennedy Space Centre",
      category: "research",
      icon: Zap,
      achievement: "Space Technology",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 12,
      name: "Dr. K Rathnam",
      batch: "",
      degree: "",
      title: "Senior Manager QA",
      company: "Heinz India Limited",
      category: "business",
      icon: Briefcase,
      achievement: "Quality Expert",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 13,
      name: "Mr M Krishnan",
      batch: "1971-1974 B.COM",
      degree: "",
      title: "Managing Director",
      company: "Krishna Sweets",
      category: "business",
      icon: Briefcase,
      achievement: "Business Founder",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 14,
      name: "Dr. K Ramachandran",
      batch: "",
      degree: "",
      title: "Additional Director",
      company: "DIPR Defence R&D",
      category: "research",
      icon: Zap,
      achievement: "Defence Research",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 15,
      name: "Mr C Muthukaraswamy",
      batch: "",
      degree: "IAS",
      title: "Secretary to Govt.",
      company: "Animal Husbandry Dept.",
      category: "politics",
      icon: Star,
      achievement: "Bureaucratic Reforms",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 16,
      name: "Mr Mayura S Jayakumar",
      batch: "1992-1995 BBM",
      degree: "MLA-CONGRESS",
      title: "Managing Director",
      company: "Mayura Radios",
      category: "business",
      icon: Briefcase,
      achievement: "Business Excellence",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 17,
      name: "Mr V Lakshminarayanasamy",
      batch: "1972-1976",
      degree: "B.COM",
      title: "Managing Trustee",
      company: "Suguna Group",
      category: "education",
      icon: Users,
      achievement: "Educational Trust",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FEE2A5",
    },
    {
      id: 18,
      name: "Mr P. Rajkumar",
      batch: "1983-1988 BA/MA",
      degree: "",
      title: "Worshipful Mayor",
      company: "Coimbatore Corporation",
      category: "politics",
      icon: Star,
      achievement: "Civic Leader",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 19,
      name: "Mr C.K. Kumaravel",
      batch: "1984-1987",
      degree: "B.Sc Nutrition",
      title: "Managing Director",
      company: "Naturals Salon & Spa",
      category: "business",
      icon: Briefcase,
      achievement: "Beauty Industry",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 20,
      name: "Mr M. Ponnuswami",
      batch: "1971-1974",
      degree: "B.Sc Chemistry",
      title: "Chairman & MD",
      company: "Pon Pure Chemicals",
      category: "business",
      icon: Briefcase,
      achievement: "Chemical Industry",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 21,
      name: "Mr Ravi Sam",
      batch: "1974-1977",
      degree: "B.Com",
      title: "Managing Director",
      company: "Adwaith Lakshmi Industries",
      category: "business",
      icon: Briefcase,
      achievement: "Industrial Pioneer",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 22,
      name: "Mr B. Prabhakaran",
      batch: "1990-1993",
      degree: "B.Sc CS",
      title: "Managing Director",
      company: "Thriveni Earth Movers",
      category: "business",
      icon: Briefcase,
      achievement: "Construction Tech",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 23,
      name: "Dr. Jairam Varadaraj",
      batch: "1977-1980",
      degree: "B.Com",
      title: "Chairman & MD",
      company: "Elgi Equipments Ltd",
      category: "business",
      icon: Briefcase,
      achievement: "Manufacturing Leader",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#A7F3D0",
    },
    {
      id: 24,
      name: "Sri P. Kumaravel Pandian",
      batch: "1990-1993",
      degree: "B.Sc Physics",
      title: "Commissioner IAS",
      company: "Coimbatore City Corp",
      category: "politics",
      icon: Star,
      achievement: "Urban Admin",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 25,
      name: "Mrs Vanathi Srinivasan",
      batch: "1987-1990",
      degree: "B.Sc Chemistry",
      title: "National President",
      company: "BJP Women's Wing",
      category: "politics",
      icon: Star,
      achievement: "Political Leader",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 26,
      name: "Dr. K. Anand Kumar",
      batch: "1983-1988",
      degree: "B.Sc/M.Sc",
      title: "Managing Director",
      company: "Indian Immunological",
      category: "healthcare",
      icon: Award,
      achievement: "Pharma Innovation",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 27,
      name: "Mr M.P. Swaminathan",
      batch: "1983-1986",
      degree: "B.A Sociology",
      title: "Minister",
      company: "Development Dept.",
      category: "politics",
      icon: Star,
      achievement: "Policy Maker",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 28,
      name: "Dr. P. Alli Rani",
      batch: "1980-1982",
      degree: "M.A Economics",
      title: "Director",
      company: "Textiles School",
      category: "education",
      icon: Users,
      achievement: "Textile Education",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FEE2A5",
    },
    {
      id: 29,
      name: "Dr. K. Kadirvelu",
      batch: "1986-1991",
      degree: "B.Sc/M.Sc",
      title: "Scientist 'F' DRDO",
      company: "DRDO Defence Org",
      category: "research",
      icon: Zap,
      achievement: "Defence Tech",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 30,
      name: "Dr. L. Balaji Saravanan",
      batch: "1991-1994",
      degree: "B.Sc Maths",
      title: "Superintendent of Police",
      company: "Thoothukudi District",
      category: "politics",
      icon: Star,
      achievement: "Law Enforcement",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 31,
      name: "Mr Anbalagan Ponnusamy",
      batch: "1996-2001",
      degree: "B.Sc/M.Sc",
      title: "Secretary IAS",
      company: "Chhattisgarh Govt",
      category: "politics",
      icon: Star,
      achievement: "State Admin",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 32,
      name: "Dr. Gowrisankar Rajam",
      batch: "1980-1985",
      degree: "B.Sc/M.Sc",
      title: "Principal Scientist",
      company: "Merck & Co USA",
      category: "research",
      icon: Zap,
      achievement: "Pharma Research",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 33,
      name: "Dr. Venkatraman Sriram",
      batch: "1990-1992",
      degree: "M.Sc Biochemistry",
      title: "Founder & CEO",
      company: "Foundery Innovations",
      category: "research",
      icon: Zap,
      achievement: "Tech Startup",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 34,
      name: "Mr A. Myilvaganan",
      batch: "1995-1997",
      degree: "M.Sc CS",
      title: "Superintendent of Police",
      company: "Vigilance Wing",
      category: "politics",
      icon: Star,
      achievement: "Anti Corruption",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 35,
      name: "Ms D. Alarmelmangai",
      batch: "2000-2002",
      degree: "M.Com",
      title: "Labour Commissioner IAS",
      company: "Chhattisgarh Govt",
      category: "politics",
      icon: Star,
      achievement: "Labour Rights",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 36,
      name: "Mr Adam Antony Sinclair",
      batch: "2001-2004",
      degree: "BBM",
      title: "Olympian & CEO",
      company: "ZOZA Sports Academy",
      category: "sports",
      icon: Briefcase,
      achievement: "Sports Excellence",
      color: "#06B6D4",
      bgColor: "#F0FDFA",
      borderColor: "#A5F3FC",
    },
    {
      id: 37,
      name: "Mr S. Ramkumar",
      batch: "2005-2008",
      degree: "B.Sc Psychology",
      title: "Secretary IAS",
      company: "Meghalaya Health",
      category: "politics",
      icon: Star,
      achievement: "Health Admin",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 38,
      name: "Dr. Murali Kallummal",
      batch: "1987-1993",
      degree: "BA/MA/MPhil",
      title: "Professor",
      company: "Indian Inst Trade",
      category: "education",
      icon: Users,
      achievement: "Economics Expert",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FEE2A5",
    },
    {
      id: 39,
      name: "Dr. R. Rajkumar",
      batch: "1989-1996",
      degree: "B.Sc/M.Sc",
      title: "Principal Scientist",
      company: "CSIR Institute",
      category: "research",
      icon: Zap,
      achievement: "Geophysics Research",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
    {
      id: 40,
      name: "Ms M. Rani Kanchana",
      batch: "1996-2001",
      degree: "B.Sc/M.Sc",
      title: "IRS Official",
      company: "Income Tax Dept",
      category: "politics",
      icon: Star,
      achievement: "Revenue Service",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 41,
      name: "Dr. G. Senthilkumar",
      batch: "1990-1995",
      degree: "BBM/MSW",
      title: "Founder & Chairman",
      company: "Edu Value Creators",
      category: "education",
      icon: Users,
      achievement: "EdTech Pioneer",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FEE2A5",
    },
    {
      id: 42,
      name: "Mr R. Ravichandran",
      batch: "1985-1987",
      degree: "M.Sc Food",
      title: "Vice President",
      company: "Indian Immunologicals",
      category: "healthcare",
      icon: Award,
      achievement: "Medical Leadership",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 43,
      name: "Mr M. Chandrasekaran",
      batch: "1985-1991",
      degree: "BA/MA",
      title: "Superintendent of Police",
      company: "Madurai Enforcement",
      category: "politics",
      icon: Star,
      achievement: "Law & Order",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #F8FAFB;
        }

        /* Notable Alumni Section */
        .notable-alumni-section {
          padding: 4rem 0;
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
        }

        .alumni-scroll-container {
          display: flex;
          gap: 1.5rem;
          padding: 0 2rem;
          animation: scroll-left 150s linear infinite;
          width: fit-content;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 1.5rem));
          }
        }

        .alumni-scroll-wrapper:hover .alumni-scroll-container {
          animation-play-state: paused;
        }

        /* Alumni Card */
        .alumni-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 280px;
          min-width: 280px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .alumni-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }

        /* Image Placeholder Section */
        .alumni-image-placeholder {
          position: relative;
          height: 220px;
          background: linear-gradient(135deg, var(--bg-color) 0%, rgba(255,255,255,0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #E5E7EB;
        }

        .image-icon {
          color: var(--accent-color);
          opacity: 0.3;
        }

        /* Icon Badge */
        .icon-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          background: #FFFFFF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB;
          transition: all 300ms ease;
        }

        .alumni-card:hover .icon-badge {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Content Section */
        .alumni-content {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alumni-meta {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--accent-color);
          font-family: 'Poppins', sans-serif;
        }

        .alumni-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          line-height: 1.4;
          letter-spacing: -0.3px;
        }

        .alumni-degree {
          font-size: 11px;
          color: var(--accent-color);
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }

        .alumni-position {
          font-size: 12px;
          color: #6B7280;
          line-height: 1.5;
          flex: 1;
          font-family: 'Poppins', sans-serif;
        }

        .alumni-position strong {
          color: #1F2937;
          font-weight: 600;
        }

        /* Stats */
        .alumni-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 2rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          position: relative;
          z-index: 1;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
          font-size: 42px;
          font-weight: 800;
          color: #3B82F6;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-family: 'Poppins', sans-serif;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .notable-alumni-section {
            padding: 2rem 0;
          }

          .alumni-header {
            padding: 0 1rem;
            margin-bottom: 2rem;
          }

          .alumni-scroll-container {
            gap: 1rem;
            padding: 0 1rem;
          }

          .alumni-card {
            width: 260px;
            min-width: 260px;
          }

          .alumni-image-placeholder {
            height: 180px;
          }

          .alumni-stats {
            grid-template-columns: 1fr;
            padding: 2rem;
            margin: 2rem 1rem;
            width: auto;
          }

          .stat-number {
            font-size: 36px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .alumni-card {
            width: 270px;
            min-width: 270px;
          }

          .alumni-stats {
            grid-template-columns: repeat(2, 1fr);
            padding: 2.5rem;
            margin: 2.5rem 1.5rem;
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
            background: linear-gradient(135deg, #111827 0%, #0F1420 50%, #1A2E4A 100%);
            border-top-color: #374151;
          }

          .alumni-title {
            color: #F3F4F6;
          }

          .alumni-subtitle {
            color: #D1D5DB;
          }

          .alumni-card {
            background: #1F2937;
            border-color: #374151;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .alumni-card:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }

          .alumni-image-placeholder {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%);
            border-bottom-color: #374151;
          }

          .alumni-name {
            color: #F3F4F6;
          }

          .alumni-position {
            color: #D1D5DB;
          }

          .alumni-position strong {
            color: #F3F4F6;
          }

          .icon-badge {
            background: rgba(255, 255, 255, 0.05);
            border-color: #374151;
          }

          .alumni-stats {
            background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
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
          <div className="alumni-badge">⭐ Excellence in Education</div>
          <h2 className="alumni-title">Distinguished Alumni Network</h2>
          <p className="alumni-subtitle">
            Meet our accomplished graduates leading transformative change across the globe
          </p>
        </div>

        {/* Horizontal Scrolling Section */}
        <div className="alumni-scroll-wrapper">
          <div className="alumni-scroll-container">
            {alumni.concat(alumni).map((person, index) => {
              const IconComponent = person.icon;

              return (
                <div
                  key={`${person.id}-${index}`}
                  className="alumni-card"
                  style={{
                    "--accent-color": person.color,
                    "--bg-color": person.bgColor,
                  }}
                  onMouseEnter={() => setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image Placeholder */}
                  <div className="alumni-image-placeholder">
                    <ImageIcon size={80} className="image-icon" strokeWidth={1} />
                    
                    {/* Icon Badge */}
                    <div className="icon-badge">
                      <IconComponent size={22} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content Section */}
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
          <div className="stat-item">
            <div className="stat-number">43+</div>
            <div className="stat-label">Distinguished Alumni</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Industry Sectors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Global</div>
            <div className="stat-label">Impact Leaders</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotableAlumni;