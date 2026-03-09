// import React, { useState, useEffect } from "react";
// import { Award, Heart, Users, Zap, ArrowRight } from "lucide-react";



// const WelcomeSection = () => {
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [imageErrors, setImageErrors] = useState({});

//   const handleMouseMove = (e, cardIndex) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setMousePosition({ x, y });
//   };

//   const handleImageError = (leaderId) => {
//     console.warn(`Image failed to load for leader ${leaderId}`);
//     setImageErrors((prev) => ({
//       ...prev,
//       [leaderId]: true,
//     }));
//   };

//   const getFallbackImage = (leaderId) => {
//     if (leaderId === 1) {
//       return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
//     } else if (leaderId === 2) {
//       return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop";
//     }
//     return "https://via.placeholder.com/400?text=Leader";
//   };

//   const leaders = [
//     {
//       id: 1,
//       name: "Shri. L. Gopalakrishnan",
//       title: "PSG Sons & Charities",
//       subtitle: "Visionary Leader & Philanthropist",
//       image: leaderImage1,
//       icon: Heart,
//       stats: { label: "Years of Service", value: "25+" },
//       bio: "Leading innovation in education and community development",
//       color: "#0052CC",
//       bgGradient: "rgba(0, 82, 204, 0.08)",
//       borderColor: "#0052CC",
//     },
//     {
//       id: 2,
//       name: "Mr. J Prithiviraj",
//       title: "President - PSG Arts Alumni Association",
//       subtitle: "Connecting Generations of Excellence",
//       image: leaderImage2,
//       icon: Zap,
//       stats: { label: "Alumni Connected", value: "10K+" },
//       bio: "Dedicated to building stronger alumni networks and opportunities",
//       color: "#1A73E8",
//       bgGradient: "rgba(26, 115, 232, 0.08)",
//       borderColor: "#1A73E8",
//     },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

//         /* Welcome Section Container */
//         .welcome-section-innovative {
//           width: 100%;
//           padding: 80px 40px;
//           background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%);
//           position: relative;
//           overflow: hidden;
//         }

//         /* Background Decorative Elements */
//         .welcome-bg-decoration {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           pointer-events: none;
//           z-index: 1;
//         }

//         .decoration-blob {
//           position: absolute;
//           border-radius: 50%;
//           opacity: 0.04;
//           animation: blobFloat 12s ease-in-out infinite;
//         }

//         .blob-1 {
//           width: 400px;
//           height: 400px;
//           background: #0052CC;
//           top: -100px;
//           right: 10%;
//           animation-delay: 0s;
//         }

//         .blob-2 {
//           width: 300px;
//           height: 300px;
//           background: #1A73E8;
//           bottom: -50px;
//           left: 5%;
//           animation-delay: 2s;
//         }

//         .blob-3 {
//           width: 250px;
//           height: 250px;
//           background: #0369A1;
//           top: 50%;
//           right: -50px;
//           animation-delay: 4s;
//         }

//         @keyframes blobFloat {
//           0%, 100% {
//             transform: translateY(0) translateX(0) scale(1);
//           }
//           25% {
//             transform: translateY(-30px) translateX(20px) scale(1.05);
//           }
//           50% {
//             transform: translateY(0) translateX(0) scale(1);
//           }
//           75% {
//             transform: translateY(30px) translateX(-20px) scale(0.95);
//           }
//         }

//         /* Welcome Content */
//         .welcome-content-wrapper {
//           position: relative;
//           z-index: 2;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         /* Section Header */
//         .welcome-header {
//           text-align: center;
//           margin-bottom: 60px;
//           animation: slideUp 0.8s ease-out;
//         }

//         .welcome-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 18px;
//           background: rgba(0, 82, 204, 0.08);
//           border: 1px solid rgba(0, 82, 204, 0.15);
//           border-radius: 50px;
//           margin-bottom: 20px;
//           font-size: 12px;
//           font-weight: 700;
//           color: #0052CC;
//           letter-spacing: 0.8px;
//           text-transform: uppercase;
//           font-family: 'Inter', sans-serif;
//           animation: slideUp 0.8s ease-out 0.1s backwards;
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .badge-icon {
//           width: 4px;
//           height: 4px;
//           border-radius: 50%;
//           background: #0052CC;
//           animation: pulse 2s ease-in-out infinite;
//         }

//         @keyframes pulse {
//           0%, 100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.5);
//             opacity: 0.5;
//           }
//         }

//         .welcome-title {
//           font-size: 42px;
//           font-weight: 700;
//           color: #1F2937;
//           margin-bottom: 16px;
//           letter-spacing: -0.5px;
//           font-family: 'Inter', sans-serif;
//           line-height: 1.2;
//           animation: slideUp 0.8s ease-out 0.2s backwards;
//         }

//         .welcome-subtitle {
//           font-size: 16px;
//           color: #6B7280;
//           font-weight: 400;
//           line-height: 1.7;
//           max-width: 700px;
//           margin: 0 auto;
//           font-family: 'Inter', sans-serif;
//           animation: slideUp 0.8s ease-out 0.3s backwards;
//         }

//         /* Underline Animation */
//         .welcome-header::after {
//           content: '';
//           display: block;
//           width: 60px;
//           height: 4px;
//           background: linear-gradient(90deg, #0052CC, #1A73E8);
//           border-radius: 2px;
//           margin: 24px auto 0;
//           animation: expandWidth 0.8s ease-out 0.4s backwards;
//         }

//         @keyframes expandWidth {
//           from {
//             width: 0;
//             opacity: 0;
//           }
//           to {
//             width: 60px;
//             opacity: 1;
//           }
//         }

//         /* Leaders Grid */
//         .leaders-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 40px;
//           margin-bottom: 40px;
//           animation: fadeIn 0.8s ease-out 0.5s backwards;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         /* Leader Card */
//         .leader-card {
//           position: relative;
//           border-radius: 12px;
//           overflow: hidden;
//           transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           cursor: pointer;
//           animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
//           animation-fill-mode: both;
//         }

//         .leader-card:nth-child(1) {
//           animation-delay: 0.6s;
//         }

//         .leader-card:nth-child(2) {
//           animation-delay: 0.7s;
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9) translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         .leader-card:hover {
//           transform: translateY(-8px);
//         }

//         /* Card Content Container */
//         .leader-card-content {
//           position: relative;
//           display: flex;
//           height: 100%;
//           background: white;
//           border: 2px solid #E5E7EB;
//           transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
//           border-radius: 12px;
//           overflow: hidden;
//         }

//         .leader-card:hover .leader-card-content {
//           border-color: var(--border-color);
//           box-shadow: 0 15px 40px rgba(0, 82, 204, 0.15);
//         }

//         /* Image Section */
//         .leader-image-container {
//           flex: 0 0 280px;
//           position: relative;
//           overflow: hidden;
//           background: var(--card-bg);
//           min-height: 280px;
//         }

//         .leader-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           display: block;
//         }

//         .leader-card:hover .leader-image {
//           transform: scale(1.08);
//         }

//         /* Image Loading State */
//         .image-loading {
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #F8F9FA;
//           color: #9CA3AF;
//           font-size: 12px;
//           flex-direction: column;
//           gap: 8px;
//         }

//         /* Image Overlay */
//         .image-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(0, 82, 204, 0.2), rgba(26, 115, 232, 0.1));
//           opacity: 0;
//           transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           z-index: 3;
//         }

//         .leader-card:hover .image-overlay {
//           opacity: 1;
//         }

//         /* Badge on Image */
//         .image-badge {
//           position: absolute;
//           top: 16px;
//           right: 16px;
//           z-index: 4;
//           width: 56px;
//           height: 56px;
//           border-radius: 50%;
//           background: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 4px 12px rgba(31, 41, 55, 0.15);
//           transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s backwards;
//         }

//         @keyframes bounceIn {
//           from {
//             opacity: 0;
//             transform: scale(0) rotate(-45deg);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) rotate(0);
//           }
//         }

//         .leader-card:hover .image-badge {
//           transform: scale(1.1);
//         }

//         .image-badge svg {
//           width: 28px;
//           height: 28px;
//           color: var(--badge-color);
//         }

//         /* Info Section */
//         .leader-info {
//           flex: 1;
//           padding: 32px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           background: white;
//           position: relative;
//         }

//         /* Decorative Line */
//         .info-decoration {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 3px;
//           background: var(--border-color);
//           opacity: 0;
//           transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .leader-card:hover .info-decoration {
//           opacity: 1;
//         }

//         /* Leader Title */
//         .leader-title {
//           font-size: 12px;
//           font-weight: 700;
//           color: var(--border-color);
//           letter-spacing: 0.8px;
//           text-transform: uppercase;
//           margin-bottom: 8px;
//           font-family: 'Inter', sans-serif;
//         }

//         /* Leader Name */
//         .leader-name {
//           font-size: 22px;
//           font-weight: 700;
//           color: #1F2937;
//           margin-bottom: 4px;
//           letter-spacing: -0.3px;
//           font-family: 'Inter', sans-serif;
//           line-height: 1.3;
//         }

//         /* Leader Subtitle */
//         .leader-subtitle {
//           font-size: 13px;
//           color: #9CA3AF;
//           margin-bottom: 16px;
//           font-weight: 500;
//           font-family: 'Inter', sans-serif;
//         }

//         /* Leader Bio */
//         .leader-bio {
//           font-size: 14px;
//           color: #6B7280;
//           line-height: 1.6;
//           margin-bottom: 20px;
//           font-family: 'Inter', sans-serif;
//           min-height: 44px;
//         }

//         /* Stats Row */
//         .leader-stats {
//           display: flex;
//           gap: 20px;
//           padding-top: 16px;
//           border-top: 1px solid #E5E7EB;
//           margin-bottom: 20px;
//         }

//         .stat-item {
//           flex: 1;
//         }

//         .stat-value {
//           font-size: 20px;
//           font-weight: 800;
//           color: var(--border-color);
//           font-family: 'Inter', sans-serif;
//         }

//         .stat-label {
//           font-size: 11px;
//           color: #9CA3AF;
//           font-weight: 600;
//           margin-top: 4px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           font-family: 'Inter', sans-serif;
//         }

//         /* CTA Button */
//         .leader-cta {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 18px;
//           background: var(--border-color);
//           color: white;
//           border: none;
//           border-radius: 4px;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           text-transform: uppercase;
//           cursor: pointer;
//           transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
//           font-family: 'Inter', sans-serif;
//           opacity: 0;
//           transform: translateY(8px);
//         }

//         .leader-card:hover .leader-cta {
//           opacity: 1;
//           transform: translateY(0);
//         }

//         .leader-cta:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 82, 204, 0.3);
//         }

//         .leader-cta svg {
//           width: 14px;
//           height: 14px;
//         }

//         /* Responsive Design */
//         @media(max-width: 1024px) {
//           .welcome-section-innovative {
//             padding: 60px 30px;
//           }

//           .welcome-title {
//             font-size: 36px;
//           }

//           .leaders-grid {
//             gap: 32px;
//           }

//           .leader-image-container {
//             flex: 0 0 240px;
//           }

//           .leader-info {
//             padding: 28px;
//           }

//           .welcome-header {
//             margin-bottom: 50px;
//           }
//         }

//         @media(max-width: 768px) {
//           .welcome-section-innovative {
//             padding: 60px 20px;
//           }

//           .welcome-header {
//             margin-bottom: 48px;
//           }

//           .welcome-title {
//             font-size: 32px;
//           }

//           .welcome-subtitle {
//             font-size: 15px;
//           }

//           .leaders-grid {
//             grid-template-columns: 1fr;
//             gap: 28px;
//           }

//           .leader-card-content {
//             flex-direction: column;
//           }

//           .leader-image-container {
//             flex: 0 0 240px;
//             width: 100%;
//           }

//           .leader-info {
//             padding: 24px;
//           }

//           .leader-name {
//             font-size: 20px;
//           }

//           .image-badge {
//             width: 50px;
//             height: 50px;
//           }

//           .image-badge svg {
//             width: 24px;
//             height: 24px;
//           }
//         }

//         @media(max-width: 640px) {
//           .welcome-section-innovative {
//             padding: 40px 16px;
//           }

//           .welcome-header {
//             margin-bottom: 40px;
//           }

//           .welcome-title {
//             font-size: 28px;
//             margin-bottom: 12px;
//           }

//           .welcome-subtitle {
//             font-size: 14px;
//           }

//           .welcome-badge {
//             padding: 8px 16px;
//             font-size: 11px;
//           }

//           .leaders-grid {
//             gap: 20px;
//           }

//           .leader-card-content {
//             border-radius: 12px;
//           }

//           .leader-image-container {
//             flex: 0 0 200px;
//             min-height: 200px;
//           }

//           .leader-info {
//             padding: 20px;
//           }

//           .leader-name {
//             font-size: 18px;
//           }

//           .leader-title {
//             font-size: 11px;
//           }

//           .leader-subtitle {
//             font-size: 12px;
//             margin-bottom: 12px;
//           }

//           .leader-bio {
//             font-size: 13px;
//             min-height: 40px;
//             margin-bottom: 16px;
//           }

//           .leader-stats {
//             gap: 12px;
//             padding-top: 12px;
//             margin-bottom: 16px;
//           }

//           .stat-value {
//             font-size: 18px;
//           }

//           .leader-cta {
//             padding: 9px 14px;
//             font-size: 11px;
//           }

//           .blob-1, .blob-2, .blob-3 {
//             opacity: 0.02;
//           }
//         }
//       `}</style>

//       <section
//         className="welcome-section-innovative"
//         style={{
//           "--card-bg": leaders[selectedCard]?.bgGradient || "rgba(0, 82, 204, 0.08)",
//           "--border-color": leaders[selectedCard]?.borderColor || "#0052CC",
//           "--badge-color": leaders[selectedCard]?.color || "#0052CC",
//         }}
//       >
//         {/* Decorative Background Elements */}
//         <div className="welcome-bg-decoration">
//           <div className="decoration-blob blob-1"></div>
//           <div className="decoration-blob blob-2"></div>
//           <div className="decoration-blob blob-3"></div>
//         </div>

//         {/* Content */}
//         <div className="welcome-content-wrapper">
//           {/* Header */}
//           <div className="welcome-header">
//             <div className="welcome-badge">
//               <span className="badge-icon"></span>
//               Meet Our Leadership
//             </div>
//             <h2 className="welcome-title">
//               Visionary Leaders Shaping Excellence
//             </h2>
//             <p className="welcome-subtitle">
//               Guided by inspiring leaders who are dedicated to nurturing talent,
//               fostering innovation, and building a vibrant community of alumni
//               across the globe.
//             </p>
//           </div>

//           {/* Leaders Grid */}
//           <div className="leaders-grid">
//             {leaders.map((leader, index) => {
//               const IconComponent = leader.icon;
//               const imageUrl = imageErrors[leader.id]
//                 ? getFallbackImage(leader.id)
//                 : leader.image;

//               return (
//                 <div
//                   key={leader.id}
//                   className="leader-card"
//                   onMouseEnter={() => setSelectedCard(index)}
//                   onMouseMove={(e) => handleMouseMove(e, index)}
//                   onMouseLeave={() => setSelectedCard(null)}
//                 >
//                   <div
//                     className="leader-card-content"
//                     style={{
//                       "--card-bg": leader.bgGradient,
//                       "--border-color": leader.borderColor,
//                       "--badge-color": leader.color,
//                     }}
//                   >
//                     {/* Image Section */}
//                     <div
//                       className="leader-image-container"
//                       style={{ background: leader.bgGradient }}
//                     >
//                       {imageUrl ? (
//                         <img
//                           src={imageUrl}
//                           alt={leader.name}
//                           className="leader-image"
//                           onError={() => handleImageError(leader.id)}
//                           loading="lazy"
//                           decoding="async"
//                         />
//                       ) : (
//                         <div className="image-loading">
//                           <span>Unable to load image</span>
//                         </div>
//                       )}
//                       <div className="image-overlay"></div>
//                       <div
//                         className="image-badge"
//                         style={{ color: leader.color }}
//                       >
//                         <IconComponent size={24} strokeWidth={2} />
//                       </div>
//                     </div>

//                     {/* Info Section */}
//                     <div className="leader-info">
//                       <div className="info-decoration"></div>

//                       <div>
//                         <div
//                           className="leader-title"
//                           style={{ color: leader.color }}
//                         >
//                           {leader.title}
//                         </div>
//                         <h3 className="leader-name">{leader.name}</h3>
//                         <p className="leader-subtitle">{leader.subtitle}</p>
//                         <p className="leader-bio">{leader.bio}</p>
//                       </div>

//                       <div>
//                         <div className="leader-stats">
//                           <div className="stat-item">
//                             <div
//                               className="stat-value"
//                               style={{ color: leader.color }}
//                             >
//                               {leader.stats.value}
//                             </div>
//                             <div className="stat-label">
//                               {leader.stats.label}
//                             </div>
//                           </div>
//                         </div>

//                         <button
//                           className="leader-cta"
//                           style={{
//                             background: leader.color,
//                           }}
//                           aria-label={`Connect with ${leader.name}`}
//                         >
//                           Connect <ArrowRight size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default WelcomeSection;


import React, { useState, useEffect } from "react";
import { Award, Heart, Users, Zap, ArrowRight } from "lucide-react";
import leaderImage1 from "../assets/Images/250.png";
import leaderImage2 from "../assets/Images/251.png";

const WelcomeSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (leaderId) => {
    console.warn(`Image failed to load for leader ${leaderId}`);
    setImageErrors((prev) => ({
      ...prev,
      [leaderId]: true,
    }));
  };

  const getFallbackImage = (leaderId) => {
    if (leaderId === 1) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
    } else if (leaderId === 2) {
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop";
    }
    return "https://via.placeholder.com/400?text=Leader";
  };

  const leaders = [
    {
      id: 1,
      name: "Shri. L. Gopalakrishnan",
      title: "PSG Sons & Charities",
      subtitle: "Visionary Leader & Philanthropist",
      image: leaderImage1,
      icon: Heart,
      stats: { label: "Years of Service", value: "25+" },
      bio: "Leading innovation in education and community development",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
    },
    {
      id: 2,
      name: "Mr. J Prithiviraj",
      title: "President - PSG Arts Alumni Association",
      subtitle: "Connecting Generations of Excellence",
      image: leaderImage2,
      icon: Zap,
      stats: { label: "Alumni Connected", value: "10K+" },
      bio: "Dedicated to building stronger alumni networks and opportunities",
      color: "#8B5CF6",
      bgColor: "#FAF5FF",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        /* Welcome Section Container */
        .welcome-section-innovative {
          width: 100%;
          padding: 100px 40px;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
        }

        /* Background Decorative Elements */
        .welcome-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .decoration-blob {
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

        /* Welcome Content */
        .welcome-content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Section Header */
        .welcome-header {
          text-align: center;
          margin-bottom: 70px;
          animation: slideUp 0.8s ease-out;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #F0F9FF;
          border: 1px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: 20px;
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

        .badge-icon {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #3B82F6;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        .welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          line-height: 1.2;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #64748B;
          font-weight: 400;
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
          animation: slideUp 0.8s ease-out 0.3s backwards;
        }

        /* Underline Animation */
        .welcome-header::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6, #06B6D4);
          border-radius: 2px;
          margin: 24px auto 0;
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

        /* Leaders Grid */
        .leaders-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-bottom: 40px;
          animation: fadeIn 0.8s ease-out 0.5s backwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Leader Card */
        .leader-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: both;
        }

        .leader-card:nth-child(1) {
          animation-delay: 0.6s;
        }

        .leader-card:nth-child(2) {
          animation-delay: 0.7s;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .leader-card:hover {
          transform: translateY(-6px);
        }

        /* Leader Card Content */
        .leader-card-content {
          display: flex;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
          transition: all 300ms ease;
          min-height: 360px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .leader-card:hover .leader-card-content {
          border-color: var(--leader-color);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
        }

        /* Image Container */
        .leader-image-container {
          flex: 0 0 300px;
          position: relative;
          overflow: hidden;
          background: var(--leader-bg);
        }

        .leader-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .leader-card:hover .leader-image {
          transform: scale(1.08);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
          pointer-events: none;
        }

        /* Image Badge */
        .image-badge {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--leader-color) 0%, var(--leader-darker) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          transition: all 300ms ease;
        }

        .leader-card:hover .image-badge {
          transform: translateY(-6px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
        }

        .image-badge svg {
          width: 28px;
          height: 28px;
        }

        .image-loading {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--leader-bg);
          color: white;
          font-size: 14px;
        }

        /* Info Section */
        .leader-info {
          flex: 1;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .info-decoration {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, var(--leader-color) 0%, transparent 100%);
        }

        .leader-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--leader-color);
          margin-bottom: 8px;
          font-family: 'Poppins', sans-serif;
        }

        .leader-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
          line-height: 1.3;
        }

        .leader-subtitle {
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 12px;
          font-family: 'Poppins', sans-serif;
        }

        .leader-bio {
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
          min-height: 54px;
          margin-bottom: 16px;
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
        }

        /* Leader Stats */
        .leader-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #E2E8F0;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--leader-color);
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-top: 4px;
          font-family: 'Poppins', sans-serif;
        }

        /* CTA Button */
        .leader-cta {
          align-self: flex-start;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--leader-color), var(--leader-darker));
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
        }

        .leader-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
        }

        .leader-cta:active {
          transform: translateY(0);
        }

        /* Responsive Design */
        @media(max-width: 1024px) {
          .welcome-section-innovative {
            padding: 80px 30px;
          }

          .welcome-header {
            margin-bottom: 60px;
          }

          .welcome-title {
            font-size: 40px;
          }

          .leader-image-container {
            flex: 0 0 240px;
          }

          .leader-info {
            padding: 28px;
          }
        }

        @media(max-width: 768px) {
          .welcome-section-innovative {
            padding: 60px 20px;
          }

          .welcome-header {
            margin-bottom: 48px;
          }

          .welcome-title {
            font-size: 32px;
          }

          .welcome-subtitle {
            font-size: 15px;
          }

          .leaders-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .leader-card-content {
            flex-direction: column;
            min-height: auto;
          }

          .leader-image-container {
            flex: 0 0 240px;
            width: 100%;
          }

          .leader-info {
            padding: 24px;
          }

          .leader-name {
            font-size: 22px;
          }

          .image-badge {
            width: 48px;
            height: 48px;
          }

          .image-badge svg {
            width: 24px;
            height: 24px;
          }
        }

        @media(max-width: 640px) {
          .welcome-section-innovative {
            padding: 40px 16px;
          }

          .welcome-header {
            margin-bottom: 40px;
          }

          .welcome-title {
            font-size: 28px;
            margin-bottom: 12px;
          }

          .welcome-subtitle {
            font-size: 14px;
          }

          .welcome-badge {
            padding: 8px 16px;
            font-size: 11px;
          }

          .leaders-grid {
            gap: 20px;
          }

          .leader-card-content {
            border-radius: 12px;
          }

          .leader-image-container {
            flex: 0 0 200px;
            min-height: 200px;
          }

          .leader-info {
            padding: 20px;
          }

          .leader-name {
            font-size: 18px;
          }

          .leader-title {
            font-size: 10px;
          }

          .leader-subtitle {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .leader-bio {
            font-size: 13px;
            min-height: 40px;
            margin-bottom: 16px;
          }

          .leader-stats {
            gap: 10px;
            padding-top: 12px;
            margin-bottom: 14px;
          }

          .stat-value {
            font-size: 20px;
          }

          .leader-cta {
            padding: 9px 14px;
            font-size: 11px;
          }
        }
      `}</style>

      <section className="welcome-section-innovative">
        {/* Decorative Background Elements */}
        <div className="welcome-bg-decoration">
          <div className="decoration-blob blob-1"></div>
          <div className="decoration-blob blob-2"></div>
          <div className="decoration-blob blob-3"></div>
        </div>

        {/* Content */}
        <div className="welcome-content-wrapper">
          {/* Header */}
          <div className="welcome-header">
            <div className="welcome-badge">
              <span className="badge-icon"></span>
              Meet Our Leadership
            </div>
            <h2 className="welcome-title">
              Visionary Leaders Shaping Excellence
            </h2>
            <p className="welcome-subtitle">
              Guided by inspiring leaders who are dedicated to nurturing talent,
              fostering innovation, and building a vibrant community of alumni
              across the globe.
            </p>
          </div>

          {/* Leaders Grid */}
          <div className="leaders-grid">
            {leaders.map((leader) => {
              const IconComponent = leader.icon;
              const imageUrl = imageErrors[leader.id]
                ? getFallbackImage(leader.id)
                : leader.image;

              return (
                <div
                  key={leader.id}
                  className="leader-card"
                  onMouseEnter={() => setSelectedCard(leader.id)}
                  onMouseLeave={() => setSelectedCard(null)}
                >
                  <div
                    className="leader-card-content"
                    style={{
                      '--leader-color': leader.color,
                      '--leader-bg': leader.bgColor,
                      '--leader-darker': leader.color === '#3B82F6' ? '#0EA5E9' : leader.color === '#8B5CF6' ? '#06B6D4' : '#EC4899'
                    }}
                  >
                    {/* Image Section */}
                    <div
                      className="leader-image-container"
                      style={{ background: leader.bgColor }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={leader.name}
                          className="leader-image"
                          onError={() => handleImageError(leader.id)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="image-loading">
                          <span>Unable to load image</span>
                        </div>
                      )}
                      <div className="image-overlay"></div>
                      <div className="image-badge">
                        <IconComponent size={24} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="leader-info">
                      <div className="info-decoration"></div>

                      <div>
                        <div className="leader-title">
                          {leader.title}
                        </div>
                        <h3 className="leader-name">{leader.name}</h3>
                        <p className="leader-subtitle">{leader.subtitle}</p>
                        <p className="leader-bio">{leader.bio}</p>
                      </div>

                      <div>
                        <div className="leader-stats">
                          <div className="stat-item">
                            <div className="stat-value">
                              {leader.stats.value}
                            </div>
                            <div className="stat-label">
                              {leader.stats.label}
                            </div>
                          </div>
                        </div>

                        <button
                          className="leader-cta"
                          aria-label={`Connect with ${leader.name}`}
                        >
                          Connect <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WelcomeSection;
