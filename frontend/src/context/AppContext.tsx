import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
} from "react";

export interface Entry {
  id: number;
  date: string;
  type: string;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
}

const AppStore = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [entries, setEntries] = useState<Entry[]>([]);

  // Restore session on refresh
  useEffect(() => {
    async function init() {
      if (!token) return; // no token => stay logged out

      try {
        const meRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If token invalid or expired
        if (meRes.status === 401) {
          console.warn("Invalid token, clearing session");
          setUser(null);
          setEntries([]);
          localStorage.removeItem("token");
          setToken(null);
          return;
        }

        const me = await meRes.json();
        setUser(me);

        const entRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (entRes.status === 401) {
          setEntries([]);
          return;
        }

        const entriesJson = await entRes.json();

        if (Array.isArray(entriesJson)) {
          setEntries(entriesJson);
        } else {
          console.warn("Entries response is not an array:", entriesJson);
          setEntries([]);
        }

      } catch (err) {
        console.error("Session restore failed", err);
        setToken(null);
        setUser(null);
        setEntries([]);
        localStorage.removeItem("token");
      }
    }

    init();
  }, [token]);

  const value: AppContextType = {
    user,
    setUser,
    token,
    setToken,
    entries,
    setEntries,
  };

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export const useApp = (): AppContextType => {
  const ctx = useContext(AppStore);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
