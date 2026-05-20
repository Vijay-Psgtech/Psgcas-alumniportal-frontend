import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Zap, Users, Globe, Sparkles, RefreshCw } from "lucide-react";
import AuthCard from "../sections/Authcard.jsx";
import LoginCard from "../sections/Logincard.jsx";
import BgImage from "../assets/Banner/B1.webp";
import BannerScrollNotification from "../pages/BannerScrollNotification";
import {
  cacheService,
  notificationService,
  bannerService,
} from "../services/api.js";

const generateParticles = (count = 20) => {
  return Array.from({ length: count }).map(() => ({
    left: Math.random() * 100,
    tx: (Math.random() - 0.5) * 200,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
  }));
};

const EpicBanner = () => {
  const [authMode, setAuthMode] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const notificationTimerRef = React.useRef(null);
  const refetchIntervalRef = React.useRef(null);

  const particles = useMemo(() => generateParticles(20), []);

  const getDefaultBannerData = () => ({
    title: "Connect, Grow & Lead Together",
    description:
      "Join an exclusive global community where alumni collaborate and grow.",
    image: BgImage,
  });

  const getDefaultNotifications = () => [
    { 
      id: "default-1",
      title: "Welcome to PSG Alumni Portal 🎉",
      message: "Join 12K+ alumni members connecting across 35+ countries",
      type: "success"
    },
    { 
      id: "default-2",
      title: "New Events are Live 🚀",
      message: "Check out our upcoming networking sessions and workshops",
      type: "info"
    },
    { 
      id: "default-3",
      title: "Limited Spots Available ⏰",
      message: "Early bird registration closing soon - Register now!",
      type: "warning"
    },
    { 
      id: "default-4",
      title: "Alumni Success Stories 📖",
      message: "Read how our alumni are making global impact",
      type: "trending"
    },
  ];

  const features = [
    { icon: Users, text: "30K+ Alumni Connected" },
    { icon: Globe, text: "35+ Countries" },
    { icon: Sparkles, text: "200+ Annual Events" },
  ];

  const fetchBannerData = useCallback(async () => {
    try {
      const cached = cacheService.get("activeBanner");
      if (cached) return setBannerData(cached);

      const res = await bannerService.getActiveBanner();
      if (res?.success) {
        setBannerData(res.data);
        cacheService.set("activeBanner", res.data);
      } else {
        setBannerData(getDefaultBannerData());
      }
    } catch {
      setBannerData(getDefaultBannerData());
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const cached = cacheService.get("activeNotifications");
      if (cached?.length) {
        setNotifications(cached);
        setShowNotification(true);
        return;
      }

      const res = await notificationService.getActiveNotifications();
      
      const data = (res?.success && res.data?.length > 0) 
        ? res.data 
        : getDefaultNotifications();

      console.log("📌 Notifications loaded:", data.length, "items");
      setNotifications(data);
      cacheService.set("activeNotifications", data);
      setShowNotification(true);
    } catch (error) {
      console.warn("⚠️ Failed to fetch notifications:", error.message);
      const fallback = getDefaultNotifications();
      setNotifications(fallback);
      setShowNotification(true);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchBannerData(), fetchNotifications()]);
      setLoading(false);
    };

    load();

    // ✅ IMPROVED: Set refetch interval (every 5 seconds to refresh data)
    refetchIntervalRef.current = setInterval(() => {
      setIsRefreshing(true);
      cacheService.clear("activeBanner");
      cacheService.clear("activeNotifications");
      Promise.all([fetchBannerData(), fetchNotifications()])
        .then(() => setIsRefreshing(false));
    }, 5000);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [fetchBannerData, fetchNotifications]);

  // ✅ CRITICAL: Notification cycling timer (synced with animation)
  // Animation is 12 seconds, but we cycle every 6 seconds for better UX
  useEffect(() => {
    if (!showNotification || notifications.length === 0) return;

    notificationTimerRef.current = setTimeout(() => {
      setCurrentNotificationIndex(
        (prev) => (prev + 1) % notifications.length
      );
    }, 6000);  // ✅ 6 seconds - gives smooth transition before animation completes

    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, [showNotification, notifications, currentNotificationIndex]);

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
  };

  return (
    // ✅ FIXED: Removed pb padding - notification is fixed position, won't overlap
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      />
     <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-blue-800/60" />

      {/* Animated Orbs */}
      <div className="absolute w-[800px] h-[900px] bg-pink-500/30 blur-[100px] rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[800px] h-[600px] bg-blue-500/30 blur-[100px] rounded-full bottom-[-200px] right-[-200px]" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse"
            style={{
             left: `${p.left}%`,
              transform: `translateX(${p.tx})`,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT - Text Content */}
        <div className="text-white flex flex-col justify-center h-full">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-22 w-40 bg-white/20 rounded" />
              <div className="h-12 w-3/4 bg-white/20 rounded" />
              <div className="h-4 w-full bg-white/20 rounded" />
              <div className="h-4 w-2/3 bg-white/20 rounded" />
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-400/30 rounded-full text-xs font-semibold text-pink-300 mb-6">
                <Sparkles size={14} />
                Welcome to Excellence
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold mb-6">
                {bannerData?.title}
              </h1>

              <p className="text-lg opacity-80 mb-8 max-w-md">
                {bannerData?.description}
              </p>

              <div className="space-y-4 mb-10">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-semibold">{f.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* ✅ Refresh indicator */}
              {isRefreshing && (
                <div className="flex items-center gap-2 text-xs text-pink-300 mb-4">
                  <RefreshCw size={12} className="animate-spin" />
                  Updating notifications...
                </div>
              )}

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setAuthMode("signup")}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-800 font-bold flex items-center gap-2 hover:scale-105 transition"
                >
                  <Zap size={16} />
                  Join Now
                </button>

                <button
                  onClick={() => setAuthMode("login")}
                  className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT - Authentication Cards */}
        {/* <div className="relative">
          <div className="rounded-2xl p-0.5 bg-linear-to-r from-pink-500/40 to-blue-500/40">
            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10">

              {authMode === "login" && (
                <LoginCard onSwitchToSignup={() => setAuthMode("signup")} />
              )}

              {authMode === "signup" && (
                <AuthCard onSwitchToLogin={() => setAuthMode("login")} />
              )}

              {!authMode && (
                <div className="text-center text-white">
                  <h3 className="text-lg font-bold mb-2">Welcome</h3>
                  <p className="text-sm opacity-70 mb-4">
                    Login or create account to continue
                  </p>
                  <button
                    onClick={() => setAuthMode("login")}
                    className="px-4 py-2 bg-pink-500 rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              )}

            </div>
          </div>
        </div> */}
      </div>

      {/* ✅ NOTIFICATIONS BANNER - Fixed positioning with proper integration */}
      {showNotification && notifications.length > 0 && (
        <BannerScrollNotification
          // ✅ Key forces component to remount on notification change (fresh animation)
          key={notifications[currentNotificationIndex]?.id}
          notification={notifications[currentNotificationIndex]}
          onClose={handleNotificationClose}
          total={notifications.length}
          current={currentNotificationIndex + 1}
        />
      )}
    </div>
  );
};

export default EpicBanner;