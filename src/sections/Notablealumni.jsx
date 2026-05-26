import React, { useState } from "react";
import { Award, Briefcase, Zap, ChevronRight, Star, Users } from "lucide-react";
import alumniImage1 from "../assets/Images/Alum1.png";
import alumniImage2 from "../assets/Images/Alum2.png";
import alumniImage3 from "../assets/Images/Alum3.png";

const NotableAlumni = () => {
  const [imageErrors, setImageErrors] = useState({});

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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
              const imageUrl = imageErrors[person.id]
                ? getFallbackImage(person.id)
                : person.image;

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