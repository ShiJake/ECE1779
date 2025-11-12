import React, { createContext, useContext, useState, useEffect, ReactNode, JSX } from "react";


export interface Entry {
id: number;
date: string;
type: string;
quantity: number;
}


export interface User {
email: string;
}


interface AppContextType {
user: User | null;
setUser: (user: User | null) => void;
entries: Entry[];
addEntry: (entry: Omit<Entry, "id">) => void;
}


const AppStore = createContext<AppContextType | undefined>(undefined);


function todayOffset(n: number): string {
const d = new Date();
d.setDate(d.getDate() + n);
return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}


const defaultEntries: Entry[] = [
{ id: 1, date: todayOffset(-2), type: "Run (min)", quantity: 30 },
{ id: 2, date: todayOffset(-1), type: "Push-ups (reps)", quantity: 50 },
{ id: 3, date: todayOffset(-1), type: "Cycling (min)", quantity: 45 },
{ id: 4, date: todayOffset(0), type: "Squats (reps)", quantity: 60 },
];


export function AppProvider({ children }: { children: ReactNode }): JSX.Element {
const [user, setUser] = useState<User | null>(null);
const [entries, setEntries] = useState<Entry[]>(() => JSON.parse(localStorage.getItem("fitness.entries") || "null") || defaultEntries);


useEffect(() => {
localStorage.setItem("fitness.entries", JSON.stringify(entries));
}, [entries]);


const addEntry = (entry: Omit<Entry, "id">) => setEntries((prev) => [...prev, { id: Date.now(), ...entry }]);


return <AppStore.Provider value={{ user, setUser, entries, addEntry }}>{children}</AppStore.Provider>;
}


export const useApp = (): AppContextType => {
const ctx = useContext(AppStore);
if (!ctx) throw new Error("useApp must be used within AppProvider");
return ctx;
};