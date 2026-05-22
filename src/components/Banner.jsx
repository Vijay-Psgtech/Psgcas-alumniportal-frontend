// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ArrowRight,
//   Zap,
//   Users,
//   Globe,
//   Sparkles,
//   AlertCircle,
//   X,
// } from "lucide-react";

// import { bannerService } from "../services/api";
// import { notificationService } from "../services/api";

// import BannerScrollNotification from "../pages/BannerScrollNotification";

// // ✅ Particle initialization function
// const initializeParticles = () => {
//   return [...Array(20)].map(() => ({
//     id: Math.random(),
//     left: Math.random() * 100,
//     tx: (Math.random() - 0.5) * 200,
//     duration: 3 + Math.random() * 4,
//     delay: Math.random() * 5,
//   }));
// };

// // ✅ Default notification data
// const getDefaultNotifications = () => [
//   {
//     id: "1",
//     type: "success",
//     title: "Welcome to PSG Alumni!",
//     message: "Join 12K+ alumni members connecting across 35+ countries.",
//   },
//   {
//     id: "2",
//     type: "info",
//     title: "Upcoming Event",
//     message:
//       "Join our networking session next month - early bird registration open!",
//   },
//   {
//     id: "3",
//     type: "warning",
//     title: "Limited Spots Available",
//     message: "Only 50 seats left for the Global Summit 2024. Register now!",
//   },
// ];

// const EpicBanner = () => {
//   const [particles] = useState(initializeParticles());

//   const [bannerData, setBannerData] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  
 
//   const refetchIntervalRef = useRef(null);

//   const getDefaultBannerData = useCallback(
//     () => ({
//       id: "default",
//       title: "Connect, Grow & Lead Together",
//       description:
//         "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
//       subtitle: "Welcome to Excellence",
//       backgroundImage: "https://via.placeholder.com/1600x900",
//       features: [
//         { icon: "Users", text: "12K+ Alumni Connected" },
//         { icon: "Globe", text: "35+ Countries" },
//         { icon: "Sparkles", text: "200+ Annual Events" },
//       ],
//       primaryButtonText: "Join Now",
//       secondaryButtonText: "Learn More",
//       isActive: true,
//       updatedAt: new Date().toISOString(),
//     }),
//     [],
//   );

//   // ✅ Fetch banner data WITHOUT cache
//   const fetchBannerData = useCallback(async () => {
//     try {
//       const result = await bannerService.getActiveBanner();

//       if (result.success && result.data) {
//         setBannerData(result.data);
//         setError(null);
//       } else {
//         setBannerData(getDefaultBannerData());
//         setError(null);
//       }
//     } catch (err) {
//       console.error("Error fetching banner:", err);

//       setBannerData(getDefaultBannerData());
//       setError("Failed to load banner data");
//     }
//   }, [getDefaultBannerData]);

//   // ✅ Fetch notifications WITHOUT cache
//   const fetchNotifications = useCallback(async () => {
//     try {
//       const result = await notificationService.getActiveNotifications();

//       if (
//         result.success &&
//         Array.isArray(result.data) &&
//         result.data.length > 0
//       ) {
//         console.log("✅ Fetched", result.data.length, "notifications from API");

//         setNotifications(result.data);
//         setCurrentNotificationIndex(0);
//         setShowNotification(true);
//       } else {
//         console.log("ℹ️ No notifications from API, using defaults");

//         const defaultNotifications = getDefaultNotifications();

//         setNotifications(defaultNotifications);
//         setCurrentNotificationIndex(0);
//         setShowNotification(true);
//       }
//     } catch (err) {
//       console.warn("⚠️ Error fetching notifications:", err.message);

//       const defaultNotifications = getDefaultNotifications();

//       setNotifications(defaultNotifications);
//       setCurrentNotificationIndex(0);
//       setShowNotification(true);
//     }
//   }, []);

//   // ✅ Initial load
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       try {
//         await Promise.all([fetchBannerData(), fetchNotifications()]);
//       } catch (err) {
//         console.error("Error loading initial data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // ✅ Auto refresh every 30 sec
//     refetchIntervalRef.current = setInterval(() => {
//       console.log("🔄 Refreshing banner and notifications...");

//       fetchBannerData();
//       fetchNotifications();
//     }, 30000);

//     return () => {
//       if (refetchIntervalRef.current) {
//         clearInterval(refetchIntervalRef.current);
//       }
//     };
//   }, [fetchBannerData, fetchNotifications]);

//   // ✅ Notification rotation
//   const getIconComponent = (iconName) => {
//     const iconMap = {
//       Users,
//       Globe,
//       Sparkles,
//       Zap,
//     };

//     return iconMap[iconName] || Sparkles;
//   };

//   const handleNotificationClose = () => {
//     console.log("❌ Notification closed");

//     setShowNotification(false);

//     if (notificationTimerRef.current) {
//       clearTimeout(notificationTimerRef.current);
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           height: "100vh",
//           background: "linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           marginTop: "60px",
//         }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             color: "white",
//           }}
//         >
//           <div
//             style={{
//               width: "40px",
//               height: "40px",
//               border: "3px solid rgba(255,255,255,0.3)",
//               borderTop: "3px solid white",
//               borderRadius: "50%",
//               margin: "0 auto 20px",
//               animation: "spin 1s linear infinite",
//             }}
//           />

//           <p>Loading banner...</p>

//           <style>{`
//             @keyframes spin {
//               to {
//                 transform: rotate(360deg);
//               }
//             }
//           `}</style>
//         </div>
//       </div>
//     );
//   }

//   const data = bannerData || getDefaultBannerData();

//   return (
//     <>
//       <style>{`
//         html,
//         body {
//           overflow-x: hidden;
//           scroll-behavior: smooth;
//         }

//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');

//         .epic-banner {
//           position: relative;
//           min-height: 120vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: visible;
//           margin-top: 60px;
//           padding-bottom: 0;
//         }

//         .banner-bg {
//           position: absolute;
//           inset: 0;
//           background-size: cover;
//           background-position: center;
//           background-attachment: fixed;
//           z-index: 1;
//           background-color: #0f172a;
//           animation: bgZoom 20s ease-out forwards;
//           pointer-events: none;
//         }

//         @keyframes bgZoom {
//           from {
//             transform: scale(1.05);
//           }

//           to {
//             transform: scale(1);
//           }
//         }

//         .banner-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(
//             135deg,
//             rgba(15, 23, 42, 0.85) 0%,
//             rgba(30, 60, 114, 0.8) 50%,
//             rgba(42, 82, 152, 0.75) 100%
//           );
//           z-index: 2;
//           pointer-events: none;
//         }

//         .grid-bg {
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(
//               rgba(255, 255, 255, 0.03) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               90deg,
//               rgba(255, 255, 255, 0.03) 1px,
//               transparent 1px
//             );

//           background-size: 50px 50px;
//           z-index: 2;
//           pointer-events: none;
//         }

//         .orb {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(120px);
//           mix-blend-mode: screen;
//           pointer-events: none;
//         }

//         .orb-1 {
//           width: 800px;
//           height: 900px;
//           background: rgba(255, 107, 157, 0.3);
//           top: -150px;
//           left: -150px;
//           z-index: 2;
//         }

//         .orb-2 {
//           width: 800px;
//           height: 600px;
//           background: rgba(59, 130, 246, 0.3);
//           bottom: -200px;
//           right: -200px;
//           z-index: 2;
//         }

//         .orb-3 {
//           width: 600px;
//           height: 600px;
//           background: rgba(126, 87, 194, 0.2);
//           top: 50%;
//           right: 5%;
//           z-index: 2;
//         }

//         .particles {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           pointer-events: none;
//         }

//         .particle {
//           position: absolute;
//           width: 2px;
//           height: 2px;
//           background: rgba(255, 255, 255, 0.5);
//           border-radius: 50%;
//           animation: float 5s ease-in-out infinite;
//           opacity: 0.6;
//         }

//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0)
//               translateX(0);

//             opacity: 0;
//           }

//           50% {
//             opacity: 1;
//           }

//           100% {
//             transform: translateY(-200px)
//               translateX(var(--tx));

//             opacity: 0;
//           }
//         }

//         .content {
//           position: relative;
//           z-index: 3;
//           max-width: 1200px;
//           width: 100%;
//           margin: 0 auto;
//           padding: 60px 40px;
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 60px;
//           align-items: center;
//         }

//         .banner-left {
//           color: white;
//         }

//         .banner-subtitle {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           background: rgba(255, 107, 157, 0.2);
//           border: 1px solid rgba(255, 107, 157, 0.4);
//           border-radius: 50px;
//           color: #ffb3d9;
//           font-size: 13px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 24px;
//           animation: fadeInDown 0.8s ease-out backwards;
//         }

//         .banner-title {
//           font-size: 64px;
//           font-weight: 800;
//           line-height: 1.1;
//           margin-bottom: 24px;
//           animation: fadeInUp 0.8s ease-out backwards 0.1s;
//           font-family: 'Sora', sans-serif;
//           background: linear-gradient(
//             135deg,
//             #ffffff 0%,
//             #e0e7ff 100%
//           );
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .banner-description {
//           font-size: 18px;
//           line-height: 1.6;
//           color: rgba(255, 255, 255, 0.9);
//           margin-bottom: 40px;
//           max-width: 600px;
//           animation: fadeInUp 0.8s ease-out backwards 0.2s;
//         }

//         .features-list {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           margin-bottom: 48px;
//         }

//         .feature-item {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 12px 0;
//           animation: fadeInUp 0.8s ease-out backwards;
//           opacity: 1;
//         }

//         .feature-item:nth-child(1) {
//           animation-delay: 0.3s;
//         }

//         .feature-item:nth-child(2) {
//           animation-delay: 0.4s;
//         }

//         .feature-item:nth-child(3) {
//           animation-delay: 0.5s;
//         }

//         .feature-icon {
//           width: 36px;
//           height: 36px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(200, 62, 125, 0.2);
//           border-radius: 10px;
//           color: #ff6b9d;
//           flex-shrink: 0;
//         }

//         .feature-text {
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .cta-buttons {
//           display: flex;
//           gap: 16px;
//           flex-wrap: wrap;
//         }

//         .btn-primary {
//           padding: 16px 40px;
//           border-radius: 14px;
//           border: none;
//           font-weight: 700;
//           cursor: pointer;
//           color: white;
//           background: linear-gradient(
//             135deg,
//             #1e3c72,
//             #2a5298
//           );

//           transition: all 0.4s
//             cubic-bezier(0.34, 1.56, 0.64, 1);

//           display: flex;
//           align-items: center;
//           gap: 10px;
//           font-size: 14px;
//           font-family: 'Sora', sans-serif;
//           box-shadow: 0 8px 24px
//             rgba(30, 60, 114, 0.4);

//           position: relative;
//           overflow: hidden;
//         }

//         .btn-primary::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(
//             135deg,
//             #2a5298,
//             #c83e7d
//           );

//           transition: left 0.4s ease;
//           z-index: -1;
//         }

//         .btn-primary:hover::before {
//           left: 0;
//         }

//         .btn-primary:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 36px
//             rgba(30, 60, 114, 0.5);
//         }

//         .btn-secondary {
//           padding: 16px 32px;
//           border-radius: 14px;
//           background: rgba(255, 255, 255, 0.1);
//           border: 2px solid
//             rgba(255, 255, 255, 0.2);

//           color: white;
//           backdrop-filter: blur(12px);
//           cursor: pointer;
//           font-weight: 700;
//           transition: all 0.3s ease;
//           font-family: 'Sora', sans-serif;
//           font-size: 14px;
//         }

//         .btn-secondary:hover {
//           background: rgba(255, 255, 255, 0.15);
//           border-color: rgba(255, 255, 255, 0.4);
//           transform: translateY(-4px);
//         }

//         .error-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 12px 16px;
//           background: rgba(239, 68, 68, 0.15);
//           border: 1px solid
//             rgba(239, 68, 68, 0.3);

//           border-radius: 8px;
//           color: #fca5a5;
//           font-size: 13px;
//           margin-bottom: 20px;
//         }

//         @keyframes fadeInDown {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @media (max-width: 1024px) {
//           .content {
//             grid-template-columns: 1fr;
//             gap: 60px;
//             padding: 0 30px;
//           }

//           .banner-title {
//             font-size: 48px;
//           }

//           .banner-left {
//             text-align: center;
//           }

//           .features-list {
//             margin: 0 auto;
//           }

//           .cta-buttons {
//             justify-content: center;
//           }
//         }

//         @media (max-width: 768px) {
//           .epic-banner {
//             min-height: 100vh;
//             margin-top: 50px;
//           }

//           .content {
//             padding: 0 20px;
//           }

//           .banner-title {
//             font-size: 36px;
//           }

//           .banner-description {
//             font-size: 16px;
//           }

//           .orb-1,
//           .orb-2,
//           .orb-3 {
//             filter: blur(80px);
//             opacity: 0.3;
//           }

//           .banner-overlay {
//             background: linear-gradient(
//               135deg,
//               rgba(15, 23, 42, 0.8) 0%,
//               rgba(30, 60, 114, 0.75) 50%,
//               rgba(42, 82, 152, 0.7) 100%
//             );
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation: none !important;
//             transition: none !important;
//           }
//         }
//       `}</style>

//       <div className="epic-banner">
//         <div
//           className="banner-bg"
//           style={{
//             backgroundImage: `url(${data.backgroundImage})`,
//           }}
//         />

//         <div className="banner-overlay" />

//         <div className="grid-bg" />

//         <div className="orb orb-1" />
//         <div className="orb orb-2" />
//         <div className="orb orb-3" />

//         {/* Particles */}
//         <div className="particles">
//           {particles.map((particle) => (
//             <div
//               key={particle.id}
//               className="particle"
//               style={{
//                 left: particle.left + "%",
//                 "--tx": particle.tx + "px",
//                 animationDuration: particle.duration + "s",
//                 animationDelay: particle.delay + "s",
//               }}
//             />
//           ))}
//         </div>

//         {/* Content */}
//         <div className="content">
//           <div className="banner-left">
//             {error && (
//               <div className="error-badge">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}

//             <div className="banner-subtitle">
//               <Sparkles size={14} />
//               {data.subtitle}
//             </div>

//             <h1 className="banner-title">{data.title}</h1>

//             <p className="banner-description">{data.description}</p>

//             <div className="features-list">
//               {data.features &&
//                 data.features.map((feature, idx) => {
//                   const Icon = getIconComponent(feature.icon);

//                   return (
//                     <div key={idx} className="feature-item">
//                       <div className="feature-icon">
//                         <Icon size={18} />
//                       </div>

//                       <span className="feature-text">{feature.text}</span>
//                     </div>
//                   );
//                 })}
//             </div>

//             <div className="cta-buttons">
//               <button className="btn-primary">
//                 <Zap size={18} />
//                 {data.primaryButtonText}
//               </button>

//               <button className="btn-secondary">
//                 {data.secondaryButtonText}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Notifications */}
//         {/* Notifications */}
//         {notifications.length > 0 && (
//           <BannerScrollNotification notifications={notifications} />
//         )}
//       </div>
//     </>
//   );
// };

// export default EpicBanner;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap,
  Users,
  Globe,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { bannerService } from "../services/api";
import { notificationService } from "../services/api";

import BannerScrollNotification from "../pages/BannerScrollNotification";

// ✅ Particle initialization function
const initializeParticles = () => {
  return [...Array(20)].map(() => ({
    id: Math.random(),
    left: Math.random() * 100,
    tx: (Math.random() - 0.5) * 200,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
  }));
};

// ✅ Default notification data
const getDefaultNotifications = () => [
  {
    id: "1",
    type: "success",
    title: "Welcome to PSG Alumni!",
    message:
      "Join 12K+ alumni members connecting across 35+ countries.",
  },
  {
    id: "2",
    type: "info",
    title: "Upcoming Event",
    message:
      "Join our networking session next month - early bird registration open!",
  },
  {
    id: "3",
    type: "warning",
    title: "Limited Spots Available",
    message:
      "Only 50 seats left for the Global Summit 2024. Register now!",
  },
];

const EpicBanner = () => {
  const [particles] = useState(initializeParticles());

  const [bannerData, setBannerData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchIntervalRef = useRef(null);

  const getDefaultBannerData = useCallback(
    () => ({
      id: "default",
      title: "Connect, Grow & Lead Together",
      description:
        "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
      subtitle: "Welcome to Excellence",
      backgroundImage: "https://via.placeholder.com/1600x900",
      features: [
        { icon: "Users", text: "12K+ Alumni Connected" },
        { icon: "Globe", text: "35+ Countries" },
        { icon: "Sparkles", text: "200+ Annual Events" },
      ],
      primaryButtonText: "Join Now",
      secondaryButtonText: "Learn More",
      isActive: true,
      updatedAt: new Date().toISOString(),
    }),
    [],
  );

  // ✅ Fetch banner data
  const fetchBannerData = useCallback(async () => {
    try {
      const result = await bannerService.getActiveBanner();

      if (result.success && result.data) {
        setBannerData(result.data);
        setError(null);
      } else {
        setBannerData(getDefaultBannerData());
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching banner:", err);

      setBannerData(getDefaultBannerData());
      setError("Failed to load banner data");
    }
  }, [getDefaultBannerData]);

  // ✅ Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const result =
        await notificationService.getActiveNotifications();

      if (
        result.success &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        console.log(
          "✅ Fetched",
          result.data.length,
          "notifications from API",
        );

        setNotifications(result.data);
      } else {
        console.log(
          "ℹ️ No notifications from API, using defaults",
        );

        setNotifications(getDefaultNotifications());
      }
    } catch (err) {
      console.warn(
        "⚠️ Error fetching notifications:",
        err.message,
      );

      setNotifications(getDefaultNotifications());
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchBannerData(),
          fetchNotifications(),
        ]);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ Auto refresh every 30 sec
    refetchIntervalRef.current = setInterval(() => {
      console.log("🔄 Refreshing banner and notifications...");

      fetchBannerData();
      fetchNotifications();
    }, 30000);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [fetchBannerData, fetchNotifications]);

  const getIconComponent = (iconName) => {
    const iconMap = {
      Users,
      Globe,
      Sparkles,
      Zap,
    };

    return iconMap[iconName] || Sparkles;
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border:
                "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          />

          <p>Loading banner...</p>

          <style>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const data = bannerData || getDefaultBannerData();

  return (
    <>
      <style>{`
        html,
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .epic-banner {
          position: relative;
          min-height: 120vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-top: 60px;
          padding-bottom: 80px;
        }

        .banner-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 1;
          background-color: #0f172a;
          animation: bgZoom 20s ease-out forwards;
          pointer-events: none;
        }

        @keyframes bgZoom {
          from {
            transform: scale(1.05);
          }

          to {
            transform: scale(1);
          }
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.85) 0%,
            rgba(30, 60, 114, 0.8) 50%,
            rgba(42, 82, 152, 0.75) 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );

          background-size: 50px 50px;
          z-index: 2;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .orb-1 {
          width: 800px;
          height: 900px;
          background: rgba(255, 107, 157, 0.3);
          top: -150px;
          left: -150px;
          z-index: 2;
        }

        .orb-2 {
          width: 800px;
          height: 600px;
          background: rgba(59, 130, 246, 0.3);
          bottom: -200px;
          right: -200px;
          z-index: 2;
        }

        .orb-3 {
          width: 600px;
          height: 600px;
          background: rgba(126, 87, 194, 0.2);
          top: 50%;
          right: 5%;
          z-index: 2;
        }

        .particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 5s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0)
              translateX(0);

            opacity: 0;
          }

          50% {
            opacity: 1;
          }

          100% {
            transform: translateY(-200px)
              translateX(var(--tx));

            opacity: 0;
          }
        }

        .content {
          position: relative;
          z-index: 3;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: center;
        }

        .banner-left {
          color: white;
        }

        .banner-subtitle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 107, 157, 0.2);
          border: 1px solid rgba(255, 107, 157, 0.4);
          border-radius: 50px;
          color: #ffb3d9;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
          animation: fadeInDown 0.8s ease-out backwards;
        }

        .banner-title {
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out backwards 0.1s;
          font-family: 'Sora', sans-serif;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #e0e7ff 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .banner-description {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out backwards 0.2s;
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
        }

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
          background: linear-gradient(
            135deg,
            #1e3c72,
            #2a5298
          );

          transition: all 0.4s ease;

          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 24px
            rgba(30, 60, 114, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-4px);
        }

        .btn-secondary {
          padding: 16px 32px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid
            rgba(255, 255, 255, 0.2);

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
          transform: translateY(-4px);
        }

        .error-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid
            rgba(239, 68, 68, 0.3);

          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
          margin-bottom: 20px;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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
        }
      `}</style>

      <div className="epic-banner">
        <div
          className="banner-bg"
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
          }}
        />

        <div className="banner-overlay" />

        <div className="grid-bg" />

        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Particles */}
        <div className="particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left + "%",
                "--tx": particle.tx + "px",
                animationDuration:
                  particle.duration + "s",
                animationDelay:
                  particle.delay + "s",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="content">
          <div className="banner-left">
            {error && (
              <div className="error-badge">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="banner-subtitle">
              <Sparkles size={14} />
              {data.subtitle}
            </div>

            <h1 className="banner-title">
              {data.title}
            </h1>

            <p className="banner-description">
              {data.description}
            </p>

            <div className="features-list">
              {data.features &&
                data.features.map((feature, idx) => {
                  const Icon = getIconComponent(
                    feature.icon,
                  );

                  return (
                    <div
                      key={idx}
                      className="feature-item"
                    >
                      <div className="feature-icon">
                        <Icon size={18} />
                      </div>

                      <span className="feature-text">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="cta-buttons">
              <button className="btn-primary">
                <Zap size={18} />
                {data.primaryButtonText}
              </button>

              <button className="btn-secondary">
                {data.secondaryButtonText}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Continuous Scrolling Notifications */}
        {notifications.length > 0 && (
          <BannerScrollNotification
            notifications={notifications}
          />
        )}
      </div>
    </>
  );
};

export default EpicBanner;
