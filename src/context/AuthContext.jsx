import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/auth/profile`, {
      credentials: "include", // sends the HttpOnly cookie automatically
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const freshUser = data?.alumni ?? data?.user ?? data ?? null;
        if (freshUser) {
          setUser(freshUser);
        } else {
          throw new Error("No user in response");
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // ── login: called after a successful /auth/login response ───────
  // The server has already set the cookie; we just store user data in state.
  const login = useCallback(async (userData) => {
    setUser(userData);
    // Optionally re-fetch to get the absolute latest profile
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const freshUser = data?.alumni ?? data?.user ?? data ?? null;
        if (freshUser) setUser(freshUser);
      }
    } catch (err) {
      console.error("Failed to refresh user after login", err);
    }
  }, []);

  // ── logout: ask server to clear the cookie ───────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    }
    setUser(null);
  }, []);

  // ── refreshUser: re-fetch profile from server ───────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      const freshUser = data?.alumni ?? data?.user ?? data ?? null;
      if (freshUser) {
        setUser(freshUser);
      }
    } catch {
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
