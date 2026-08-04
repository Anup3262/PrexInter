import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("prexinterToken");

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await api.get("/auth/me");

      const currentUser = response.data?.user;

      if (!currentUser) {
        throw new Error("User data was not returned");
      }

      setUser(currentUser);
      return currentUser;
    } catch (error) {
      localStorage.removeItem("prexinterToken");
      setUser(null);
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        await refreshUser();
      } catch {
        // Invalid or expired token is already cleared in refreshUser.
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [refreshUser]);

  const login = useCallback((token, userData) => {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    localStorage.setItem("prexinterToken", token);
    setUser(userData || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("prexinterToken");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}