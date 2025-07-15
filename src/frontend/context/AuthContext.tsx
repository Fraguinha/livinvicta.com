import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch<{ authenticated: boolean; user?: User }>(API_ENDPOINTS.AUTH_STATUS, {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.authenticated && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
