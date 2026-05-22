// import React, { useState, useEffect, useRef } from "react";
// import { X, AlertCircle, Info, CheckCircle, TrendingUp } from "lucide-react";

// const BannerScrollNotification = ({ 
//   notification, 
//   onClose, 
//   total = 1, 
//   current = 1,
//   autoHideDuration = 8000 
// }) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const contentRef = useRef(null);
//   const containerRef = useRef(null);

//   // ✅ FIXED: Proper cleanup and animation setup
//   useEffect(() => {
//     if (!isVisible) return;

//     const timer = setTimeout(() => {
//       setIsVisible(false);
//     }, autoHideDuration);

//     return () => clearTimeout(timer);
//   }, [isVisible, autoHideDuration]);

//   // ✅ FIXED: Calculate animation duration based on content width
//   useEffect(() => {
//     if (!contentRef.current || !isVisible) return;

//     const element = contentRef.current;
//     const singleItemWidth = element.offsetWidth / 2; // Half because we duplicate
    
//     // Calculate readable speed (60px per second)
//     const duration = Math.max((singleItemWidth / 60), 8);
    
//     element.style.setProperty('--scroll-distance', `${singleItemWidth}px`);
//     element.style.setProperty('--animation-duration', `${duration}s`);
    
//     console.log(`📜 Notification scroll: ${singleItemWidth}px in ${duration.toFixed(1)}s`);
//   }, [notification, isVisible]);

//   const getIconComponent = (type) => {
//     switch (type) {
//       case "success":
//         return <CheckCircle size={18} />;
//       case "warning":
//         return <AlertCircle size={18} />;
//       case "info":
//         return <Info size={18} />;
//       case "trending":
//         return <TrendingUp size={18} />;
//       default:
//         return <CheckCircle size={18} />;
//     }
//   };

//   const getNotificationStyles = (type) => {
//     const styles = {
//       success: {
//         bg: "rgba(16, 185, 129, 0.15)",
//         border: "rgba(16, 185, 129, 0.4)",
//         iconColor: "#10b981",
//         text: "#d1fae5",
//         accent: "rgba(16, 185, 129, 0.3)",
//       },
//       warning: {
//         bg: "rgba(245, 158, 11, 0.15)",
//         border: "rgba(245, 158, 11, 0.4)",
//         iconColor: "#f59e0b",
//         text: "#fef3c7",
//         accent: "rgba(245, 158, 11, 0.3)",
//       },
//       info: {
//         bg: "rgba(59, 130, 246, 0.15)",
//         border: "rgba(59, 130, 246, 0.4)",
//         iconColor: "#3b82f6",
//         text: "#dbeafe",
//         accent: "rgba(59, 130, 246, 0.3)",
//       },
//       trending: {
//         bg: "rgba(168, 85, 247, 0.15)",
//         border: "rgba(168, 85, 247, 0.4)",
//         iconColor: "#a855f7",
//         text: "#e9d5ff",
//         accent: "rgba(168, 85, 247, 0.3)",
//       },
//       default: {
//         bg: "rgba(200, 62, 125, 0.15)",
//         border: "rgba(200, 62, 125, 0.4)",
//         iconColor: "#ff6b9d",
//         text: "#ffb3d9",
//         accent: "rgba(200, 62, 125, 0.3)",
//       },
//     };

//     return styles[type] || styles.default;
//   };

//   const notificationStyle = getNotificationStyles(notification.type || "default");

//   if (!isVisible) return null;

//   return (
//     <>
//       <style>{`
//         /* ✅ FIXED: Proper seamless scrolling animation */
//         @keyframes seamlessScroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(calc(-1 * var(--scroll-distance, 500px)));
//           }
//         }

//         .banner-scroll-notification {
//           position: absolute !important;
//           bottom: 0 !important;
//           left: 0 !important;
//           right: 0 !important;
//           width: 100% !important;
//           background: linear-gradient(90deg, 
//             ${notificationStyle.bg} 0%, 
//             ${notificationStyle.accent} 50%, 
//             ${notificationStyle.bg} 100%) !important;
//           border-top: 1px solid ${notificationStyle.border} !important;
//           border-bottom: 1px solid ${notificationStyle.border} !important;
//           padding: 0 !important;
//           margin: 0 !important;
//           overflow: hidden !important;
//           clip-path: inset(0) !important;
//           z-index: 50 !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: space-between !important;
//           height: auto !important;
//         }

//         /* ✅ FIXED: Strict scroll container with clipping */
//         .scroll-notification-container {
//           width: calc(100% - 60px) !important;
//           height: 100% !important;
//           overflow: hidden !important;
//           clip-path: inset(0) !important;
//           display: flex !important;
//           align-items: center !important;
//           position: relative !important;
//         }

//         /* ✅ FIXED: Proper scrolling content with accurate animation */
//         .scroll-notification-content {
//           display: flex !important;
//           align-items: center !important;
//           gap: 20px !important;
//           padding: 16px 40px !important;
//           min-height: 60px !important;
//           animation: seamlessScroll var(--animation-duration, 15s) linear infinite !important;
//           will-change: transform !important;
//           backface-visibility: hidden !important;
//           perspective: 1000px !important;
//           white-space: nowrap !important;
//           flex-shrink: 0 !important;
//         }

//         .scroll-notification-item {
//           display: flex !important;
//           align-items: center !important;
//           gap: 12px !important;
//           color: ${notificationStyle.text} !important;
//           flex-shrink: 0 !important;
//           white-space: nowrap !important;
//         }

//         .scroll-notification-icon {
//           color: ${notificationStyle.iconColor} !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           flex-shrink: 0 !important;
//           min-width: 20px !important;
//         }

//         .scroll-notification-text {
//           font-size: 14px !important;
//           font-weight: 600 !important;
//           letter-spacing: 0.3px !important;
//           text-transform: uppercase !important;
//           white-space: nowrap !important;
//         }

//         .scroll-notification-message {
//           font-size: 13px !important;
//           font-weight: 500 !important;
//           opacity: 0.95 !important;
//           text-transform: none !important;
//           letter-spacing: 0 !important;
//           white-space: nowrap !important;
//         }

//         .notification-divider {
//           width: 1px !important;
//           height: 24px !important;
//           background: ${notificationStyle.border} !important;
//           margin: 0 10px !important;
//           flex-shrink: 0 !important;
//           opacity: 0.8 !important;
//         }

//         /* ✅ FIXED: Close button positioned outside scroll area */
//         .scroll-notification-close {
//           position: absolute !important;
//           right: 16px !important;
//           top: 50% !important;
//           transform: translateY(-50%) !important;
//           background: none !important;
//           border: none !important;
//           color: ${notificationStyle.iconColor} !important;
//           cursor: pointer !important;
//           padding: 8px 12px !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           z-index: 100 !important;
//           transition: all 0.2s ease !important;
//           border-radius: 6px !important;
//           flex-shrink: 0 !important;
//         }

//         .scroll-notification-close:hover {
//           background: ${notificationStyle.accent} !important;
//           color: ${notificationStyle.iconColor} !important;
//           transform: translateY(-50%) scale(1.1) !important;
//         }

//         .scroll-notification-close:active {
//           transform: translateY(-50%) scale(0.95) !important;
//         }

//         /* Mobile responsiveness */
//         @media (max-width: 768px) {
//           .banner-scroll-notification {
//             padding: 0 !important;
//           }

//           .scroll-notification-container {
//             width: calc(100% - 50px) !important;
//           }

//           .scroll-notification-content {
//             padding: 12px 20px !important;
//             gap: 15px !important;
//             min-height: 50px !important;
//           }

//           .scroll-notification-text {
//             font-size: 12px !important;
//           }

//           .scroll-notification-message {
//             font-size: 11px !important;
//           }

//           .notification-divider {
//             height: 20px !important;
//             margin: 0 8px !important;
//           }

//           .scroll-notification-close {
//             right: 10px !important;
//             padding: 6px 10px !important;
//           }

//           .scroll-notification-icon {
//             min-width: 18px !important;
//           }
//         }

//         /* Respect user's motion preferences */
//         @media (prefers-reduced-motion: reduce) {
//           .scroll-notification-content {
//             animation: none !important;
//             transform: none !important;
//           }
//         }
//       `}</style>

//       <div className="banner-scroll-notification" ref={containerRef}>
//         {/* ✅ FIXED: Scroll container with strict clipping */}
//         <div className="scroll-notification-container">
//           <div className="scroll-notification-content" ref={contentRef}>
//             {/* First item */}
//             <div className="scroll-notification-item">
//               <div className="scroll-notification-icon">
//                 {getIconComponent(notification.type)}
//               </div>
//               <span className="scroll-notification-text">
//                 {notification.title || "Update"}
//               </span>
//               {notification.message && (
//                 <>
//                   <div className="notification-divider"></div>
//                   <span className="scroll-notification-message">
//                     {notification.message}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Spacer between items */}
//             <div style={{ 
//               width: "2px", 
//               height: "30px", 
//               background: notificationStyle.border,
//               flexShrink: 0,
//               opacity: 0.5,
//               margin: "0 10px"
//             }}></div>

//             {/* Duplicate for seamless loop */}
//             <div className="scroll-notification-item">
//               <div className="scroll-notification-icon">
//                 {getIconComponent(notification.type)}
//               </div>
//               <span className="scroll-notification-text">
//                 {notification.title || "Update"}
//               </span>
//               {notification.message && (
//                 <>
//                   <div className="notification-divider"></div>
//                   <span className="scroll-notification-message">
//                     {notification.message}
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ✅ FIXED: Close button - positioned absolutely, outside scroll area */}
//         <button 
//           className="scroll-notification-close"
//           onClick={() => {
//             setIsVisible(false);
//             if (onClose) onClose();
//           }}
//           aria-label="Close notification"
//           title="Close notification"
//         >
//           <X size={18} />
//         </button>
//       </div>
//     </>
//   );
// };

// export default BannerScrollNotification;
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  AlertCircle,
  Info,
  CheckCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const BannerScrollNotification = ({
  notifications = [],
  speed = 45,
}) => {
  const trackRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(30);

  // ✅ Duplicate items for infinite smooth loop
  const duplicatedNotifications = useMemo(() => {
    return [...notifications, ...notifications];
  }, [notifications]);

  // ✅ Dynamic speed based on content width
  useEffect(() => {
    if (!trackRef.current) return;

    const width = trackRef.current.scrollWidth / 2;

    // px per second
    const duration = width / speed;

    setAnimationDuration(duration);
  }, [notifications, speed]);

  const getIconComponent = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} />;
      case "warning":
        return <AlertCircle size={18} />;
      case "info":
        return <Info size={18} />;
      case "trending":
        return <TrendingUp size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  const getNotificationStyles = (type) => {
    const styles = {
      success: {
        glow: "rgba(16,185,129,0.5)",
        bg: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.4)",
        icon: "#10b981",
        text: "#d1fae5",
      },

      warning: {
        glow: "rgba(245,158,11,0.5)",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.4)",
        icon: "#f59e0b",
        text: "#fef3c7",
      },

      info: {
        glow: "rgba(59,130,246,0.5)",
        bg: "rgba(59,130,246,0.12)",
        border: "rgba(59,130,246,0.4)",
        icon: "#3b82f6",
        text: "#dbeafe",
      },

      trending: {
        glow: "rgba(168,85,247,0.5)",
        bg: "rgba(168,85,247,0.12)",
        border: "rgba(168,85,247,0.4)",
        icon: "#a855f7",
        text: "#f3e8ff",
      },

      default: {
        glow: "rgba(255,107,157,0.5)",
        bg: "rgba(255,107,157,0.12)",
        border: "rgba(255,107,157,0.4)",
        icon: "#ff6b9d",
        text: "#ffe4ef",
      },
    };

    return styles[type] || styles.default;
  };

  return (
    <>
      <style>{`
        .notification-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          z-index: 100;
          backdrop-filter: blur(18px);
          border-top: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(
              90deg,
              rgba(10,15,30,0.92),
              rgba(17,24,39,0.88),
              rgba(10,15,30,0.92)
            );
        }

        .notification-fade-left,
        .notification-fade-right {
          position: absolute;
          top: 0;
          width: 120px;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .notification-fade-left {
          left: 0;
          background: linear-gradient(
            to right,
            rgba(10,15,30,1),
            transparent
          );
        }

        .notification-fade-right {
          right: 0;
          background: linear-gradient(
            to left,
            rgba(10,15,30,1),
            transparent
          );
        }

        .notification-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: infiniteScroll linear infinite;
          will-change: transform;
          padding: 14px 0;
        }

        @keyframes infiniteScroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .notification-card {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-right: 28px;
          padding: 14px 24px;
          border-radius: 18px;
          min-width: max-content;
          backdrop-filter: blur(20px);
          border: 1px solid;
          box-shadow:
            0 0 0 rgba(0,0,0,0),
            0 8px 30px rgba(0,0,0,0.25);
          transition: transform 0.3s ease;
        }

        .notification-card:hover {
          transform: translateY(-2px) scale(1.01);
        }

        .notification-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .notification-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notification-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .notification-message {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.95;
          line-height: 1.4;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 18px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .live-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ff4d6d;
          box-shadow: 0 0 12px #ff4d6d;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.4);
            opacity: 0.6;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .notification-card {
            padding: 12px 18px;
            margin-right: 18px;
          }

          .notification-title {
            font-size: 11px;
          }

          .notification-message {
            font-size: 12px;
          }

          .notification-icon {
            width: 36px;
            height: 36px;
            min-width: 36px;
          }

          .notification-fade-left,
          .notification-fade-right {
            width: 60px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .notification-track {
            animation: none !important;
          }
        }
      `}</style>

      <div className="notification-wrapper">
        <div className="notification-fade-left" />
        <div className="notification-fade-right" />

        <div
          ref={trackRef}
          className="notification-track"
          style={{
            animationDuration: `${animationDuration}s`,
          }}
        >
          {/* LIVE badge */}
          <div className="live-badge">
            <div className="live-dot" />
            LIVE UPDATES
          </div>

          {duplicatedNotifications.map((notification, index) => {
            const style = getNotificationStyles(
              notification.type
            );

            return (
              <div
                key={`${notification.id}-${index}`}
                className="notification-card"
                style={{
                  background: style.bg,
                  borderColor: style.border,
                  boxShadow: `0 0 25px ${style.glow}`,
                }}
              >
                <div
                  className="notification-icon"
                  style={{
                    background: style.bg,
                    color: style.icon,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  {getIconComponent(notification.type)}
                </div>

                <div className="notification-content">
                  <div
                    className="notification-title"
                    style={{
                      color: style.icon,
                    }}
                  >
                    {notification.title || "Update"}
                  </div>

                  <div
                    className="notification-message"
                    style={{
                      color: style.text,
                    }}
                  >
                    {notification.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BannerScrollNotification;