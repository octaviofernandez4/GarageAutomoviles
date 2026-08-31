import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginRequest, fetchMe } from "../api/auth.js";

const AdminAuthContext = createContext(null);
const STORAGE_KEY = "admin_token";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState(token ? "loading" : "anonymous");

  useEffect(() => {
    if (!token) {
      setStatus("anonymous");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    fetchMe(token)
      .then((data) => {
        if (cancelled) return;
        setAdmin(data.admin);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setAdmin(null);
        setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    localStorage.setItem(STORAGE_KEY, data.token);
    setAdmin(data.admin);
    setToken(data.token);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAdmin(null);
    setStatus("anonymous");
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, admin, status, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }
  return ctx;
}
