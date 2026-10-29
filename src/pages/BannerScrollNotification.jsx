
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