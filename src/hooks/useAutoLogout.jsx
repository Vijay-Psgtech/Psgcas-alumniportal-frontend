import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return; // do nothing if not logged In

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("Session Expired, Please Login again");
        logout();
      }, timeout);
    };
    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [user, logout, timeout]);
};

export default useAutoLogout;
