import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type AuthState = {
  isLoggedIn: boolean;
  name: string;
  logIn: () => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logIn = useCallback(() => setIsLoggedIn(true), []);
  const logOut = useCallback(() => setIsLoggedIn(false), []);

  const value = useMemo(
    () => ({ isLoggedIn, name: "Maya Rivera", logIn, logOut }),
    [isLoggedIn, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
