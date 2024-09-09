// src/context/AuthContext.tsx

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  auth: AuthState | null;
  login: (token: string, payload: any) => void;
  logout: () => void;
}

interface AuthState {
  token: string;
  payload?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth({ token });
    }
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem("authToken", token);
    setAuth({ token, payload: user });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
